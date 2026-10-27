import type { MealType, Member } from "../types";

export const MEAL_TYPES: readonly MealType[] = ["breakfast", "lunch", "dinner"];

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Śniadanie",
  lunch: "Obiad",
  dinner: "Kolacja",
};

// Biernik – „propozycja na kolację”.
export const MEAL_LABELS_ACCUSATIVE: Record<MealType, string> = {
  breakfast: "śniadanie",
  lunch: "obiad",
  dinner: "kolację",
};

const WEEKDAYS = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
];

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function weekdayName(date: Date): string {
  return WEEKDAYS[date.getDay()] ?? "";
}

export function defaultMealType(date: Date): MealType {
  const hour = date.getHours();
  if (hour >= 4 && hour < 11) {
    return "breakfast";
  }
  if (hour >= 11 && hour < 16) {
    return "lunch";
  }
  return "dinner";
}

export function joinNames(names: string[]): string {
  if (names.length <= 1) {
    return names.join("");
  }
  return `${names.slice(0, -1).join(", ")} i ${names[names.length - 1]}`;
}

export function memberById(members: Member[], id: string): Member | undefined {
  return members.find((member) => member.id === id);
}
