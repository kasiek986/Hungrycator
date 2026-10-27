import { useEffect, useState } from "react";
import { api } from "./api";
import { BottomNav, type TabId } from "./components/BottomNav";
import { MemberSwitcher } from "./components/MemberSwitcher";
import { MealsScreen } from "./screens/MealsScreen";
import { PlaceholderScreen } from "./screens/PlaceholderScreen";
import type { Household, Recipe } from "./types";
import "./App.css";

const DEFAULT_MEMBER_ID = "ania";
const MEMBER_PARAM = "jako";

const PLACEHOLDERS: Record<Exclude<TabId, "meals">, [string, string]> = {
  home: ["Cześć!", "S-01"],
  fridge: ["Moja lodówka", "S-01"],
  shopping: ["Lista zakupów", "S-04"],
  profile: ["Gospodarstwo", "S-05"],
};

function readMemberFromUrl(): string {
  return (
    new URLSearchParams(window.location.search).get(MEMBER_PARAM) ??
    DEFAULT_MEMBER_ID
  );
}

interface AppData {
  household: Household;
  recipes: Recipe[];
}

function App() {
  const [memberId, setMemberId] = useState(readMemberFromUrl);
  const [tab, setTab] = useState<TabId>("meals");
  const [data, setData] = useState<AppData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getHousehold(memberId), api.getRecipes(memberId)])
      .then(([household, recipes]) => {
        if (!cancelled) {
          setData({ household, recipes });
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Nie udało się wczytać danych.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [memberId]);

  const switchMember = (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(MEMBER_PARAM, id);
    window.history.replaceState(null, "", url);
    setMemberId(id);
  };

  if (!data) {
    return (
      <div className="app app--centered">
        {loadError ? (
          <div className="card empty" role="alert">
            <h1 className="card-title">Nie można otworzyć aplikacji</h1>
            <p className="muted">{loadError}</p>
            <button
              type="button"
              className="button-primary"
              onClick={() => switchMember(DEFAULT_MEMBER_ID)}
            >
              Otwórz jako Ania
            </button>
          </div>
        ) : (
          <p className="muted">Wczytuję gospodarstwo…</p>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <MemberSwitcher
        members={data.household.members}
        currentId={memberId}
        onChange={switchMember}
      />
      {tab === "meals" ? (
        <MealsScreen
          key={memberId}
          household={data.household}
          memberId={memberId}
          recipes={data.recipes}
        />
      ) : (
        <PlaceholderScreen
          title={PLACEHOLDERS[tab][0]}
          story={PLACEHOLDERS[tab][1]}
        />
      )}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default App;
