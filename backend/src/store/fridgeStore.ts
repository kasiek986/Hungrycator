import { randomUUID } from "node:crypto";
import type { Database } from "../db/database.js";
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

// Wiersz z tabeli fridge_items (z nazwą kategorii dołączoną z product_categories)
type FridgeRow = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry: string;
  expiry_date: string | null;
};

const SELECT_ITEMS = `
  SELECT f.id, f.name, c.name AS category, f.quantity, f.unit, f.expiry, f.expiry_date
  FROM fridge_items f
  JOIN product_categories c ON c.id = f.category_id`;

// Zamienia wiersz z bazy na obiekt używany w API.
function toItem(row: FridgeRow): FridgeItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    quantity: row.quantity,
    unit: row.unit,
    expiry: row.expiry,
    expiresOn: row.expiry === "date" ? row.expiry_date : null,
  } as FridgeItem;
}

/** Wspólna lodówka gospodarstwa – dane w tabeli fridge_items (S-01). */
export class FridgeStore {
  private readonly db: Database;
  private readonly householdId: string;
  private readonly now: () => Date;

  constructor(
    db: Database,
    householdId: string,
    now: () => Date = () => new Date(),
  ) {
    this.db = db;
    this.householdId = householdId;
    this.now = now;
  }

  // Najpierw produkty, którym zostało najmniej dni ważności.
  list(): FridgeItemView[] {
    return this.allItems()
      .map((item) => this.toView(item))
      .sort(
        (a, b) =>
          this.daysLeft(a) - this.daysLeft(b) ||
          a.name.localeCompare(b.name, "pl-PL"),
      );
  }

  has(productName: string): boolean {
    const needle = normalize(productName);
    return this.allItems().some((item) => normalize(item.name) === needle);
  }

  add(
    input: NewFridgeItemInput,
    addedBy: string | null = null,
  ): FridgeItemView {
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
    const timestamp = this.now().toISOString();
    this.db
      .prepare(
        `INSERT INTO fridge_items
           (id, household_id, category_id, name, quantity, unit, expiry, expiry_date, added_by, created_at, updated_at)
         VALUES (?, ?, (SELECT id FROM product_categories WHERE name = ?), ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        item.id,
        this.householdId,
        item.category,
        item.name,
        item.quantity,
        item.unit,
        item.expiry,
        item.expiresOn,
        addedBy,
        timestamp,
        timestamp,
      );
    return this.toView(item);
  }

  // Zwraca produkt po zmianie albo null, gdy ilość spadła do zera
  // i produkt został usunięty z lodówki (S-01, scenariusz 2).
  changeQuantity(itemId: string, change: number): FridgeItemView | null {
    const item = this.findItem(itemId);
    if (!item) {
      throw new ApiError(404, "Nie znaleziono produktu.");
    }
    const quantity = item.quantity + change;
    if (quantity > MAX_QUANTITY) {
      throw new ApiError(400, `Ilość może wynosić najwyżej ${MAX_QUANTITY}.`);
    }
    if (quantity <= 0) {
      this.db
        .prepare("DELETE FROM fridge_items WHERE id = ? AND household_id = ?")
        .run(itemId, this.householdId);
      return null;
    }
    this.db
      .prepare(
        "UPDATE fridge_items SET quantity = ?, updated_at = ? WHERE id = ? AND household_id = ?",
      )
      .run(quantity, this.now().toISOString(), itemId, this.householdId);
    return this.toView({ ...item, quantity });
  }

  private allItems(): FridgeItem[] {
    const rows = this.db
      .prepare(`${SELECT_ITEMS} WHERE f.household_id = ?`)
      .all(this.householdId) as unknown as FridgeRow[];
    return rows.map(toItem);
  }

  private findItem(itemId: string): FridgeItem | null {
    const row = this.db
      .prepare(`${SELECT_ITEMS} WHERE f.id = ? AND f.household_id = ?`)
      .get(itemId, this.householdId) as unknown as FridgeRow | undefined;
    return row ? toItem(row) : null;
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
