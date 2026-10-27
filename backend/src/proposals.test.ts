import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { after, before, describe, test } from "node:test";
import { createApp } from "./app.js";
import { seedFridge, seedHousehold, seedRecipes } from "./data/seed.js";
import { MealPlanStore } from "./store/mealPlanStore.js";
import type { ProposalView } from "./types.js";

const TODAY = "2026-10-27";

let server: Server;
let baseUrl: string;

async function api(
  method: string,
  path: string,
  userId: string | null,
  body?: unknown,
): Promise<{ status: number; data: unknown }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (userId) {
    headers["X-User-Id"] = userId;
  }
  const init: RequestInit = { method, headers };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }
  const response = await fetch(`${baseUrl}${path}`, init);
  const text = await response.text();
  return { status: response.status, data: text ? JSON.parse(text) : null };
}

const dinnerFor = (userId: string) =>
  api("GET", `/api/proposals?date=${TODAY}&mealType=dinner`, userId);

before(async () => {
  const store = new MealPlanStore({
    household: seedHousehold,
    recipes: seedRecipes,
    fridge: seedFridge,
  });
  server = createApp(store).listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(() => {
  server.close();
});

describe("TC-FR-02 / S-02: proponowanie posiłku i głosowanie", () => {
  test("2.1: propozycja z bazy jest widoczna dla domowników i można głosować", async () => {
    const created = await api("POST", "/api/proposals", "ania", {
      date: TODAY,
      mealType: "dinner",
      recipeId: "makaron-ze-szpinakiem",
    });
    assert.equal(created.status, 201);
    const proposal = created.data as ProposalView;
    assert.equal(proposal.name, "Makaron ze szpinakiem");
    assert.equal(proposal.proposedBy, "ania");
    assert.equal(proposal.summary.yes, 1);
    assert.deepEqual(proposal.summary.pendingMemberIds, ["marek", "ola"]);

    const seenByMarek = (await dinnerFor("marek")).data as ProposalView[];
    assert.equal(seenByMarek.length, 1);
    assert.equal(seenByMarek[0]?.name, "Makaron ze szpinakiem");

    // brakujący składnik jest wyliczany na podstawie lodówki (2/3 mamy)
    const missing = seenByMarek[0]?.recipe?.ingredients
      .filter((ingredient) => !ingredient.inFridge)
      .map((ingredient) => ingredient.name);
    assert.deepEqual(missing, ["Ser parmezan"]);

    const marekVote = await api(
      "PUT",
      `/api/proposals/${proposal.id}/vote`,
      "marek",
      { value: "yes" },
    );
    assert.equal(marekVote.status, 200);
    assert.equal((marekVote.data as ProposalView).status, "open");

    const olaVote = await api(
      "PUT",
      `/api/proposals/${proposal.id}/vote`,
      "ola",
      { value: "no" },
    );
    const final = olaVote.data as ProposalView;
    assert.deepEqual(
      { yes: final.summary.yes, no: final.summary.no },
      { yes: 2, no: 1 },
    );
    assert.equal(final.status, "accepted");
  });

  test("2.1: zmiana głosu nadpisuje poprzedni zamiast dodawać nowy", async () => {
    const [proposal] = (await dinnerFor("ola")).data as ProposalView[];
    assert.ok(proposal);
    const changed = await api(
      "PUT",
      `/api/proposals/${proposal.id}/vote`,
      "ola",
      { value: "yes" },
    );
    const view = changed.data as ProposalView;
    assert.equal(view.votes.length, 3);
    assert.equal(view.summary.yes, 3);
    assert.equal(view.summary.no, 0);
  });

  test("2.2: własna propozycja spoza bazy trafia na kartę dnia z głosowaniem", async () => {
    const created = await api("POST", "/api/proposals", "marek", {
      date: TODAY,
      mealType: "dinner",
      name: "  Kebab ",
    });
    assert.equal(created.status, 201);
    const kebab = created.data as ProposalView;
    assert.equal(kebab.name, "Kebab");
    assert.equal(kebab.recipeId, null);
    assert.equal(kebab.recipe, null);

    const dayCard = (await dinnerFor("ania")).data as ProposalView[];
    assert.ok(dayCard.some((proposal) => proposal.name === "Kebab"));

    const vote = await api("PUT", `/api/proposals/${kebab.id}/vote`, "ania", {
      value: "no",
    });
    assert.equal(vote.status, 200);
    assert.equal((vote.data as ProposalView).summary.no, 1);
  });

  test("ta sama potrawa nie może trafić na kartę dnia dwa razy", async () => {
    const duplicate = await api("POST", "/api/proposals", "ola", {
      date: TODAY,
      mealType: "dinner",
      name: "kebab",
    });
    assert.equal(duplicate.status, 409);
  });

  test("propozycje są osobne dla każdego posiłku", async () => {
    const lunch = await api(
      "GET",
      `/api/proposals?date=${TODAY}&mealType=lunch`,
      "ania",
    );
    assert.deepEqual(lunch.data, []);
  });

  test("odrzuca pustą lub zbyt długą nazwę dania", async () => {
    const empty = await api("POST", "/api/proposals", "ania", {
      date: TODAY,
      mealType: "dinner",
      name: "   ",
    });
    assert.equal(empty.status, 400);

    const tooLong = await api("POST", "/api/proposals", "ania", {
      date: TODAY,
      mealType: "dinner",
      name: "x".repeat(61),
    });
    assert.equal(tooLong.status, 400);
  });

  test("odrzuca nieprawidłowy głos", async () => {
    const [proposal] = (await dinnerFor("ania")).data as ProposalView[];
    assert.ok(proposal);
    const invalid = await api(
      "PUT",
      `/api/proposals/${proposal.id}/vote`,
      "ania",
      { value: "chyba" },
    );
    assert.equal(invalid.status, 400);
  });

  test("tylko autor może wycofać propozycję", async () => {
    const proposals = (await dinnerFor("ania")).data as ProposalView[];
    const kebab = proposals.find((proposal) => proposal.name === "Kebab");
    assert.ok(kebab);

    const byOther = await api("DELETE", `/api/proposals/${kebab.id}`, "ola");
    assert.equal(byOther.status, 403);

    const byAuthor = await api("DELETE", `/api/proposals/${kebab.id}`, "marek");
    assert.equal(byAuthor.status, 204);
  });

  test("odmawia dostępu bez identyfikatora lub spoza gospodarstwa", async () => {
    assert.equal((await dinnerFor("")).status, 401);
    assert.equal((await dinnerFor("intruz")).status, 403);
  });
});
