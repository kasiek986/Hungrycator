import express from "express";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./errors.js";
import type { MealPlanStore } from "./store/mealPlanStore.js";
import {
  parseDate,
  parseMealType,
  parseNewProposal,
  parseVoteValue,
} from "./validation.js";

const USER_HEADER = "x-user-id";

// Prototyp nie ma jeszcze logowania (FR-05). Domownik jest identyfikowany
// nagłówkiem X-User-Id; nieznany użytkownik dostaje odmowę (NFR-03).
function requireMemberId(store: MealPlanStore, req: Request): string {
  const memberId = req.header(USER_HEADER);
  if (!memberId) {
    throw new ApiError(401, "Brak identyfikatora domownika.");
  }
  if (!store.findMember(memberId)) {
    throw new ApiError(403, "Nie należysz do tego gospodarstwa domowego.");
  }
  return memberId;
}

export function createApp(store: MealPlanStore): express.Express {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "Hungrycator API działa!" });
  });

  app.get("/api/household", (req, res) => {
    requireMemberId(store, req);
    res.json(store.getHousehold());
  });

  app.get("/api/recipes", (req, res) => {
    requireMemberId(store, req);
    const query = typeof req.query.q === "string" ? req.query.q : "";
    res.json(store.listRecipes(query));
  });

  app.get("/api/proposals", (req, res) => {
    requireMemberId(store, req);
    const date = parseDate(req.query.date);
    const mealType = parseMealType(req.query.mealType);
    res.json(store.listProposals(date, mealType));
  });

  app.post("/api/proposals", (req, res) => {
    const memberId = requireMemberId(store, req);
    const proposal = store.createProposal(memberId, parseNewProposal(req.body));
    res.status(201).json(proposal);
  });

  app.put("/api/proposals/:id/vote", (req, res) => {
    const memberId = requireMemberId(store, req);
    const proposal = store.castVote(
      memberId,
      req.params.id,
      parseVoteValue(req.body),
    );
    res.json(proposal);
  });

  app.delete("/api/proposals/:id", (req, res) => {
    const memberId = requireMemberId(store, req);
    store.deleteProposal(memberId, req.params.id);
    res.status(204).end();
  });

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Nie znaleziono zasobu." });
  });

  app.use(
    (error: unknown, _req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        next(error);
        return;
      }
      if (error instanceof ApiError) {
        res.status(error.status).json({ error: error.message });
        return;
      }
      if (error instanceof SyntaxError) {
        res.status(400).json({ error: "Nieprawidłowy format JSON." });
        return;
      }
      console.error(error);
      res.status(500).json({ error: "Wewnętrzny błąd serwera." });
    },
  );

  return app;
}
