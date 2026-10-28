import type { Member } from "../types";

interface AvatarProps {
  member: Member;
  size?: "sm" | "md";
}

export function Avatar({ member, size = "sm" }: AvatarProps) {
  return (
    <span
      className={`avatar avatar--${size}`}
      style={{ backgroundColor: member.color }}
      title={member.fullName}
    >
      {member.firstName.charAt(0)}
    </span>
  );
}

interface AvatarStackProps {
  members: Member[];
}

export function AvatarStack({ members }: AvatarStackProps) {
  if (members.length === 0) {
    return null;
  }
  return (
    <span className="avatar-stack">
      {members.map((member) => (
        <Avatar key={member.id} member={member} />
      ))}
    </span>
  );
}
