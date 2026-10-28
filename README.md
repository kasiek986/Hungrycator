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

Serwer deweloperski Vite przekazuje zapytania `/api` do backendu, więc oba procesy muszą działać jednocześnie. Dane są na razie przechowywane w pamięci serwera i resetują się przy jego restarcie.

## Zrealizowane historie użytkownika

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

Testy API odpowiadające scenariuszom `TC-FR-02` z `tests/acceptance-tests.md`:

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
