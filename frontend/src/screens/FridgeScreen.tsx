import { useState } from "react";
import { api } from "../api";
import { AddProductForm } from "../components/AddProductForm";
import { FridgeSection } from "../components/FridgeSection";
import { Icon } from "../components/Icon";
import { useFridge } from "../hooks/useFridge";
import type { NewFridgeItem } from "../types";

interface FridgeScreenProps {
  memberId: string;
}

export function FridgeScreen({ memberId }: FridgeScreenProps) {
  const { items, error, refresh } = useFridge(memberId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Błąd rzucony przez api trafia do formularza, który go wyświetla.
  const addProduct = async (item: NewFridgeItem) => {
    await api.addFridgeItem(memberId, item);
    setIsFormOpen(false);
    await refresh();
  };

  const changeQuantity = async (itemId: string, change: 1 | -1) => {
    setBusyId(itemId);
    setActionError(null);
    try {
      await api.changeQuantity(memberId, itemId, change);
      await refresh();
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : "Nie udało się zmienić ilości.",
      );
    } finally {
      setBusyId(null);
    }
  };

  // S-01: serwer oznacza produkty, którym zostały najwyżej 3 dni ważności.
  const eatFirst = items?.filter((item) => item.eatFirst) ?? [];
  const others = items?.filter((item) => !item.eatFirst) ?? [];
  const message = actionError ?? error;

  return (
    <main className="screen" aria-labelledby="fridge-title">
      <header className="screen__header">
        <div>
          <p className="overline">Wspólna lodówka</p>
          <h1 id="fridge-title" className="screen__title">
            Moja lodówka
          </h1>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label={isFormOpen ? "Zamknij formularz" : "Dodaj produkt"}
          aria-expanded={isFormOpen}
          onClick={() => setIsFormOpen((open) => !open)}
        >
          <Icon name={isFormOpen ? "close" : "plus"} size={20} />
        </button>
      </header>

      {isFormOpen && <AddProductForm onAdd={addProduct} />}

      {message && (
        <p className="banner banner--error" role="alert">
          {message}
        </p>
      )}

      {items === null ? (
        <div className="card skeleton" aria-busy="true">
          Wczytuję lodówkę…
        </div>
      ) : (
        <>
          <FridgeSection
            title="Zjedz mnie najpierw"
            items={eatFirst}
            emptyText="Nic nie traci ważności w ciągu 3 dni."
            urgent
            busyId={busyId}
            onChangeQuantity={changeQuantity}
          />
          <FridgeSection
            title="Pozostałe produkty"
            items={others}
            emptyText="Dodaj produkty przyciskiem +."
            busyId={busyId}
            onChangeQuantity={changeQuantity}
          />
        </>
      )}
    </main>
  );
}
