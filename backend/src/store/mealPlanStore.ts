import { randomUUID } from "node:crypto";
import { formatAmount, inTransaction, type Database } from "../db/database.js";
import { ApiError } from "../errors.js";
import { normalize } from "../text.js";
import type {
  Household,
  Member,
  MealType,
  NewProposalInput,
  Proposal,
  ProposalStatus,
  ProposalView,
  Recipe,
  RecipeView,
  Vote,
  VoteSummary,
  VoteValue,
} from "../types.js";
import type { FridgeStore } from "./fridgeStore.js";

export const MAX_PROPOSAL_NAME_LENGTH = 60;

export interface MealPlanStoreOptions {
  db: Database;
  householdId: string;
  fridge: FridgeStore;
  now?: () => Date;
}

// Wiersze zwracane przez zapytania SQL
type MemberRow = {
  id: string;
  first_name: string;
  first_name_genitive: string;
  last_name: string;
  role: string;
  color: string;
};
type RecipeRow = {
  id: string;
  name: string;
  description: string;
  prep_time_minutes: number;
};
type IngredientRow = {
  name: string;
  quantity: number | null;
  unit: string | null;
};
type ProposalRow = {
  id: string;
  meal_date: string;
  meal_type: string;
  recipe_id: string | null;
  name: string;
  proposed_by: string;
  created_at: string;
};
type VoteRow = { user_id: string; value: string; voted_at: string };

const SELECT_MEMBERS = `
  SELECT u.id, u.first_name, u.first_name_genitive, u.last_name, m.role, m.color
  FROM memberships m
  JOIN users u ON u.id = m.user_id
  WHERE m.household_id = ?`;

// Przepisy z bazy wspólnej (household_id IS NULL) i własne przepisy gospodarstwa.
const SELECT_RECIPES = `
  SELECT id, name, description, prep_time_minutes
  FROM recipes
  WHERE (household_id IS NULL OR household_id = ?)`;

const SELECT_PROPOSALS = `
  SELECT id, meal_date, meal_type, recipe_id, name, proposed_by, created_at
  FROM meal_proposals
  WHERE household_id = ?`;

function toMember(row: MemberRow): Member {
  return {
    id: row.id,
    firstName: row.first_name,
    firstNameGenitive: row.first_name_genitive,
    fullName: `${row.first_name} ${row.last_name}`.trim(),
    role: row.role,
    color: row.color,
  } as Member;
}

/** Gospodarstwo, przepisy i propozycje posiłków – dane w bazie (S-02). */
export class MealPlanStore {
  private readonly db: Database;
  private readonly householdId: string;
  private readonly fridge: FridgeStore;
  private readonly now: () => Date;

  constructor(options: MealPlanStoreOptions) {
    this.db = options.db;
    this.householdId = options.householdId;
    this.fridge = options.fridge;
    this.now = options.now ?? (() => new Date());
  }

  getHousehold(): Household {
    const row = this.db
      .prepare("SELECT id, name FROM households WHERE id = ?")
      .get(this.householdId) as { id: string; name: string } | undefined;
    if (!row) {
      throw new ApiError(404, "Nie znaleziono gospodarstwa.");
    }
    return { id: row.id, name: row.name, members: this.listMembers() };
  }

  findMember(memberId: string): Member | undefined {
    const row = this.db
      .prepare(`${SELECT_MEMBERS} AND u.id = ?`)
      .get(this.householdId, memberId) as unknown as MemberRow | undefined;
    return row ? toMember(row) : undefined;
  }

  listRecipes(query = ""): RecipeView[] {
    const needle = normalize(query);
    return this.allRecipes()
      .filter((recipe) => normalize(recipe.name).includes(needle))
      .map((recipe) => this.toRecipeView(recipe));
  }

  listProposals(date: string, mealType: MealType): ProposalView[] {
    return this.proposalsFor(date, mealType)
      .map((proposal) => this.toProposalView(proposal))
      .sort(
        (a, b) =>
          b.summary.yes - a.summary.yes ||
          a.createdAt.localeCompare(b.createdAt),
      );
  }

