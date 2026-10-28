import {
  useId,
  useMemo,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { MealType, Recipe } from "../types";
import { MEAL_LABELS_ACCUSATIVE } from "../utils/meals";
import { Icon } from "./Icon";

const MAX_NAME_LENGTH = 60;

const normalize = (value: string) =>
  value.trim().toLocaleLowerCase("pl-PL").replace(/\s+/g, " ");

type Suggestion =
  { kind: "custom"; name: string } | { kind: "recipe"; recipe: Recipe };

interface ProposeFieldProps {
  mealType: MealType;
  recipes: Recipe[];
  isBusy: boolean;
  onProposeRecipe: (recipe: Recipe) => Promise<boolean>;
  onProposeName: (name: string) => Promise<boolean>;
}

export function ProposeField({
  mealType,
  recipes,
  isBusy,
  onProposeRecipe,
  onProposeName,
}: ProposeFieldProps) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();
  const inputId = useId();

  const query = normalize(value);
  const suggestions = useMemo<Suggestion[]>(() => {
    const matching = recipes
      .filter((recipe) => normalize(recipe.name).includes(query))
      .map((recipe): Suggestion => ({ kind: "recipe", recipe }));
    const exact = recipes.some((recipe) => normalize(recipe.name) === query);
    return query && !exact
      ? [{ kind: "custom", name: value.trim() }, ...matching]
      : matching;
  }, [recipes, query, value]);

  const showList = isOpen && suggestions.length > 0;

  const reset = () => {
    setValue("");
    setActiveIndex(-1);
    setIsOpen(false);
  };

  const choose = async (suggestion: Suggestion) => {
    const ok =
      suggestion.kind === "recipe"
        ? await onProposeRecipe(suggestion.recipe)
        : await onProposeName(suggestion.name);
    if (ok) {
      reset();
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const active = suggestions[activeIndex];
    if (showList && active) {
      await choose(active);
      return;
    }
    if (value.trim()) {
      if (await onProposeName(value.trim())) {
        reset();
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, -1));
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <form className="propose" onSubmit={handleSubmit}>
      <div className="propose__row">
        <span className="propose__plus" aria-hidden="true">
          <Icon name="plus" size={18} strokeWidth={2.2} />
        </span>
        <label className="visually-hidden" htmlFor={inputId}>
          Zaproponuj danie na {MEAL_LABELS_ACCUSATIVE[mealType]}
        </label>
        <input
          id={inputId}
          className="propose__input"
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showList && activeIndex >= 0
              ? `${listId}-${activeIndex}`
              : undefined
          }
          autoComplete="off"
          maxLength={MAX_NAME_LENGTH}
          placeholder="Wpisz danie lub wybierz przepis"
          value={value}
          disabled={isBusy}
          onChange={(event) => {
            setValue(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="propose__submit"
          disabled={isBusy || value.trim().length === 0}
        >
          Zaproponuj
        </button>
      </div>

      {showList && (
        <ul id={listId} className="suggestions" role="listbox">
          {suggestions.map((suggestion, index) => {
            const isActive = index === activeIndex;
            const key =
              suggestion.kind === "recipe" ? suggestion.recipe.id : "custom";
            return (
              <li
                key={key}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isActive}
                className={`suggestion${isActive ? " suggestion--active" : ""}`}
                // mousedown zamiast click, żeby wybór nastąpił przed blur pola
                onMouseDown={(event) => {
                  event.preventDefault();
                  void choose(suggestion);
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {suggestion.kind === "custom" ? (
                  <>
                    <span className="suggestion__icon suggestion__icon--custom">
                      <Icon name="plus" size={16} strokeWidth={2.2} />
                    </span>
                    <span className="suggestion__text">
                      <span className="suggestion__name">
                        Zaproponuj „{suggestion.name}”
                      </span>
                      <span className="suggestion__meta">
                        Danie spoza bazy przepisów
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="suggestion__icon">
                      <Icon name="book" size={16} />
                    </span>
                    <span className="suggestion__text">
                      <span className="suggestion__name">
                        {suggestion.recipe.name}
                      </span>
                      <span className="suggestion__meta">
                        {suggestion.recipe.prepTimeMinutes} min, masz{" "}
                        {
                          suggestion.recipe.ingredients.filter(
                            (item) => item.inFridge,
                          ).length
                        }
                        /{suggestion.recipe.ingredients.length} składników
                      </span>
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </form>
  );
}
