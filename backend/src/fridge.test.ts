import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { after, before, describe, test } from "node:test";
import { createApp } from "./app.js";
import { HOUSEHOLD_ID, openDatabase } from "./db/database.js";
import { FridgeStore, toIsoDate } from "./store/fridgeStore.js";
import { MealPlanStore } from "./store/mealPlanStore.js";
import type { FridgeItemView, RecipeView } from "./types.js";

// Data za podaną liczbę dni od dzisiaj, np. inDays(2) → pojutrze.
const inDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
};

let server: Server;
let baseUrl: string;

async function api(
  method: string,
  path: string,
  body?: unknown,
  userId = "ania",
): Promise<{ status: number; data: unknown }> {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json", "X-User-Id": userId },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  return { status: response.status, data: text ? JSON.parse(text) : null };
}

const fridgeItems = async () =>
  (await api("GET", "/api/fridge")).data as FridgeItemView[];

const pomidory = {
  name: "Pomidory",
  category: "vegetables",
  quantity: 4,
  unit: "szt.",
  expiry: "soon",
};

before(async () => {
  // Każdy plik testów dostaje własną, świeżą bazę w pamięci RAM
  // (te same tabele i dane startowe co plik hungrycator.db).
  const db = openDatabase(":memory:");
  const fridge = new FridgeStore(db, HOUSEHOLD_ID);
  const store = new MealPlanStore({ db, householdId: HOUSEHOLD_ID, fridge });
  server = createApp(store, fridge).listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(() => {
  server.close();
});

describe("TC-FR-01 / S-01: wirtualna lodówka", () => {
  test("1.1: dodany produkt z terminem „Do 3 dni” trafia do „Zjedz mnie najpierw”", async () => {
    const created = await api("POST", "/api/fridge", pomidory);
    assert.equal(created.status, 201);
    assert.equal((created.data as FridgeItemView).name, "Pomidory");

    const eatFirst = (await fridgeItems())
      .filter((item) => item.eatFirst)
      .map((item) => item.name);
    assert.deepEqual(eatFirst, ["Kurczak", "Pomidory", "Szpinak"]);
  });

  test("dodany produkt jest widoczny w składnikach przepisów (S-02)", async () => {
    const recipes = (await api("GET", "/api/recipes?q=szakszuka"))
      .data as RecipeView[];
    const tomatoes = recipes[0]?.ingredients.find((i) => i.name === "Pomidory");
    assert.equal(tomatoes?.inFridge, true);
  });

  test("1.2: przycisk „−” zmniejsza ilość mleka z 2 do 1", async () => {
    const changed = await api("PATCH", "/api/fridge/mleko", { change: -1 });
    assert.equal(changed.status, 200);
    assert.equal((changed.data as FridgeItemView).quantity, 1);
  });

  test("1.3: przy ilości 0 produkt znika z lodówki", async () => {
    const removed = await api("PATCH", "/api/fridge/mleko", { change: -1 });
    assert.equal(removed.status, 204);
    const names = (await fridgeItems()).map((item) => item.name);
    assert.ok(!names.includes("Mleko"));
  });

  test("przycisk „+” zwiększa ilość", async () => {
    const changed = await api("PATCH", "/api/fridge/jajka", { change: 1 });
    assert.equal((changed.data as FridgeItemView).quantity, 9);
  });

  test("własna data: liczba dni jest liczona od dzisiaj", async () => {
    const soon = await api("POST", "/api/fridge", {
      ...pomidory,
      name: "Ser feta",
      expiry: "date",
      expiresOn: inDays(2),
    });
    assert.equal(soon.status, 201);
    assert.equal((soon.data as FridgeItemView).daysLeft, 2);
    assert.equal((soon.data as FridgeItemView).eatFirst, true);

    const later = await api("POST", "/api/fridge", {
      ...pomidory,
      name: "Masło",
      expiry: "date",
      expiresOn: inDays(10),
    });
    assert.equal((later.data as FridgeItemView).daysLeft, 10);
    assert.equal((later.data as FridgeItemView).eatFirst, false);
  });

  test("własna data: odrzuca datę z przeszłości lub jej brak", async () => {
    const past = { ...pomidory, name: "Ser", expiry: "date" };
    const expired = { ...past, expiresOn: inDays(-1) };
    assert.equal((await api("POST", "/api/fridge", expired)).status, 400);
    assert.equal((await api("POST", "/api/fridge", past)).status, 400);
  });

  test("ten sam produkt nie może trafić do lodówki dwa razy", async () => {
    const duplicate = await api("POST", "/api/fridge", {
      ...pomidory,
      name: "  pomidory ",
    });
    assert.equal(duplicate.status, 409);
  });

  test("odrzuca niepoprawne dane", async () => {
    const invalid = [
      { ...pomidory, name: "  " },
      { ...pomidory, quantity: 0 },
      { ...pomidory, quantity: 2.5 },
      { ...pomidory, expiry: "jutro" },
      { ...pomidory, category: "słodycze" },
    ];
    for (const body of invalid) {
      assert.equal((await api("POST", "/api/fridge", body)).status, 400);
    }
    const change = await api("PATCH", "/api/fridge/jajka", { change: 5 });
    assert.equal(change.status, 400);
    const missing = await api("PATCH", "/api/fridge/nie-ma", { change: -1 });
    assert.equal(missing.status, 404);
  });

  test("odmawia dostępu bez identyfikatora lub spoza gospodarstwa", async () => {
    assert.equal((await api("GET", "/api/fridge", undefined, "")).status, 401);
    assert.equal(
      (await api("GET", "/api/fridge", undefined, "intruz")).status,
      403,
    );
  });
});
