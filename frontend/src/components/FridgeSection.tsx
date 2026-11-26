import type { FridgeItem } from "../types";
import {
  CATEGORY_LABELS,
  EXPIRY_LABELS,
  describeDaysLeft,
  formatDate,
} from "../utils/fridge";
import { Icon } from "./Icon";

type ChangeQuantity = (itemId: string, change: 1 | -1) => void;

// „Do tygodnia” albo, przy własnej dacie, „do 05.12.2026, jeszcze 9 dni”.
function describeExpiry(item: FridgeItem): string {
  if (item.expiresOn !== null && item.daysLeft !== null) {
    return `do ${formatDate(item.expiresOn)}, ${describeDaysLeft(item.daysLeft)}`;
  }
  return EXPIRY_LABELS[item.expiry];
}

interface FridgeSectionProps {
  title: string;
  items: FridgeItem[];
  emptyText: string;
  urgent?: boolean;
  busyId: string | null;
  onChangeQuantity: ChangeQuantity;
}

export function FridgeSection({
  title,
  items,
  emptyText,
  urgent = false,
  busyId,
  onChangeQuantity,
}: FridgeSectionProps) {
  return (
    <section className="card">
      <header className="ingredients__header">
        <h2 className="card-title">{title}</h2>
        <span className={`pill ${urgent ? "pill--red" : "pill--green"}`}>
          {items.length}
        </span>
      </header>

      {items.length === 0 ? (
        <p className="muted">{emptyText}</p>
      ) : (
        <ul className="fridge-list">
          {items.map((item) => (
            <ProductRow
              key={item.id}
              item={item}
              isBusy={busyId === item.id}
              onChangeQuantity={onChangeQuantity}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

interface ProductRowProps {
  item: FridgeItem;
  isBusy: boolean;
  onChangeQuantity: ChangeQuantity;
}

function ProductRow({ item, isBusy, onChangeQuantity }: ProductRowProps) {
  // Przy ilości 1 przycisk „−” usuwa produkt, więc pokazuje kosz.
  const isLast = item.quantity === 1;
  const isExpired = item.daysLeft !== null && item.daysLeft < 0;

  return (
    <li className="fridge-item">
      <span className="fridge-item__text">
        <span className="fridge-item__name">{item.name}</span>
        <span
          className={`fridge-item__meta${isExpired ? " fridge-item__meta--late" : ""}`}
        >
          {CATEGORY_LABELS[item.category]} · {describeExpiry(item)}
        </span>
      </span>

      <span className="stepper" role="group" aria-label={`Ilość: ${item.name}`}>
        <button
          type="button"
          className="stepper__button"
          aria-label={isLast ? `Usuń: ${item.name}` : "Zmniejsz ilość"}
          disabled={isBusy}
          onClick={() => onChangeQuantity(item.id, -1)}
        >
          <Icon name={isLast ? "trash" : "minus"} size={16} />
        </button>
        <span className="stepper__value">
          {item.quantity} {item.unit}
        </span>
        <button
          type="button"
          className="stepper__button"
          aria-label="Zwiększ ilość"
          disabled={isBusy}
          onClick={() => onChangeQuantity(item.id, 1)}
        >
          <Icon name="plus" size={16} />
        </button>
      </span>
    </li>
  );
}
