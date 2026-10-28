import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api";
import type { MealType, Proposal } from "../types";

// NFR-04: zmiany innych domowników mają być widoczne w ciągu 3 s,
// dlatego karta dnia odświeża się co 2 s.
export const POLL_INTERVAL_MS = 2000;

interface ProposalsState {
  key: string;
  proposals: Proposal[];
  error: string | null;
}

export interface UseProposalsResult {
  proposals: Proposal[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  upsert: (proposal: Proposal) => void;
  remove: (proposalId: string) => void;
}

const sortProposals = (proposals: Proposal[]): Proposal[] =>
  [...proposals].sort(
    (a, b) =>
      b.summary.yes - a.summary.yes || a.createdAt.localeCompare(b.createdAt),
  );

export function useProposals(
  memberId: string,
  date: string,
  mealType: MealType,
): UseProposalsResult {
  const key = `${memberId}|${date}|${mealType}`;
  const [state, setState] = useState<ProposalsState | null>(null);
  const keyRef = useRef(key);
  // Licznik lokalnych zmian: odpowiedź z odpytywania, która wyruszyła przed
  // głosem lub nową propozycją, jest odrzucana, żeby nie cofać widoku.
  const mutationRef = useRef(0);

  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  const refresh = useCallback(async () => {
    const requestKey = key;
    const mutationAtStart = mutationRef.current;
    try {
      const proposals = await api.getProposals(memberId, date, mealType);
      if (
        keyRef.current === requestKey &&
        mutationRef.current === mutationAtStart
      ) {
        setState({ key: requestKey, proposals, error: null });
      }
    } catch (error) {
      if (keyRef.current === requestKey) {
        setState((previous) => ({
          key: requestKey,
          proposals: previous?.key === requestKey ? previous.proposals : [],
          error:
            error instanceof Error ? error.message : "Nie udało się pobrać.",
        }));
      }
    }
  }, [key, memberId, date, mealType]);

  useEffect(() => {
    let timer: number | undefined;
    let cancelled = false;

    const tick = async () => {
      await refresh();
      if (!cancelled) {
        timer = window.setTimeout(tick, POLL_INTERVAL_MS);
      }
    };
    void tick();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [refresh]);

  const upsert = useCallback(
    (proposal: Proposal) => {
      mutationRef.current += 1;
      setState((previous) => {
        const current = previous?.key === key ? previous.proposals : [];
        const others = current.filter((item) => item.id !== proposal.id);
        return {
          key,
          proposals: sortProposals([...others, proposal]),
          error: null,
        };
      });
    },
    [key],
  );

  const remove = useCallback(
    (proposalId: string) => {
      mutationRef.current += 1;
      setState((previous) =>
        previous?.key === key
          ? {
              ...previous,
              proposals: previous.proposals.filter(
                (item) => item.id !== proposalId,
              ),
            }
          : previous,
      );
    },
    [key],
  );

  const isCurrent = state?.key === key;
  return {
    proposals: isCurrent ? state.proposals : [],
    isLoading: !isCurrent,
    error: isCurrent ? state.error : null,
    refresh,
    upsert,
    remove,
  };
}
