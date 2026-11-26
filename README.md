# Hungrycator

Hungrycator to aplikacja do zarządzania wspólną wirtualną lodówką, produktami spożywczymi i listą zakupów. Jej celem jest ułatwienie organizacji zakupów, kontrolowania terminów ważności produktów oraz planowania posiłków.

## Prototyp interfejsu

Interaktywny prototyp aplikacji Hungrycator został przygotowany w Figmie.

[Otwórz prototyp Hungrycatora](https://www.figma.com/make/bJnYg7LzqwrnrGdigpZOia/Hungrycator-mobile-app-prototype?p=f&t=mJgvenoifXkB55Hy-0)

## Technologie

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Kontrola jakości kodu:** ESLint
- **Formatowanie kodu:** Prettier
- **Kontrola wersji:** Git
- **Repozytorium:** GitHub

## Struktura projektu

- `frontend/` – kod aplikacji frontendowej
- `backend/` – kod serwera i API
- `docs/` – dokumentacja projektu
- `tests/` – testy i scenariusze testowe
- `.specify/` – specyfikacja projektu

## Wymagania

- Node.js 24 lub nowszy
- npm

## Instalacja i uruchomienie

Najpierw sklonuj repozytorium i przejdź do katalogu projektu:

```bash
git clone https://github.com/kasiek986/Hungrycator.git
cd Hungrycator
```

Zainstaluj zależności główne:

```bash
npm install
```

### Frontend

W osobnym terminalu, z katalogu głównego projektu:

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

Vite wyświetli adres lokalny, pod którym można otworzyć aplikację w przeglądarce.

### Backend

W drugim terminalu, również z katalogu głównego projektu:

```bash
npm --prefix backend install
npm --prefix backend run dev
```

Serwer udostępnia testowy endpoint sprawdzający jego dostępność:

[http://localhost:3000/api/health](http://localhost:3000/api/health)

Serwer deweloperski Vite przekazuje zapytania `/api` do backendu, więc oba procesy muszą działać jednocześnie. Dane są zapisywane w bazie danych SQLite i nie znikają po restarcie serwera (szczegóły niżej).

## Baza danych

Backend przechowuje dane w relacyjnej bazie **SQLite** zapisanej w jednym pliku: `backend/data/hungrycator.db`. Korzysta z modułu `node:sqlite` wbudowanego w Node.js, więc nie trzeba instalować ani uruchamiać osobnego serwera bazy danych (ADR 5 w `docs/ADR.md`).

- Przy pierwszym uruchomieniu backend sam zakłada tabele i wypełnia je danymi startowymi (gospodarstwo „Zielona 24”, domownicy, przepisy, produkty w lodówce).
- Produkty, propozycje i głosy zostają w bazie po restarcie serwera (NFR-05). Kopia zapasowa to kopia pliku `hungrycator.db`.
- Plik bazy jest w `.gitignore`, więc każdy członek zespołu ma własną lokalną bazę. Aby zacząć od danych startowych, zatrzymaj backend i usuń katalog `backend/data`.
- Inną lokalizację pliku można podać w zmiennej środowiskowej `DB_PATH`.
- Testy używają osobnej bazy w pamięci (`:memory:`), więc nie zmieniają pliku `hungrycator.db`.
- Tabele można przeglądać w darmowym programie [DB Browser for SQLite](https://sqlitebrowser.org/) (**Open Database** → `backend/data/hungrycator.db`).

Schemat (`backend/src/db/schema.ts`) odpowiada diagramowi encji `docs/EDR.png`:

| Tabela                                          | Zawartość                                               |
| :---------------------------------------------- | :------------------------------------------------------ |
| `users`                                         | Użytkownicy (domownicy)                                 |
| `households`                                    | Gospodarstwa domowe                                     |
| `memberships`                                   | Przynależność do gospodarstwa, rola i kolor domownika   |
| `invite_codes`                                  | Kody zaproszeń do gospodarstwa (FR-05, w przygotowaniu) |
| `product_categories`                            | Kategorie produktów                                     |
| `fridge_items`                                  | Produkty w lodówce (S-01)                               |
| `recipes`, `recipe_ingredients`, `recipe_steps` | Przepisy, ich składniki i kroki przygotowania           |
| `shopping_list_items`                           | Lista zakupów (FR-04, w przygotowaniu)                  |
| `meal_proposals`                                | Propozycje posiłków (S-02)                              |
| `votes`                                         | Głosy domowników na propozycje (S-02)                   |

## Zrealizowane historie użytkownika

### S-01: Rejestracja produktów w wirtualnej lodówce (FR-01)

Zakładka **Lodówka** → ekran „Moja lodówka”:

- przycisk **+** otwiera formularz: nazwa, kategoria, ilość, jednostka i termin ważności wybierany jednym kliknięciem („Do 3 dni”, „Do tygodnia”, „Ponad tydzień”, NFR-06),
- opcja **„Inna data”** pokazuje kalendarz (dzień/miesiąc/rok); aplikacja sama liczy, ile dni zostało do końca terminu (np. „do 05.12.2026, jeszcze 9 dni”),
- do sekcji **„Zjedz mnie najpierw”** trafiają produkty z terminem „Do 3 dni” albo z własną datą, do której zostały najwyżej 3 dni; pozostałe są w „Pozostałe produkty”,
- przyciski **−** / **+** zmieniają ilość o 1; przy ilości 0 produkt znika z lodówki,
- ten sam produkt nie może zostać dodany dwa razy (zamiast tego zmienia się jego ilość),
- lodówka jest wspólna dla S-01 i S-02: przepisy w zakładce Posiłki od razu pokazują, czy składnik jest w lodówce,
- widok odświeża się co 2 s, więc zmiany innych domowników pojawiają się w ciągu 3 s (NFR-04).

API:

| Metoda | Ścieżka           | Opis                                                                  |
| :----- | :---------------- | :-------------------------------------------------------------------- |
| GET    | `/api/fridge`     | Produkty w lodówce, od najkrótszego terminu ważności                  |
| POST   | `/api/fridge`     | Nowy produkt: `{ name, category, quantity, unit, expiry, expiresOn }` |
| PATCH  | `/api/fridge/:id` | Zmiana ilości: `{ change: 1 \| -1 }`; przy ilości 0 zwraca `204`      |

`expiry` to `soon`, `week`, `later` albo `date`; przy `date` pole `expiresOn` zawiera datę w formacie `RRRR-MM-DD`.

### S-02: Proponowanie posiłku i głosowanie (FR-02)

Zakładka **Posiłki** → ekran „Co dziś jemy?”:

- wybór posiłku (śniadanie, obiad, kolacja) na dziś,
- pole propozycji: po kliknięciu pokazuje przepisy z bazy (z liczbą składników dostępnych w lodówce), a wpisanie nazwy spoza bazy (np. „Kebab”) i zatwierdzenie dodaje własną propozycję,
- karta propozycji z potrzebnymi składnikami (dla przepisów z bazy) i głosowaniem „Tak” / „Może” / „Nie”,
- głosowanie kończy się, gdy zagłosują wszyscy domownicy; danie przechodzi, jeśli głosów „Tak” jest więcej niż „Nie”,
- widok odświeża się co 2 s, więc głosy i propozycje innych domowników pojawiają się w ciągu 3 s (NFR-04).

Do czasu wdrożenia logowania (FR-05) domownika wybiera się paskiem „Jesteś:” u góry ekranu. Wybór trafia do adresu, np. `http://localhost:5173/?jako=marek`, więc w dwóch kartach przeglądarki można sprawdzić, co widzą różni domownicy.

API (wymaga nagłówka `X-User-Id` z identyfikatorem domownika: `ania`, `marek` lub `ola`):

| Metoda | Ścieżka                                       | Opis                                                                           |
| :----- | :-------------------------------------------- | :----------------------------------------------------------------------------- |
| GET    | `/api/household`                              | Gospodarstwo i domownicy                                                       |
| GET    | `/api/recipes`                                | Przepisy z informacją o składnikach w lodówce                                  |
| GET    | `/api/proposals?date=RRRR-MM-DD&mealType=...` | Propozycje na dany posiłek (`breakfast`/`lunch`/`dinner`)                      |
| POST   | `/api/proposals`                              | Nowa propozycja: `{ date, mealType, recipeId }` lub `{ date, mealType, name }` |
| PUT    | `/api/proposals/:id/vote`                     | Głos: `{ value: "yes" \| "maybe" \| "no" }`                                    |
| DELETE | `/api/proposals/:id`                          | Wycofanie propozycji przez jej autora                                          |

## Testy

Testy API odpowiadające scenariuszom `TC-FR-01` i `TC-FR-02` z `tests/acceptance-tests.md`:

```bash
npm --prefix backend test
```

## Kontrola jakości kodu

Sprawdzanie kodu frontendowego za pomocą ESLint:

```bash
npm --prefix frontend run lint
```

Sprawdzanie kodu backendowego za pomocą ESLint:

```bash
npm --prefix backend run lint
```

Kompilacja backendu:

```bash
npm --prefix backend run build
```

## Formatowanie kodu

Polecenia uruchamiane w katalogu głównym projektu:

```bash
npm run format
npm run format:check
```

- `npm run format` – formatuje pliki objęte konfiguracją Prettiera.
- `npm run format:check` – sprawdza, czy pliki są poprawnie sformatowane, bez wprowadzania zmian.

## Standardy kodowania

W projekcie stosujemy następujące zasady:

- Nazwy zmiennych i funkcji zapisujemy w `camelCase`.
- Nazwy komponentów React, typów i interfejsów zapisujemy w `PascalCase`.
- Preferujemy jawne typowanie w TypeScript i unikamy nieuzasadnionego użycia `any`.
- Formatowanie kodu jest ujednolicane przez Prettier.
- Jakość kodu frontendowego i backendowego jest sprawdzana za pomocą ESLint.
- Nie umieszczamy haseł, tokenów ani innych sekretów w repozytorium.

## Repozytorium

Kod źródłowy projektu jest przechowywany na GitHubie:

[github.com/kasiek986/Hungrycator](https://github.com/kasiek986/Hungrycator)