  createProposal(memberId: string, input: NewProposalInput): ProposalView {
    const recipe = this.resolveRecipe(input);
    const name = recipe ? recipe.name : this.validateCustomName(input.name);

    const duplicate = this.proposalsFor(input.date, input.mealType).find(
      (proposal) => normalize(proposal.name) === normalize(name),
    );
    if (duplicate) {
      throw new ApiError(409, `„${name}” jest już na karcie dnia.`);
    }

    const timestamp = this.now().toISOString();
    const proposal: Proposal = {
      id: randomUUID(),
      date: input.date,
      mealType: input.mealType,
      recipeId: recipe ? recipe.id : null,
      name,
      proposedBy: memberId,
      createdAt: timestamp,
      // Osoba proponująca danie automatycznie głosuje „Tak” – może to zmienić.
      votes: [{ memberId, value: "yes", votedAt: timestamp }],
    };

    // Propozycja i pierwszy głos zapisują się razem albo wcale.
    inTransaction(this.db, () => {
      this.db
        .prepare(
          `INSERT INTO meal_proposals (id, household_id, meal_date, meal_type, recipe_id, name, proposed_by, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          proposal.id,
          this.householdId,
          proposal.date,
          proposal.mealType,
          proposal.recipeId,
          proposal.name,
          proposal.proposedBy,
          proposal.createdAt,
        );
      this.saveVote(proposal.id, memberId, "yes", timestamp);
    });
    return this.toProposalView(proposal);
  }

  castVote(
    memberId: string,
    proposalId: string,
    value: VoteValue,
  ): ProposalView {
    const proposal = this.getProposal(proposalId);
    this.saveVote(proposal.id, memberId, value, this.now().toISOString());
    return this.toProposalView(this.getProposal(proposalId));
  }

  deleteProposal(memberId: string, proposalId: string): void {
    const proposal = this.getProposal(proposalId);
    if (proposal.proposedBy !== memberId) {
      throw new ApiError(403, "Propozycję może wycofać tylko jej autor.");
    }
    // Głosy usuwa baza (ON DELETE CASCADE w tabeli votes).
    this.db
      .prepare("DELETE FROM meal_proposals WHERE id = ? AND household_id = ?")
      .run(proposalId, this.householdId);
  }

  // Jeden głos na osobę: kolejny głos tej samej osoby nadpisuje poprzedni.
  private saveVote(
    proposalId: string,
    memberId: string,
    value: VoteValue,
    votedAt: string,
  ): void {
    this.db
      .prepare(
        `INSERT INTO votes (proposal_id, user_id, value, voted_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT (proposal_id, user_id)
         DO UPDATE SET value = excluded.value, voted_at = excluded.voted_at`,
      )
      .run(proposalId, memberId, value, votedAt);
  }

  private listMembers(): Member[] {
    const rows = this.db
      .prepare(`${SELECT_MEMBERS} ORDER BY m.joined_at, m.rowid`)
      .all(this.householdId) as unknown as MemberRow[];
    return rows.map(toMember);
  }

  private allRecipes(): Recipe[] {
    const rows = this.db
      .prepare(`${SELECT_RECIPES} ORDER BY rowid`)
      .all(this.householdId) as unknown as RecipeRow[];
    return rows.map((row) => this.toRecipe(row));
  }

  private findRecipe(recipeId: string): Recipe | null {
    const row = this.db
      .prepare(`${SELECT_RECIPES} AND id = ?`)
      .get(this.householdId, recipeId) as unknown as RecipeRow | undefined;
    return row ? this.toRecipe(row) : null;
  }

  private toRecipe(row: RecipeRow): Recipe {
    const ingredients = this.db
      .prepare(
        "SELECT name, quantity, unit FROM recipe_ingredients WHERE recipe_id = ? ORDER BY position",
      )
      .all(row.id) as unknown as IngredientRow[];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      prepTimeMinutes: row.prep_time_minutes,
      ingredients: ingredients.map((ingredient) => ({
        name: ingredient.name,
        amount: formatAmount(ingredient.quantity, ingredient.unit),
      })),
    };
  }

  private proposalsFor(date: string, mealType: MealType): Proposal[] {
    const rows = this.db
      .prepare(
        `${SELECT_PROPOSALS} AND meal_date = ? AND meal_type = ? ORDER BY created_at, rowid`,
      )
      .all(this.householdId, date, mealType) as unknown as ProposalRow[];
    return rows.map((row) => this.toProposal(row));
  }

  private getProposal(proposalId: string): Proposal {
    const row = this.db
      .prepare(`${SELECT_PROPOSALS} AND id = ?`)
      .get(this.householdId, proposalId) as unknown as ProposalRow | undefined;
    if (!row) {
      throw new ApiError(404, "Nie znaleziono propozycji.");
    }
    return this.toProposal(row);
  }

  private toProposal(row: ProposalRow): Proposal {
    const votes = this.db
      .prepare(
        "SELECT user_id, value, voted_at FROM votes WHERE proposal_id = ? ORDER BY rowid",
      )
      .all(row.id) as unknown as VoteRow[];
    return {
      id: row.id,
      date: row.meal_date,
      mealType: row.meal_type as MealType,
      recipeId: row.recipe_id,
      name: row.name,
      proposedBy: row.proposed_by,
      createdAt: row.created_at,
      votes: votes.map(
        (vote): Vote => ({
          memberId: vote.user_id,
          value: vote.value as VoteValue,
          votedAt: vote.voted_at,
        }),
      ),
    };
  }

  private resolveRecipe(input: NewProposalInput): Recipe | null {
    if (input.recipeId !== undefined) {
      const recipe = this.findRecipe(input.recipeId);
      if (!recipe) {
        throw new ApiError(404, "Nie znaleziono przepisu.");
      }
      return recipe;
    }
    // Nazwa wpisana ręcznie, która odpowiada przepisowi z bazy, jest
    // traktowana jak wybór tego przepisu (składniki pojawią się na karcie).
    if (input.name !== undefined) {
      const needle = normalize(input.name);
      return (
        this.allRecipes().find((recipe) => normalize(recipe.name) === needle) ??
        null
      );
    }
    return null;
  }

  private validateCustomName(rawName: string | undefined): string {
    const name = (rawName ?? "").trim().replace(/\s+/g, " ");
    if (name.length === 0) {
      throw new ApiError(400, "Wpisz nazwę dania.");
    }
    if (name.length > MAX_PROPOSAL_NAME_LENGTH) {
      throw new ApiError(
        400,
        `Nazwa dania może mieć maksymalnie ${MAX_PROPOSAL_NAME_LENGTH} znaków.`,
      );
    }
    return name;
  }

  // Składniki są porównywane z aktualnym stanem wspólnej lodówki (S-01).
  private toRecipeView(recipe: Recipe): RecipeView {
    return {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        inFridge: this.fridge.has(ingredient.name),
      })),
    };
  }

  private toProposalView(proposal: Proposal): ProposalView {
    const recipe = proposal.recipeId
      ? this.findRecipe(proposal.recipeId)
      : null;
    const summary = this.summarize(proposal);
    return {
      ...proposal,
      recipe: recipe ? this.toRecipeView(recipe) : null,
      summary,
      status: this.resolveStatus(summary),
    };
  }

  private summarize(proposal: Proposal): VoteSummary {
    const count = (value: VoteValue): number =>
      proposal.votes.filter((vote) => vote.value === value).length;
    const votedIds = new Set(proposal.votes.map((vote) => vote.memberId));
    return {
      yes: count("yes"),
      maybe: count("maybe"),
      no: count("no"),
      pendingMemberIds: this.listMembers()
        .map((member) => member.id)
        .filter((id) => !votedIds.has(id)),
    };
  }

  // Głosowanie kończy się, gdy zagłosują wszyscy domownicy.
  // Danie przechodzi, jeśli głosów „Tak” jest więcej niż „Nie”.
  private resolveStatus(summary: VoteSummary): ProposalStatus {
    if (summary.pendingMemberIds.length > 0) {
      return "open";
    }
    return summary.yes > summary.no ? "accepted" : "rejected";
  }
}
