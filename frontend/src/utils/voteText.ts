import type { Member, Proposal } from "../types";
import { joinNames, memberById } from "./meals";

export interface VoteHeading {
  overline: string;
  title: string;
  description: string;
}

// Teksty karty głosowania – wzorowane na makiecie:
// „Marek i Ola wybrali „Tak”. Twój głos zamknie głosowanie.”
export function describeVote(
  proposal: Proposal,
  members: Member[],
  currentMemberId: string,
): VoteHeading {
  const nameOf = (id: string) => memberById(members, id)?.firstName ?? id;
  const yesNames = proposal.votes
    .filter((vote) => vote.value === "yes" && vote.memberId !== currentMemberId)
    .map((vote) => nameOf(vote.memberId));
  const pending = proposal.summary.pendingMemberIds;
  const myVote = proposal.votes.find(
    (vote) => vote.memberId === currentMemberId,
  );

  if (proposal.status !== "open") {
    return {
      overline: "Głosowanie zakończone",
      title: proposal.status === "accepted" ? "Jemy to dziś!" : "Tym razem nie",
      description:
        proposal.status === "accepted"
          ? `Większość domowników jest na „Tak”. Możesz jeszcze zmienić swój głos.`
          : `Więcej osób było na „Nie”. Zaproponujcie coś innego.`,
    };
  }

  const yesPart =
    yesNames.length > 0
      ? `${joinNames(yesNames)} ${yesNames.length === 1 ? "jest" : "są"} na „Tak”.`
      : "Nikt jeszcze nie wybrał „Tak”.";

  let pendingPart: string;
  if (!myVote && pending.length === 1) {
    pendingPart = "Twój głos zamknie głosowanie.";
  } else if (!myVote) {
    pendingPart = "Oddaj swój głos.";
  } else {
    pendingPart = `Czekamy jeszcze na: ${joinNames(pending.map(nameOf))}.`;
  }

  return {
    overline: "Głosowanie trwa",
    title: myVote ? "Twój głos jest zapisany" : "Masz ochotę?",
    description: `${yesPart} ${pendingPart}`,
  };
}
