import type { Member, Proposal, VoteValue } from "../types";
import { describeVote } from "../utils/voteText";
import { AvatarStack } from "./Avatar";
import { Icon, type IconName } from "./Icon";

interface VoteOption {
  value: VoteValue;
  label: string;
  icon: IconName;
}

const OPTIONS: VoteOption[] = [
  { value: "yes", label: "Tak", icon: "heart" },
  { value: "maybe", label: "Może", icon: "question" },
  { value: "no", label: "Nie", icon: "close" },
];

interface VotePanelProps {
  proposal: Proposal;
  members: Member[];
  currentMemberId: string;
  pendingValue: VoteValue | null;
  onVote: (value: VoteValue) => void;
}

export function VotePanel({
  proposal,
  members,
  currentMemberId,
  pendingValue,
  onVote,
}: VotePanelProps) {
  const heading = describeVote(proposal, members, currentMemberId);
  const myVote = proposal.votes.find(
    (vote) => vote.memberId === currentMemberId,
  )?.value;
  const headingId = `vote-${proposal.id}`;

  return (
    <section className="card vote-panel" aria-labelledby={headingId}>
      <p className="overline">{heading.overline}</p>
      <h3 id={headingId} className="card-title">
        {heading.title}
      </h3>
      <p className="muted" aria-live="polite">
        {heading.description}
      </p>

      <div className="vote-options" role="group" aria-label="Twój głos">
        {OPTIONS.map((option) => {
          const voters = proposal.votes
            .filter((vote) => vote.value === option.value)
            .map((vote) =>
              members.find((member) => member.id === vote.memberId),
            )
            .filter((member): member is Member => member !== undefined);
          const isSelected = myVote === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={`vote-option vote-option--${option.value}`}
              aria-pressed={isSelected}
              aria-label={`${option.label}, głosy: ${voters.length}`}
              disabled={pendingValue !== null}
              onClick={() => onVote(option.value)}
            >
              <span className="vote-option__icon">
                <Icon
                  name={option.icon}
                  size={18}
                  strokeWidth={2.2}
                  filled={option.value === "yes" && isSelected}
                />
              </span>
              <span className="vote-option__label">{option.label}</span>
              <span className="vote-option__count">
                {voters.length > 0 ? (
                  <AvatarStack members={voters} />
                ) : (
                  <span className="vote-option__zero">0</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
