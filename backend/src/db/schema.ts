// schemat bazy SQLite wg diagramu ERD (docs/EDR.png)
// daty trzymamy jako tekst, enumy pilnuje CHECK

export const SCHEMA_SQL = `
-- uzytkownicy (domownicy)
CREATE TABLE IF NOT EXISTS users (
  id                  TEXT PRIMARY KEY,
  email               TEXT NOT NULL UNIQUE,
  password_hash       TEXT,                       -- NULL bo nie ma jeszcze logowania (FR-05)
  first_name          TEXT NOT NULL,
  first_name_genitive TEXT NOT NULL,              -- odmiana imienia, np. "Propozycja Oli"
  last_name           TEXT NOT NULL,
  created_at          TEXT NOT NULL
);

-- gospodarstwa domowe
CREATE TABLE IF NOT EXISTS households (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- kto nalezy do ktorego gospodarstwa (rola + kolor awatara)
CREATE TABLE IF NOT EXISTS memberships (
  household_id TEXT NOT NULL REFERENCES households (id) ON DELETE CASCADE,
  user_id      TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role         TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  color        TEXT NOT NULL,
  joined_at    TEXT NOT NULL,
  PRIMARY KEY (household_id, user_id)
);

-- kody zaproszen do gospodarstwa (FR-05, na przyszlosc)
CREATE TABLE IF NOT EXISTS invite_codes (
  id           TEXT PRIMARY KEY,
  household_id TEXT NOT NULL REFERENCES households (id) ON DELETE CASCADE,
  code         TEXT NOT NULL UNIQUE,
  created_by   TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at   TEXT NOT NULL,
  used_by      TEXT REFERENCES users (id) ON DELETE SET NULL,  -- NULL = kod jeszcze nieuzyty
  used_at      TEXT
);

-- kategorie produktow (warzywa, nabial, mieso...)
CREATE TABLE IF NOT EXISTS product_categories (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE,                     -- kod z API, np. vegetables
  label TEXT NOT NULL                             -- nazwa do wyswietlenia
);

-- produkty w lodowce (S-01)
CREATE TABLE IF NOT EXISTS fridge_items (
  id           TEXT PRIMARY KEY,
  household_id TEXT NOT NULL REFERENCES households (id) ON DELETE CASCADE,
  category_id  INTEGER NOT NULL REFERENCES product_categories (id),
  name         TEXT NOT NULL,
  quantity     REAL NOT NULL CHECK (quantity > 0),  -- przy 0 produkt jest usuwany
  unit         TEXT NOT NULL,
  expiry       TEXT NOT NULL CHECK (expiry IN ('soon', 'week', 'later', 'date')),
  expiry_date  TEXT,                                -- tylko gdy expiry = 'date'
  added_by     TEXT REFERENCES users (id) ON DELETE SET NULL,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  CHECK ((expiry = 'date') = (expiry_date IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS fridge_items_household_idx ON fridge_items (household_id);

-- przepisy (household_id NULL = wspolna baza, author_id NULL = przepis systemowy)
CREATE TABLE IF NOT EXISTS recipes (
  id                TEXT PRIMARY KEY,
  household_id      TEXT REFERENCES households (id) ON DELETE CASCADE,
  author_id         TEXT REFERENCES users (id) ON DELETE SET NULL,
  name              TEXT NOT NULL,
  description       TEXT NOT NULL DEFAULT '',
  prep_time_minutes INTEGER NOT NULL CHECK (prep_time_minutes > 0),
  created_at        TEXT NOT NULL
);

-- skladniki przepisu (porownywane z lodowka po nazwie)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id        TEXT PRIMARY KEY,
  recipe_id TEXT NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  quantity  REAL,
  unit      TEXT,
  position  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS recipe_ingredients_recipe_idx ON recipe_ingredients (recipe_id);

-- kroki przygotowania przepisu
CREATE TABLE IF NOT EXISTS recipe_steps (
  id          TEXT PRIMARY KEY,
  recipe_id   TEXT NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  UNIQUE (recipe_id, step_number)
);

-- lista zakupow (FR-04, na przyszlosc)
CREATE TABLE IF NOT EXISTS shopping_list_items (
  id               TEXT PRIMARY KEY,
  household_id     TEXT NOT NULL REFERENCES households (id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  quantity         REAL,
  unit             TEXT,
  is_bought        INTEGER NOT NULL DEFAULT 0 CHECK (is_bought IN (0, 1)),
  source_recipe_id TEXT REFERENCES recipes (id) ON DELETE SET NULL,  -- NULL = dodane recznie
  added_by         TEXT REFERENCES users (id) ON DELETE SET NULL,
  bought_by        TEXT REFERENCES users (id) ON DELETE SET NULL,
  created_at       TEXT NOT NULL,
  bought_at        TEXT
);

-- propozycje posilkow (S-02)
CREATE TABLE IF NOT EXISTS meal_proposals (
  id           TEXT PRIMARY KEY,
  household_id TEXT NOT NULL REFERENCES households (id) ON DELETE CASCADE,
  meal_date    TEXT NOT NULL,
  meal_type    TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  recipe_id    TEXT REFERENCES recipes (id) ON DELETE SET NULL,  -- NULL = danie spoza bazy
  name         TEXT NOT NULL CHECK (length(name) <= 60),
  proposed_by  TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS meal_proposals_day_idx ON meal_proposals (household_id, meal_date, meal_type);

-- glosy na propozycje (jeden glos na osobe, zmiana nadpisuje stary)
CREATE TABLE IF NOT EXISTS votes (
  proposal_id TEXT NOT NULL REFERENCES meal_proposals (id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  value       TEXT NOT NULL CHECK (value IN ('yes', 'maybe', 'no')),
  voted_at    TEXT NOT NULL,
  PRIMARY KEY (proposal_id, user_id)
);
`;
