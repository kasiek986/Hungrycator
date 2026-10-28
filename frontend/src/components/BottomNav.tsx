import { Icon, type IconName } from "./Icon";

export type TabId = "home" | "fridge" | "shopping" | "meals" | "profile";

interface Tab {
  id: TabId;
  label: string;
  icon: IconName;
}

const TABS: Tab[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "fridge", label: "Lodówka", icon: "fridge" },
  { id: "shopping", label: "Zakupy", icon: "bag" },
  { id: "meals", label: "Posiłki", icon: "utensils" },
  { id: "profile", label: "Profil", icon: "user" },
];

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Główna nawigacja">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className="bottom-nav__item"
          aria-current={tab.id === active ? "page" : undefined}
          onClick={() => onChange(tab.id)}
        >
          <span className="bottom-nav__icon">
            <Icon name={tab.icon} size={20} />
          </span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
