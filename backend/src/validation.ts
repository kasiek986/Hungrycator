import { ApiError } from "./errors.js";
import type { MealType, NewProposalInput, VoteValue } from "./types.js";

const MEAL_TYPES: readonly MealType[] = ["breakfast", "lunch", "dinner"];
const VOTE_VALUES: readonly VoteValue[] = ["yes", "maybe", "no"];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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
