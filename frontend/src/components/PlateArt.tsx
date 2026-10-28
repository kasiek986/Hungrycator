interface PlateArtProps {
  /** Nazwa dania – na jej podstawie dobierany jest kolor potrawy. */
  dish: string;
}

const FOOD_COLORS = ["#d9a85b", "#c9733f", "#b8894a", "#d48f4e", "#a9774a"];

function pickColor(dish: string): string {
  let hash = 0;
  for (const char of dish) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return FOOD_COLORS[hash % FOOD_COLORS.length] ?? "#d9a85b";
}

export function PlateArt({ dish }: PlateArtProps) {
  const food = pickColor(dish);
  return (
    <svg
      className="plate-art"
      viewBox="0 0 160 160"
      role="img"
      aria-label={`Ilustracja: ${dish}`}
    >
      <ellipse cx="80" cy="140" rx="54" ry="7" fill="#1f4f36" opacity="0.08" />
      <circle cx="80" cy="78" r="62" fill="#fbf8f1" />
      <circle cx="80" cy="78" r="62" fill="none" stroke="#e8e1d2" />
      <circle cx="80" cy="78" r="46" fill="#f3ede1" />
      <circle cx="80" cy="78" r="38" fill={food} />
      <circle cx="80" cy="78" r="38" fill="#fff" opacity="0.12" />
      <g fill="#3f7d4f">
        <path d="M80 50c6 8 6 18 0 26-6-8-6-18 0-26Z" />
        <path d="M80 106c-6-8-6-18 0-26 6 8 6 18 0 26Z" />
        <path d="M52 78c8-6 18-6 26 0-8 6-18 6-26 0Z" />
        <path d="M108 78c-8 6-18 6-26 0 8-6 18-6 26 0Z" />
      </g>
      <circle cx="80" cy="78" r="5" fill="#f6efe0" />
    </svg>
  );
}
