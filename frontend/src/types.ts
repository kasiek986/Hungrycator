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

export type ProductCategory =
  | "vegetables"
  | "fruit"
  | "dairy"
  | "meat"
  | "bakery"
  | "other";

export type Unit = "szt." | "opak." | "g" | "kg" | "ml" | "l";

/** Gotowa opcja albo „date”, czyli własna data ważności. */
export type Expiry = "soon" | "week" | "later" | "date";

export interface FridgeItem {
  id: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  unit: Unit;
  expiry: Expiry;
  /** Własna data ważności (RRRR-MM-DD) albo null przy gotowej opcji. */
  expiresOn: string | null;
  /** Ile dni zostało do końca terminu – wylicza serwer. */
  daysLeft: number | null;
  /** Czy produkt jest w sekcji „Zjedz mnie najpierw” – wylicza serwer. */
  eatFirst: boolean;
}

export type NewFridgeItem = Omit<FridgeItem, "id" | "daysLeft" | "eatFirst">;
