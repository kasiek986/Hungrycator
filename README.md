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
