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

export type ProductCategory =
  | "vegetables"
  | "fruit"
  | "dairy"
  | "meat"
  | "bakery"
  | "other";

export type Unit = "szt." | "opak." | "g" | "kg" | "ml" | "l";

/** Gotowe terminy wybierane jednym kliknięciem, bez wpisywania daty (NFR-06). */
export type ExpiryPreset = "soon" | "week" | "later";

export type Expiry = ExpiryPreset | "date";

/** Termin ważności: gotowa opcja albo własna data w formacie RRRR-MM-DD. */
export type ExpiryInfo =
  | { expiry: ExpiryPreset; expiresOn: null }
  | { expiry: "date"; expiresOn: string };

export type NewFridgeItemInput = {
  name: string;
  category: ProductCategory;
  quantity: number;
  unit: Unit;
} & ExpiryInfo;

export type FridgeItem = { id: string } & NewFridgeItemInput;

export type FridgeItemView = FridgeItem & {
  /** Ile dni zostało do końca terminu (tylko dla własnej daty). */
  daysLeft: number | null;
  /** Czy produkt trafia do sekcji „Zjedz mnie najpierw”. */
  eatFirst: boolean;
};

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
