# Architecture Decision Records (ADR) — Hungrycator

## Wprowadzenie

Dokument przedstawia najważniejsze decyzje architektoniczne podjęte podczas projektowania i tworzenia aplikacji Hungrycator. Każdy rekord ADR opisuje kontekst problemu, podjętą decyzję, rozważane alternatywy oraz konsekwencje wynikające z zastosowania wybranego rozwiązania.

Aplikacja Hungrycator służy do zarządzania wspólną wirtualną lodówką, produktami spożywczymi, listą zakupów oraz planowania posiłków przez domowników.

---

## ADR 1: Architektura Client-Server (Podział na Frontend i Backend)

- **Status:** Accepted (Przyjęte)

### Kontekst

Aplikacja Hungrycator jest przeznaczona dla wielu domowników, którzy powinni mieć możliwość korzystania ze wspólnych danych, takich jak zawartość lodówki, produkty oraz propozycje posiłków. Konieczne było zastosowanie rozwiązania umożliwiającego oddzielenie interfejsu użytkownika od logiki odpowiedzialnej za przetwarzanie danych.

### Decyzja

Zdecydowano się na architekturę **Client-Server**, w której aplikacja została podzielona na dwie główne części:

- **Frontend** – odpowiada za interfejs użytkownika, prezentowanie danych oraz obsługę interakcji użytkownika.
- **Backend** – odpowiada za przetwarzanie żądań, realizację logiki biznesowej oraz udostępnianie danych poprzez API.

Obie części komunikują się ze sobą za pomocą interfejsu REST API.

### Rozważane alternatywy

- Brak

### Konsekwencje

- Możliwość niezależnego rozwijania frontendu i backendu.
- Łatwiejsze utrzymanie oraz testowanie poszczególnych części aplikacji.
- Możliwość rozbudowy backendu bez konieczności przebudowy całego interfejsu.
- Konieczność utrzymywania komunikacji pomiędzy dwiema oddzielnymi częściami systemu.

---

## ADR 2: Wybór technologii dla Frontendu (React + TypeScript + Vite)

- **Status:** Accepted (Przyjęte)

### Kontekst

Aplikacja Hungrycator wymaga interaktywnego i przejrzystego interfejsu użytkownika. Użytkownicy powinni mieć możliwość przeglądania zawartości lodówki, zarządzania produktami oraz uczestniczenia w głosowaniu na posiłki. Istotna jest również możliwość dynamicznego aktualizowania wyświetlanych informacji.

### Decyzja

Wybrano następujące technologie:

- **React** – biblioteka służąca do tworzenia interfejsów użytkownika opartych na komponentach.
- **TypeScript** – język programowania rozszerzający JavaScript o system typów, który ułatwia wykrywanie błędów i utrzymanie kodu.
- **Vite** – narzędzie odpowiedzialne za uruchamianie środowiska deweloperskiego oraz budowanie aplikacji.

### Rozważane alternatywy

- Brak

### Konsekwencje

- Możliwość tworzenia interfejsu z wykorzystaniem wielokrotnie używanych komponentów.
- Łatwiejsze zarządzanie dynamicznie zmieniającymi się danymi.
- System typów TypeScript pomaga ograniczyć liczbę błędów.
- Vite zapewnia szybkie uruchamianie i budowanie aplikacji.
- Konieczność znajomości React oraz TypeScript.

---

## ADR 3: Wybór technologii dla Backendu (Node.js + Express + TypeScript)

- **Status:** Accepted (Przyjęte)

### Kontekst

Backend aplikacji Hungrycator odpowiada za obsługę żądań przesyłanych przez frontend oraz realizację logiki biznesowej. Musi umożliwiać zarządzanie danymi domowników, produktami, przepisami oraz propozycjami posiłków i głosowaniem.

### Decyzja

Wybrano następujące technologie:

- **Node.js** – środowisko uruchomieniowe JavaScript po stronie serwera.
- **Express.js** – framework umożliwiający tworzenie serwera HTTP oraz obsługę endpointów API.
- **TypeScript** – zapewnia typowanie danych i ułatwia organizację kodu backendowego.

### Rozważane alternatywy

- Brak

### Konsekwencje

- Możliwość sprawnej obsługi żądań HTTP.
- Wykorzystanie TypeScript zarówno po stronie frontendu, jak i backendu.
- Łatwiejsze tworzenie i rozwijanie endpointów API.
- Możliwość testowania logiki backendowej niezależnie od interfejsu użytkownika.

---

## ADR 4: Sposób komunikacji pomiędzy Frontendem i Backendem (REST API / JSON)

- **Status:** Accepted (Przyjęte)

### Kontekst

