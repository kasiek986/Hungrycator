import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { Icon } from "../components/Icon";
import { ProposalCard } from "../components/ProposalCard";
import { ProposeField } from "../components/ProposeField";
import { useProposals } from "../hooks/useProposals";
import type {
  Household,
  MealType,
  NewProposal,
  Recipe,
  VoteValue,
} from "../types";
import {
  MEAL_LABELS,
  MEAL_LABELS_ACCUSATIVE,
  MEAL_TYPES,
  defaultMealType,
  toIsoDate,
  weekdayName,
} from "../utils/meals";

interface MealsScreenProps {
  household: Household;
  memberId: string;
  recipes: Recipe[];
}

interface Toast {
  id: number;
  tone: "success" | "error";
  text: string;
}

export function MealsScreen({
  household,
  memberId,
  recipes,
}: MealsScreenProps) {
  const [today] = useState(() => new Date());
  const date = toIsoDate(today);
  const [mealType, setMealType] = useState<MealType>(() =>
    defaultMealType(today),
  );
  const { proposals, isLoading, error, upsert, remove } = useProposals(
    memberId,
    date,
    mealType,
  );
  const [isProposing, setIsProposing] = useState(false);
  const [pendingVotes, setPendingVotes] = useState<Record<string, VoteValue>>(
    {},
  );
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((tone: Toast["tone"], text: string) => {
    setToast({ id: Date.now(), tone, text });
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const propose = async (input: NewProposal): Promise<boolean> => {
    setIsProposing(true);
    try {
      const created = await api.createProposal(memberId, input);
      upsert(created);
      setHighlightId(created.id);
      showToast(
        "success",
        `Zaproponowano „${created.name}”. Domownicy mogą już głosować.`,
      );
      return true;
    } catch (requestError) {
      showToast(
        "error",
        requestError instanceof Error
          ? requestError.message
          : "Nie udało się dodać propozycji.",
      );
      return false;
    } finally {
      setIsProposing(false);
    }
  };

  const vote = async (proposalId: string, value: VoteValue) => {
    setPendingVotes((current) => ({ ...current, [proposalId]: value }));
    try {
      upsert(await api.vote(memberId, proposalId, value));
    } catch (requestError) {
      showToast(
        "error",
        requestError instanceof Error
          ? requestError.message
          : "Nie udało się zapisać głosu.",
      );
    } finally {
      setPendingVotes((current) => {
        const next = { ...current };
        delete next[proposalId];
        return next;
      });
    }
  };

  const withdraw = async (proposalId: string, name: string) => {
    if (
      !window.confirm(`Wycofać propozycję „${name}”? Głosy zostaną usunięte.`)
    ) {
      return;
    }
    try {
      await api.deleteProposal(memberId, proposalId);
      remove(proposalId);
      showToast("success", `Wycofano propozycję „${name}”.`);
    } catch (requestError) {
      showToast(
        "error",
        requestError instanceof Error
          ? requestError.message
          : "Nie udało się wycofać propozycji.",
      );
    }
  };

  const [leading, ...others] = proposals;

  const renderCard = (proposal: (typeof proposals)[number]) => (
    <ProposalCard
      key={proposal.id}
      proposal={proposal}
      members={household.members}
      currentMemberId={memberId}
      pendingVote={pendingVotes[proposal.id] ?? null}
      isNew={proposal.id === highlightId}
      onVote={(value) => void vote(proposal.id, value)}
      onWithdraw={() => void withdraw(proposal.id, proposal.name)}
    />
  );

  return (
    <main className="screen" aria-labelledby="meals-title">
      <header className="screen__header">
        <div>
          <p className="overline">
            {weekdayName(today)} · {MEAL_LABELS[mealType]}
          </p>
          <h1 id="meals-title" className="screen__title">
            Co dziś jemy?
          </h1>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Powiadomienia"
        >
          <Icon name="bell" size={20} />
          <span className="icon-button__dot" aria-hidden="true" />
        </button>
      </header>

      <div className="chips" role="tablist" aria-label="Posiłek">
        {MEAL_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={type === mealType}
            className="chip"
            onClick={() => setMealType(type)}
          >
            {MEAL_LABELS[type]}
          </button>
        ))}
      </div>

      <ProposeField
        mealType={mealType}
        recipes={recipes}
        isBusy={isProposing}
        onProposeRecipe={(recipe) =>
          propose({ date, mealType, recipeId: recipe.id })
        }
        onProposeName={(name) => propose({ date, mealType, name })}
      />

      {error && (
        <p className="banner banner--error" role="alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="card skeleton" aria-busy="true">
          Wczytuję kartę dnia…
        </div>
      ) : leading ? (
        <>
          {renderCard(leading)}
          {others.length > 0 && (
            <section className="others" aria-labelledby="others-title">
              <h2 id="others-title" className="section-title">
                Inne propozycje
                <span className="pill pill--green">{others.length}</span>
              </h2>
              {others.map(renderCard)}
            </section>
          )}
        </>
      ) : (
        <div className="card empty">
          <h2 className="card-title">Nikt jeszcze nic nie zaproponował</h2>
          <p className="muted">
            Wybierz przepis z bazy albo wpisz własne danie na{" "}
            {MEAL_LABELS_ACCUSATIVE[mealType]} w polu powyżej. Domownicy zobaczą
            je od razu i zagłosują.
          </p>
        </div>
      )}

      {toast && (
        <div
          key={toast.id}
          className={`toast toast--${toast.tone}`}
          role={toast.tone === "error" ? "alert" : "status"}
        >
          {toast.text}
        </div>
      )}
    </main>
  );
}
