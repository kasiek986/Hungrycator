# Architecture Decision Records (ADR) — Hungrycator

## ADR 1: Architektura Client-Server (Podział na Frontend i Backend)
* **Status:** Przyjęte (Accepted)
* **Kontekst:** Aplikacja Hungrycator wymaga interaktywnego interfejsu dla wielu domowników oraz centralnego serwera do synchronizacji stanu lodówki i listy zakupów.
* **Decyzja:** Zdecydowaliśmy się na rozdzielenie aplikacji na niezależny **Frontend** (Aplikacja jednostronicowa - SPA) oraz **Backend** (REST API).

## ADR 2: Wybór technologii dla Frontendu (React + TypeScript + Vite)
* **Status:** Przyjęte (Accepted)
* **Kontekst:** Potrzebujemy szybkiego i reaktywnego interfejsu użytkownika do dynamicznego odświeżania stanu lodówki (FR-01) i głosowania na posiłki (FR-02).
* **Decyzja:** Wybrano bibliotekę **React** w połączeniu z **TypeScript** oraz bundlerem **Vite**.

## ADR 3: Wybór technologii dla Backendu (Node.js + Express + TypeScript)
* **Status:** Przyjęte (Accepted)
* **Kontekst:** Serwer musi sprawnie przetwarzać zapytania REST API i szybko odpowiadać na żądania domowników.
* **Decyzja:** Wybrano **Node.js** z frameworkiem **Express.js** i językiem **TypeScript**.

## ADR 4: Format wymiany danych (REST API / JSON)
* **Status:** Przyjęte (Accepted)
* **Kontekst:** System wymaga prostego, znormalizowanego sposobu przekazywania informacji o produktach, głosach i przepisach.
* **Decyzja:** Wykorzystujemy architekturę **REST API** z formatem danych **JSON**.