Frontend i backend aplikacji Hungrycator są oddzielnymi częściami systemu, dlatego konieczne było określenie sposobu wymiany danych pomiędzy nimi. Komunikacja musi umożliwiać pobieranie informacji o domownikach, przepisach, produktach oraz przesyłanie propozycji posiłków i głosów.

### Decyzja

Zdecydowano się na wykorzystanie architektury **REST API** oraz formatu **JSON** do wymiany danych.

W komunikacji wykorzystywane są metody HTTP:

- **GET** – pobieranie danych.
- **POST** – dodawanie nowych danych.
- **PUT** – aktualizowanie istniejących danych.
- **DELETE** – usuwanie danych.

### Rozważane alternatywy

- Brak

### Konsekwencje

- Prosty i czytelny sposób komunikacji pomiędzy frontendem i backendem.
- Możliwość łatwego testowania endpointów API.
- JSON umożliwia wygodne przesyłanie danych pomiędzy różnymi częściami aplikacji.
- Konieczność obsługi odpowiedzi serwera oraz ewentualnych błędów komunikacji po stronie frontendu.

---

## ADR 5: Trwałe przechowywanie danych (baza danych SQLite)

- **Status:** Accepted (Przyjęte)

### Kontekst

Pierwsza wersja prototypu przechowywała stan aplikacji w pamięci serwera, więc każdy restart backendu usuwał produkty z lodówki, propozycje posiłków i głosy. Wymaganie NFR-05 zakłada, że po awarii nie zostaną utracone żadne zapisane produkty. Strukturę danych opisuje diagram encji (`docs/EDR.png`). Rozwiązanie musi działać lokalnie u każdego członka zespołu bez zakładania kont i konfigurowania serwerów.

### Decyzja

Zdecydowano się na relacyjną bazę danych **SQLite**:

- dane są zapisywane w pliku `backend/data/hungrycator.db`,
- backend korzysta z modułu `node:sqlite` wbudowanego w Node.js 24, więc nie potrzebuje dodatkowych zależności npm,
- tabele odpowiadają encjom z diagramu ERD, a klucze obce i ograniczenia `CHECK` pilnują spójności danych,
- przy pierwszym uruchomieniu backend zakłada tabele i wypełnia je danymi startowymi, a testy korzystają z osobnej bazy w pamięci (`:memory:`).

### Rozważane alternatywy

- **PostgreSQL** (lokalnie lub w chmurze, np. Supabase) – pełny serwer bazy danych, lepszy przy wielu jednoczesnych użytkownikach, ale wymaga instalacji lub konta oraz konfiguracji połączenia na każdym komputerze.
- **Usługi przechowywania plików w chmurze (Azure Blob Storage, AWS S3)** – dobre do plików, np. zdjęć potraw, ale nie do danych powiązanych relacjami, które trzeba filtrować i aktualizować; wymagają konta w chmurze.
- **Plik JSON** – najprostszy, ale bez kluczy obcych, transakcji i zapytań; przy jednoczesnych zapisach łatwo o niespójne dane.

### Konsekwencje

- Dane nie znikają po restarcie serwera (NFR-05), a kopię zapasową tworzy się, kopiując jeden plik.
- Baza działa od razu po uruchomieniu backendu, bez instalowania dodatkowych programów.
- Schemat odpowiada diagramowi ERD, więc ewentualne przejście na PostgreSQL wymaga głównie zmiany zapytań w magazynach danych (`FridgeStore`, `MealPlanStore`).
- SQLite obsługuje jeden proces serwera. Przy wdrożeniu z wieloma instancjami backendu należałoby przejść na serwer bazy danych, np. PostgreSQL.

---

## Podsumowanie

Podjęte decyzje architektoniczne pozwoliły na zaprojektowanie aplikacji Hungrycator w oparciu o architekturę Client-Server, która rozdziela frontend odpowiedzialny za interfejs użytkownika od backendu realizującego logikę biznesową.

Wykorzystanie technologii React, TypeScript i Vite umożliwiło stworzenie interaktywnego interfejsu użytkownika, natomiast Node.js i Express zapewniają obsługę logiki serwerowej oraz żądań przesyłanych przez aplikację.

Do komunikacji pomiędzy frontendem i backendem wykorzystano REST API oraz format JSON, co zapewnia prosty i uporządkowany sposób wymiany danych. Dane aplikacji są trwale zapisywane w relacyjnej bazie SQLite, której tabele odpowiadają diagramowi encji.

Zastosowane rozwiązania tworzą spójną podstawę architektoniczną aplikacji Hungrycator oraz umożliwiają jej dalszy rozwój, rozbudowę funkcjonalności i łatwiejsze utrzymanie kodu.
