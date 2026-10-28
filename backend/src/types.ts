export type MealType = "breakfast" | "lunch" | "dinner";

export type VoteValue = "yes" | "maybe" | "no";

export type MemberRole = "admin" | "member";

export interface Member {
  id: string;
  firstName: string;
  /** Dopełniacz imienia, np. „Propozycja Oli”. */
  firstNameGenitive: string;
  fullName: string;
  role: MemberRole;
  color: string;
}

export interface Household {
  id: string;
  name: string;
  members: Member[];
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTimeMinutes: number;
  ingredients: Ingredient[];
}

export interface FridgeItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface Vote {
  memberId: string;
  value: VoteValue;
  votedAt: string;
}

export interface Proposal {
  id: string;
  date: string;
  mealType: MealType;
  recipeId: string | null;
  name: string;
  proposedBy: string;
  createdAt: string;
  votes: Vote[];
}

export interface IngredientAvailability extends Ingredient {
  inFridge: boolean;
}

export interface RecipeView extends Omit<Recipe, "ingredients"> {
  ingredients: IngredientAvailability[];
}

export interface VoteSummary {
  yes: number;
  maybe: number;
  no: number;
  pendingMemberIds: string[];
}

export type ProposalStatus = "open" | "accepted" | "rejected";

export interface ProposalView extends Proposal {
  recipe: RecipeView | null;
  summary: VoteSummary;
  status: ProposalStatus;
}

export interface NewProposalInput {
  date: string;
  mealType: MealType;
  recipeId?: string;
  name?: string;
}
