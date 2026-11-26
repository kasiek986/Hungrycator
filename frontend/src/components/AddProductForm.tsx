import { useState, type FormEvent } from "react";
import type { NewFridgeItem, ProductCategory, Unit } from "../types";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  EXPIRY_LABELS,
  EXPIRY_OPTIONS,
  UNITS,
  daysUntil,
  describeDaysLeft,
  formatDate,
  todayIso,
} from "../utils/fridge";

const EMPTY_PRODUCT: NewFridgeItem = {
  name: "",
  category: "vegetables",
  quantity: 1,
  unit: "szt.",
  expiry: "week",
  expiresOn: null,
};

interface AddProductFormProps {
  onAdd: (item: NewFridgeItem) => Promise<void>;
}

export function AddProductForm({ onAdd }: AddProductFormProps) {
  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const update = (changes: Partial<NewFridgeItem>) =>
    setProduct((current) => ({ ...current, ...changes }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onAdd({ ...product, name: product.name.trim() });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nie udało się dodać produktu.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="card product-form" onSubmit={handleSubmit}>
      <h2 className="card-title">Nowy produkt</h2>

      <label className="field">
        <span className="field__label">Nazwa</span>
        <input
          className="field__input"
          required
          maxLength={40}
          placeholder="np. Pomidory"
          value={product.name}
          onChange={(event) => update({ name: event.target.value })}
        />
      </label>

      <label className="field">
        <span className="field__label">Kategoria</span>
        <select
          className="field__input"
          value={product.category}
          onChange={(event) =>
            update({ category: event.target.value as ProductCategory })
          }
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </label>

      <div className="field-row">
        <label className="field">
          <span className="field__label">Ilość</span>
          <input
            className="field__input"
            type="number"
            required
            min={1}
            max={999}
            value={Number.isNaN(product.quantity) ? "" : product.quantity}
            onChange={(event) =>
              update({ quantity: event.target.valueAsNumber })
            }
          />
        </label>
        <label className="field">
          <span className="field__label">Jednostka</span>
          <select
            className="field__input"
            value={product.unit}
            onChange={(event) => update({ unit: event.target.value as Unit })}
          >
            {UNITS.map((unit) => (
              <option key={unit}>{unit}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="field">
        <legend className="field__label">Termin ważności</legend>
        <div className="chips" role="radiogroup">
          {EXPIRY_OPTIONS.map((expiry) => (
            <button
              key={expiry}
              type="button"
              role="radio"
              aria-checked={product.expiry === expiry}
              className="chip"
              // Data jest potrzebna tylko przy opcji „Inna data”.
              onClick={() =>
                update({ expiry, expiresOn: expiry === "date" ? "" : null })
              }
            >
              {EXPIRY_LABELS[expiry]}
            </button>
          ))}
        </div>
      </fieldset>

      {product.expiry === "date" && (
        <label className="field">
          <span className="field__label">Data ważności</span>
          <input
            className="field__input"
            type="date"
            required
            min={todayIso()}
            value={product.expiresOn ?? ""}
            onChange={(event) => update({ expiresOn: event.target.value })}
          />
          {product.expiresOn && (
            <span className="field__hint">
              Do {formatDate(product.expiresOn)} –{" "}
              {describeDaysLeft(daysUntil(product.expiresOn))}
            </span>
          )}
        </label>
      )}

      {error && (
        <p className="banner banner--error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="button-primary" disabled={isSaving}>
        Dodaj do lodówki
      </button>
    </form>
  );
}
