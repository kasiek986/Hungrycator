import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api";
import type { FridgeItem } from "../types";
import { POLL_INTERVAL_MS } from "./useProposals";

// Pobiera zawartość lodówki i odświeża ją co 2 s, żeby zmiany
// innych domowników były widoczne w ciągu 3 s (NFR-04).
export function useFridge(memberId: string) {
  const [items, setItems] = useState<FridgeItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Numer ostatniego zapytania – starsza odpowiedź nie nadpisze nowszej.
  const lastRequest = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++lastRequest.current;
    try {
      const fresh = await api.getFridge(memberId);
      if (requestId === lastRequest.current) {
        setItems(fresh);
        setError(null);
      }
    } catch (requestError) {
      if (requestId === lastRequest.current) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Nie udało się pobrać lodówki.",
        );
      }
    }
  }, [memberId]);

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

  return { items, error, refresh };
}
