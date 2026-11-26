import { randomUUID } from "node:crypto";
import { ApiError } from "../errors.js";
import { normalize } from "../text.js";
import type {
  ExpiryPreset,
  FridgeItem,
  FridgeItemView,
  NewFridgeItemInput,
} from "../types.js";

export const MAX_QUANTITY = 999;

// Do „Zjedz mnie najpierw” trafia to, co traci ważność w ciągu 3 dni.
const EAT_FIRST_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

// Gotowe opcje traktujemy jak „najwyżej tyle dni do końca terminu”.
const PRESET_DAYS: Record<ExpiryPreset, number> = {
  soon: 3,
  week: 7,
  later: Infinity,
};

/** Data w lokalnej strefie czasowej w formacie RRRR-MM-DD. */
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export class FridgeStore {
  private readonly items: FridgeItem[];
  private readonly now: () => Date;

  constructor(items: FridgeItem[], now: () => Date = () => new Date()) {
    // Kopia, żeby zmiany w lodówce nie modyfikowały danych startowych.
    this.items = items.map((item) => ({ ...item }));
    this.now = now;
  }

  // Najpierw produkty, którym zostało najmniej dni ważności.
  list(): FridgeItemView[] {
    return this.items
      .map((item) => this.toView(item))
      .sort(
        (a, b) =>
          this.daysLeft(a) - this.daysLeft(b) ||
          a.name.localeCompare(b.name, "pl-PL"),
      );
  }

  has(productName: string): boolean {
    const needle = normalize(productName);
    return this.items.some((item) => normalize(item.name) === needle);
  }

  add(input: NewFridgeItemInput): FridgeItemView {
    if (this.has(input.name)) {
      throw new ApiError(
        409,
        `„${input.name}” jest już w lodówce. Zmień ilość przyciskami + i −.`,
      );
    }
    const item: FridgeItem = { id: randomUUID(), ...input };
    if (this.daysLeft(item) < 0) {
      throw new ApiError(400, "Ta data ważności już minęła.");
    }
    this.items.push(item);
    return this.toView(item);
  }

  // Zwraca produkt po zmianie albo null, gdy ilość spadła do zera
  // i produkt został usunięty z lodówki (S-01, scenariusz 2).
  changeQuantity(itemId: string, change: number): FridgeItemView | null {
    const item = this.items.find((candidate) => candidate.id === itemId);
    if (!item) {
      throw new ApiError(404, "Nie znaleziono produktu.");
    }
    const quantity = item.quantity + change;
    if (quantity > MAX_QUANTITY) {
      throw new ApiError(400, `Ilość może wynosić najwyżej ${MAX_QUANTITY}.`);
    }
    if (quantity <= 0) {
      this.items.splice(this.items.indexOf(item), 1);
      return null;
    }
    item.quantity = quantity;
    return this.toView(item);
  }

  // Ile dni zostało do końca terminu. Przy własnej dacie liczymy je
  // od dzisiaj, a przy gotowej opcji bierzemy jej górną granicę.
  private daysLeft(item: FridgeItem): number {
    if (item.expiry === "date") {
      const today = Date.parse(toIsoDate(this.now()));
      return Math.round((Date.parse(item.expiresOn) - today) / DAY_MS);
    }
    return PRESET_DAYS[item.expiry];
  }

  private toView(item: FridgeItem): FridgeItemView {
    const days = this.daysLeft(item);
    return {
      ...item,
      daysLeft: item.expiry === "date" ? days : null,
      eatFirst: days <= EAT_FIRST_DAYS,
    };
  }
}
