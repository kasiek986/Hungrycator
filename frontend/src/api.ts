import type {
  Household,
  MealType,
  NewProposal,
  Proposal,
  Recipe,
  VoteValue,
} from "./types";

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

async function request<T>(
  memberId: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": memberId,
        ...init.headers,
      },
    });
  } catch {
    throw new ApiRequestError(
      0,
      "Brak połączenia z serwerem. Sprawdź, czy backend działa.",
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : `Serwer zwrócił błąd ${response.status}.`;
    throw new ApiRequestError(response.status, message);
  }
  return payload as T;
}

export const api = {
  getHousehold: (memberId: string) =>
    request<Household>(memberId, "/household"),

  getRecipes: (memberId: string) => request<Recipe[]>(memberId, "/recipes"),

  getProposals: (memberId: string, date: string, mealType: MealType) =>
    request<Proposal[]>(
      memberId,
      `/proposals?date=${encodeURIComponent(date)}&mealType=${mealType}`,
    ),

  createProposal: (memberId: string, proposal: NewProposal) =>
    request<Proposal>(memberId, "/proposals", {
      method: "POST",
      body: JSON.stringify(proposal),
    }),

  vote: (memberId: string, proposalId: string, value: VoteValue) =>
    request<Proposal>(memberId, `/proposals/${proposalId}/vote`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    }),

  deleteProposal: (memberId: string, proposalId: string) =>
    request<void>(memberId, `/proposals/${proposalId}`, { method: "DELETE" }),
};
