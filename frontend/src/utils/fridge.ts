import type { Expiry, ProductCategory, Unit } from "../types";
import { toIsoDate } from "./meals";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  vegetables: "Warzywa",
  fruit: "Owoce",
  dairy: "Nabiał",
  meat: "Mięso i ryby",
  bakery: "Pieczywo",
  other: "Inne",
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[];

export const UNITS: readonly Unit[] = ["szt.", "opak.", "g", "kg", "ml", "l"];

// NFR-06: termin wybiera się jednym kliknięciem; „Inna data” to opcja
// dla produktów z konkretną datą na opakowaniu.
export const EXPIRY_LABELS: Record<Expiry, string> = {
  soon: "Do 3 dni",
  week: "Do tygodnia",
  later: "Ponad tydzień",
  date: "Inna data",
};

export const EXPIRY_OPTIONS = Object.keys(EXPIRY_LABELS) as Expiry[];

const DAY_MS = 24 * 60 * 60 * 1000;

/** Dzisiejsza data w formacie RRRR-MM-DD (np. jako minimum w kalendarzu). */
export const todayIso = (): string => toIsoDate(new Date());

/** Liczba dni od dzisiaj do podanej daty RRRR-MM-DD. */
export const daysUntil = (isoDate: string): number =>
  Math.round((Date.parse(isoDate) - Date.parse(todayIso())) / DAY_MS);

/** „2026-12-05” → „05.12.2026”. */
export const formatDate = (isoDate: string): string =>
  isoDate.split("-").reverse().join(".");

export function describeDaysLeft(days: number): string {
  if (days < 0) {
    return "po terminie";
  }
  if (days === 0) {
    return "ważne do dziś";
  }
  return `jeszcze ${days} ${days === 1 ? "dzień" : "dni"}`;
}
