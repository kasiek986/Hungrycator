export type IconName =
  | "bell"
  | "home"
  | "fridge"
  | "bag"
  | "utensils"
  | "user"
  | "plus"
  | "check"
  | "close"
  | "heart"
  | "question"
  | "clock"
  | "book";

const PATHS: Record<IconName, string> = {
  bell: "M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Zm4 4a2 2 0 0 0 4 0",
  home: "M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-7.5Z",
  fridge:
    "M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm-1 7h12M9 6v2M9 13v3",
  bag: "M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2",
  utensils: "M7 3v8m-2-8v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 1-3 4-3 7h3v11",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  plus: "M12 5v14M5 12h14",
  check: "m5 12.5 4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6 6 18",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z",
  question: "M9.2 9a3 3 0 1 1 4.3 2.7c-.9.4-1.5 1.2-1.5 2.2v.6M12 18h.01",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2",
  book: "M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5v-15Zm0 15A1.5 1.5 0 0 0 6.5 21H19",
};

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  filled?: boolean;
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  filled = false,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
