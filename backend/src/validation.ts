import { ApiError } from "./errors.js";
import { MAX_QUANTITY } from "./store/fridgeStore.js";
import type {
  Expiry,
  MealType,
  NewFridgeItemInput,
  NewProposalInput,
  ProductCategory,
  Unit,
  VoteValue,
} from "./types.js";

const MEAL_TYPES: readonly MealType[] = ["breakfast", "lunch", "dinner"];
const VOTE_VALUES: readonly VoteValue[] = ["yes", "maybe", "no"];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const CATEGORIES: readonly ProductCategory[] = [
  "vegetables",
  "fruit",
  "dairy",
  "meat",
  "bakery",
  "other",
];
const UNITS: readonly Unit[] = ["szt.", "opak.", "g", "kg", "ml", "l"];
const EXPIRY_OPTIONS: readonly Expiry[] = ["soon", "week", "later", "date"];
export const MAX_PRODUCT_NAME_LENGTH = 40;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Sprawdza, czy wartość jest jedną z dozwolonych opcji.
function parseOption<T extends string>(
  value: unknown,
  allowed: readonly T[],
  message: string,
): T {
  if (
    typeof value !== "string" ||
    !allowed.some((option) => option === value)
  ) {
    throw new ApiError(400, message);
  }
  return value as T;
}

export function parseDate(value: unknown): string {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) {
    throw new ApiError(400, "Data musi mieć format RRRR-MM-DD.");
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    throw new ApiError(400, "Nieprawidłowa data.");
  }
  return value;
}

export function parseMealType(value: unknown): MealType {
  if (
    typeof value !== "string" ||
    !(MEAL_TYPES as readonly string[]).includes(value)
  ) {
    throw new ApiError(
      400,
      "Rodzaj posiłku musi być jednym z: breakfast, lunch, dinner.",
    );
  }
  return value as MealType;
}

export function parseVoteValue(body: unknown): VoteValue {
  const value = isRecord(body) ? body.value : undefined;
  if (
    typeof value !== "string" ||
    !(VOTE_VALUES as readonly string[]).includes(value)
  ) {
    throw new ApiError(400, "Głos musi mieć wartość: yes, maybe lub no.");
  }
  return value as VoteValue;
}

export function parseNewProposal(body: unknown): NewProposalInput {
  if (!isRecord(body)) {
    throw new ApiError(400, "Brak danych propozycji.");
  }
  const input: NewProposalInput = {
    date: parseDate(body.date),
    mealType: parseMealType(body.mealType),
  };
  const { recipeId, name } = body;

  if (typeof recipeId === "string" && recipeId.length > 0) {
    input.recipeId = recipeId;
  } else if (typeof name === "string") {
    input.name = name;
  } else {
    throw new ApiError(400, "Wybierz przepis albo wpisz nazwę dania.");
  }
  return input;
}

export function parseNewFridgeItem(body: unknown): NewFridgeItemInput {
  if (!isRecord(body)) {
    throw new ApiError(400, "Brak danych produktu.");
  }
  const name =
    typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  if (name.length === 0 || name.length > MAX_PRODUCT_NAME_LENGTH) {
    throw new ApiError(
      400,
      `Nazwa produktu musi mieć od 1 do ${MAX_PRODUCT_NAME_LENGTH} znaków.`,
    );
  }
  const { quantity } = body;
  if (
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_QUANTITY
  ) {
    throw new ApiError(
      400,
      `Ilość musi być liczbą całkowitą od 1 do ${MAX_QUANTITY}.`,
    );
  }
  const product = {
    name,
    category: parseOption(body.category, CATEGORIES, "Wybierz kategorię."),
    quantity,
    unit: parseOption(body.unit, UNITS, "Wybierz jednostkę."),
  };
  const expiry = parseOption(body.expiry, EXPIRY_OPTIONS, "Wybierz termin.");
  // Przy opcji „Inna data” potrzebna jest poprawna data ważności.
  return expiry === "date"
    ? { ...product, expiry, expiresOn: parseDate(body.expiresOn) }
    : { ...product, expiry, expiresOn: null };
}

// Ilość zmienia się przyciskami „+” i „−”, czyli zawsze o jeden.
export function parseQuantityChange(body: unknown): number {
  const change = isRecord(body) ? body.change : undefined;
  if (change !== 1 && change !== -1) {
    throw new ApiError(400, "Ilość można zmienić tylko o 1 lub −1.");
  }
  return change;
}
