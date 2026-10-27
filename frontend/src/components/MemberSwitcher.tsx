import type { Member } from "../types";

interface MemberSwitcherProps {
  members: Member[];
  currentId: string;
  onChange: (memberId: string) => void;
}

// Do czasu wdrożenia logowania (FR-05) pozwala sprawdzić w prototypie,
// co widzą pozostali domownicy. Wybór trafia do adresu (?jako=marek),
// więc w dwóch kartach przeglądarki można mieć dwóch różnych domowników.
export function MemberSwitcher({
  members,
  currentId,
  onChange,
}: MemberSwitcherProps) {
  return (
    <div className="member-switcher" role="radiogroup" aria-label="Domownik">
      <span className="member-switcher__label">Jesteś:</span>
      {members.map((member) => {
        const isCurrent = member.id === currentId;
        return (
          <button
            key={member.id}
            type="button"
            role="radio"
            aria-checked={isCurrent}
            className="member-switcher__option"
            style={{ ["--member" as string]: member.color }}
            onClick={() => onChange(member.id)}
          >
            <span className="member-switcher__dot" aria-hidden="true">
              {member.firstName.charAt(0)}
            </span>
            {member.firstName}
          </button>
        );
      })}
    </div>
  );
}
