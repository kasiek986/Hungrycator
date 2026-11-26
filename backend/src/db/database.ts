import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { seedFridge, seedHousehold, seedRecipes } from "../data/seed.js";
import type { ProductCategory } from "../types.js";
import { SCHEMA_SQL } from "./schema.js";

export type Database = DatabaseSync;

// gospodarstwo uzywane w prototypie (dopoki nie ma logowania)
export const HOUSEHOLD_ID = seedHousehold.id;

// plik bazy: backend/data/hungrycator.db
export const DEFAULT_DB_PATH = fileURLToPath(
  new URL("../../data/hungrycator.db", import.meta.url),
);

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  vegetables: "Warzywa",
  fruit: "Owoce",
  dairy: "Nabiał",
  meat: "Mięso",
  bakery: "Pieczywo",
  other: "Inne",
};

// otwiera baze, tworzy tabele i przy pierwszym starcie wrzuca dane startowe
export function openDatabase(
  path: string = process.env.DB_PATH ?? DEFAULT_DB_PATH,
): Database {
  if (path !== ":memory:") {
    mkdirSync(dirname(path), { recursive: true });
  }
  const db = new DatabaseSync(path);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA_SQL);
  if (isEmpty(db)) {
    inTransaction(db, () => seedDatabase(db));
  }
  return db;
}

// transakcja: zapisuje wszystko albo nic
export function inTransaction<T>(db: Database, work: () => T): T {
  db.exec("BEGIN");
  try {
    const result = work();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function isEmpty(db: Database): boolean {
  const row = db.prepare("SELECT COUNT(*) AS count FROM households").get() as
    | { count: number }
    | undefined;
  return (row?.count ?? 0) === 0;
}

// 2 + "sztuki" -> "2 sztuki"
export function formatAmount(
  quantity: number | null,
  unit: string | null,
): string {
  const number = quantity === null ? "" : String(quantity).replace(".", ",");
  return [number, unit ?? ""].filter(Boolean).join(" ");
}

// "2 sztuki" -> 2 + "sztuki" (jak sie nie da, caly tekst idzie do unit)
function splitAmount(amount: string): {
  quantity: number | null;
  unit: string | null;
} {
  const match = /^(\d+(?:,\d+)?) (.+)$/.exec(amount);
  if (match?.[1] && match[2]) {
    const quantity = Number(match[1].replace(",", "."));
    if (formatAmount(quantity, match[2]) === amount) {
      return { quantity, unit: match[2] };
    }
  }
  return { quantity: null, unit: amount };
}

// dane startowe z data/seed.ts
function seedDatabase(db: Database): void {
  const now = new Date().toISOString();

  for (const [index, [name, label]] of Object.entries(
    CATEGORY_LABELS,
  ).entries()) {
    db.prepare(
      "INSERT INTO product_categories (id, name, label) VALUES (?, ?, ?)",
    ).run(index + 1, name, label);
  }

  db.prepare(
    "INSERT INTO households (id, name, created_at) VALUES (?, ?, ?)",
  ).run(seedHousehold.id, seedHousehold.name, now);

  for (const member of seedHousehold.members) {
    const lastName = member.fullName.split(" ").slice(1).join(" ");
    db.prepare(
      `INSERT INTO users (id, email, password_hash, first_name, first_name_genitive, last_name, created_at)
       VALUES (?, ?, NULL, ?, ?, ?, ?)`,
    ).run(
      member.id,
      `${member.id}@hungrycator.pl`,
      member.firstName,
      member.firstNameGenitive,
      lastName,
      now,
    );
    db.prepare(
      `INSERT INTO memberships (household_id, user_id, role, color, joined_at)
       VALUES (?, ?, ?, ?, ?)`,
    ).run(seedHousehold.id, member.id, member.role, member.color, now);
  }

  for (const recipe of seedRecipes) {
    db.prepare(
      `INSERT INTO recipes (id, household_id, author_id, name, description, prep_time_minutes, created_at)
       VALUES (?, NULL, NULL, ?, ?, ?, ?)`,
    ).run(
      recipe.id,
      recipe.name,
      recipe.description,
      recipe.prepTimeMinutes,
      now,
    );
    recipe.ingredients.forEach((ingredient, position) => {
      const { quantity, unit } = splitAmount(ingredient.amount);
      db.prepare(
        `INSERT INTO recipe_ingredients (id, recipe_id, name, quantity, unit, position)
         VALUES (?, ?, ?, ?, ?, ?)`,
      ).run(randomUUID(), recipe.id, ingredient.name, quantity, unit, position);
    });
  }

  for (const item of seedFridge) {
    db.prepare(
      `INSERT INTO fridge_items (id, household_id, category_id, name, quantity, unit, expiry, expiry_date, added_by, created_at, updated_at)
       VALUES (?, ?, (SELECT id FROM product_categories WHERE name = ?), ?, ?, ?, ?, ?, NULL, ?, ?)`,
    ).run(
      item.id,
      seedHousehold.id,
      item.category,
      item.name,
      item.quantity,
      item.unit,
      item.expiry,
      item.expiresOn,
      now,
      now,
    );
  }
}
