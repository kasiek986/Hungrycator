import { randomUUID } from "node:crypto";
import { ApiError } from "../errors.js";
import type {
  FridgeItem,
  Household,
  Member,
  MealType,
  NewProposalInput,
  Proposal,
  ProposalStatus,
  ProposalView,
  Recipe,
  RecipeView,
  VoteSummary,
  VoteValue,
} from "../types.js";

export const MAX_PROPOSAL_NAME_LENGTH = 60;

const normalize = (value: string): string =>
  value.trim().toLocaleLowerCase("pl-PL").replace(/\s+/g, " ");

export interface MealPlanStoreOptions {
  household: Household;
  recipes: Recipe[];
  fridge: FridgeItem[];
  now?: () => Date;
}

export class MealPlanStore {
  private readonly household: Household;
  private readonly recipes: Recipe[];
  private readonly fridge: FridgeItem[];
  private readonly proposals: Proposal[] = [];
  private readonly now: () => Date;

  constructor(options: MealPlanStoreOptions) {
    this.household = options.household;
    this.recipes = options.recipes;
    this.fridge = options.fridge;
    this.now = options.now ?? (() => new Date());
  }

  getHousehold(): Household {
    return this.household;
  }

  findMember(memberId: string): Member | undefined {
    return this.household.members.find((member) => member.id === memberId);
  }

  listRecipes(query = ""): RecipeView[] {
    const needle = normalize(query);
    return this.recipes
      .filter((recipe) => normalize(recipe.name).includes(needle))
      .map((recipe) => this.toRecipeView(recipe));
  }

  listProposals(date: string, mealType: MealType): ProposalView[] {
    return this.proposals
      .filter(
        (proposal) => proposal.date === date && proposal.mealType === mealType,
      )
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

    const duplicate = this.proposals.find(
      (proposal) =>
        proposal.date === input.date &&
        proposal.mealType === input.mealType &&
        normalize(proposal.name) === normalize(name),
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
    this.proposals.push(proposal);
    return this.toProposalView(proposal);
  }

  castVote(
    memberId: string,
    proposalId: string,
    value: VoteValue,
  ): ProposalView {
    const proposal = this.getProposal(proposalId);
    const votedAt = this.now().toISOString();
    const existing = proposal.votes.find((vote) => vote.memberId === memberId);

    if (existing) {
      existing.value = value;
      existing.votedAt = votedAt;
    } else {
      proposal.votes.push({ memberId, value, votedAt });
    }
    return this.toProposalView(proposal);
  }

  deleteProposal(memberId: string, proposalId: string): void {
    const proposal = this.getProposal(proposalId);
    if (proposal.proposedBy !== memberId) {
      throw new ApiError(403, "Propozycję może wycofać tylko jej autor.");
    }
    this.proposals.splice(this.proposals.indexOf(proposal), 1);
  }

  private getProposal(proposalId: string): Proposal {
    const proposal = this.proposals.find((item) => item.id === proposalId);
    if (!proposal) {
      throw new ApiError(404, "Nie znaleziono propozycji.");
    }
    return proposal;
  }

  private resolveRecipe(input: NewProposalInput): Recipe | null {
    if (input.recipeId !== undefined) {
      const recipe = this.recipes.find((item) => item.id === input.recipeId);
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
        this.recipes.find((recipe) => normalize(recipe.name) === needle) ?? null
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

  private toRecipeView(recipe: Recipe): RecipeView {
    const fridgeNames = new Set(
      this.fridge
        .filter((item) => item.quantity > 0)
        .map((item) => normalize(item.name)),
    );
    return {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        inFridge: fridgeNames.has(normalize(ingredient.name)),
      })),
    };
  }

  private toProposalView(proposal: Proposal): ProposalView {
    const recipe = proposal.recipeId
      ? this.recipes.find((item) => item.id === proposal.recipeId)
      : undefined;
    const summary = this.summarize(proposal);
    return {
      ...proposal,
      votes: proposal.votes.map((vote) => ({ ...vote })),
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
      pendingMemberIds: this.household.members
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
