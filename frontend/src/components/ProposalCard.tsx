import type { Member, Proposal, VoteValue } from "../types";
import { memberById } from "../utils/meals";
import { Icon } from "./Icon";
import { PlateArt } from "./PlateArt";
import { VotePanel } from "./VotePanel";

interface ProposalCardProps {
  proposal: Proposal;
  members: Member[];
  currentMemberId: string;
  pendingVote: VoteValue | null;
  isNew: boolean;
  onVote: (value: VoteValue) => void;
  onWithdraw: () => void;
}

export function ProposalCard({
  proposal,
  members,
  currentMemberId,
  pendingVote,
  isNew,
  onVote,
  onWithdraw,
}: ProposalCardProps) {
  const author = memberById(members, proposal.proposedBy);
  const isMine = proposal.proposedBy === currentMemberId;
  const authorLabel = isMine
    ? "Twoja propozycja"
    : `Propozycja ${author?.firstNameGenitive ?? "domownika"}!`;
  const { recipe } = proposal;
  const owned = recipe?.ingredients.filter((item) => item.inFridge).length ?? 0;

  return (
    <article
      className={`proposal${isNew ? " proposal--new" : ""}`}
      aria-label={`Propozycja: ${proposal.name}`}
    >
      <div className="card dish">
        <div className="dish__art">
          <span className="dish__author">{authorLabel}</span>
          {proposal.status === "accepted" && (
            <span className="pill pill--green dish__badge">Zaakceptowany</span>
          )}
          <PlateArt dish={proposal.name} />
        </div>
        <div className="dish__body">
          <p className="overline">
            {recipe
              ? `Gotowe w ${recipe.prepTimeMinutes} minut`
              : "Spoza bazy przepisów"}
          </p>
          <h2 className="dish__name">{proposal.name}</h2>
          <p className="muted">
            {recipe
              ? recipe.description
              : "Własny pomysł na dziś. Zagłosujcie, czy macie ochotę."}
          </p>
          {isMine && (
            <button type="button" className="link-button" onClick={onWithdraw}>
              Wycofaj propozycję
            </button>
          )}
        </div>
      </div>

      {recipe && (
        <section className="card ingredients">
          <header className="ingredients__header">
            <h3 className="card-title">Potrzebne składniki</h3>
            <span className="pill pill--green">
              {owned}/{recipe.ingredients.length} mamy
            </span>
          </header>
          <ul className="ingredients__list">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.name} className="ingredient">
                <span
                  className={`ingredient__mark ingredient__mark--${ingredient.inFridge ? "have" : "missing"}`}
                >
                  <Icon
                    name={ingredient.inFridge ? "check" : "close"}
                    size={14}
                    strokeWidth={2.4}
                  />
                </span>
                <span className="ingredient__text">
                  <span className="ingredient__name">{ingredient.name}</span>
                  <span className="ingredient__amount">
                    {ingredient.amount}
                  </span>
                </span>
                <span
                  className={`ingredient__state ingredient__state--${ingredient.inFridge ? "have" : "missing"}`}
                >
                  {ingredient.inFridge ? "Masz" : "Brakuje"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <VotePanel
        proposal={proposal}
        members={members}
        currentMemberId={currentMemberId}
        pendingValue={pendingVote}
        onVote={onVote}
      />
    </article>
  );
}
