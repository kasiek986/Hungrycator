// Typy odpowiadające kontraktowi API z backend/src/types.ts.

export type MealType = "breakfast" | "lunch" | "dinner";

export type VoteValue = "yes" | "maybe" | "no";

export interface Member {
  id: string;
  firstName: string;
  firstNameGenitive: string;
  fullName: string;
  role: "admin" | "member";
  color: string;
}

export interface Household {
  id: string;
  name: string;
  members: Member[];
}

export interface IngredientAvailability {
  name: string;
  amount: string;
  inFridge: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTimeMinutes: number;
  ingredients: IngredientAvailability[];
}

export interface Vote {
  memberId: string;
  value: VoteValue;
  votedAt: string;
}

export interface VoteSummary {
  yes: number;
  maybe: number;
  no: number;
  pendingMemberIds: string[];
}

export type ProposalStatus = "open" | "accepted" | "rejected";

export interface Proposal {
  id: string;
  date: string;
  mealType: MealType;
  recipeId: string | null;
  name: string;
  proposedBy: string;
  createdAt: string;
  votes: Vote[];
  recipe: Recipe | null;
  summary: VoteSummary;
  status: ProposalStatus;
}

export type NewProposal =
  | { date: string; mealType: MealType; recipeId: string }
  | { date: string; mealType: MealType; name: string };
