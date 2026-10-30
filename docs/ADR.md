# Architecture Decision Records (ADR) — Hungrycator

## Wprowadzenie

Dokument przedstawia najważniejsze decyzje architektoniczne podjęte podczas projektowania i tworzenia aplikacji **Hungrycator**. Każdy rekord ADR opisuje kontekst problemu, podjętą decyzję, rozważane alternatywy oraz konsekwencje wynikające z zastosowania wybranego rozwiązania.

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
- Aplikacja monolityczna, w której interfejs i logika biznesowa byłyby połączone w jednym systemie.
- Architektura Client-Server z oddzielnym frontendem i backendem.

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
- Vue.js jako alternatywa dla React.
- Angular jako rozbudowany framework frontendowy.
- JavaScript bez TypeScript.

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
- Python z frameworkiem FastAPI.
- Java z frameworkiem Spring Boot.
- Node.js z frameworkiem Express.

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

Przykładowe endpointy:

- `/api/household` – pobieranie informacji o gospodarstwie domowym.
- `/api/recipes` – pobieranie przepisów.
- `/api/proposals` – pobieranie i dodawanie propozycji posiłków.
- `/api/proposals/:id/vote` – przesyłanie głosu na wybrany posiłek.

### Rozważane alternatywy
- GraphQL – alternatywny sposób udostępniania danych przez API.
- WebSocket – komunikacja umożliwiająca przesyłanie danych w czasie rzeczywistym.
- REST API z wykorzystaniem formatu JSON.

### Konsekwencje
- Prosty i czytelny sposób komunikacji pomiędzy frontendem i backendem.
- Możliwość łatwego testowania endpointów API.
- JSON umożliwia wygodne przesyłanie danych pomiędzy różnymi częściami aplikacji.
- Konieczność obsługi odpowiedzi serwera oraz ewentualnych błędów komunikacji po stronie frontendu.

---

## ADR 5: Przechowywanie danych w pamięci serwera

- **Status:** Accepted (Przyjęte)

### Kontekst
Aplikacja Hungrycator wymaga przechowywania informacji o gospodarstwie domowym, produktach w lodówce, przepisach oraz propozycjach posiłków. Na obecnym etapie rozwoju projektu konieczne było zastosowanie prostego rozwiązania umożliwiającego przechowywanie i obsługę danych bez wdrażania zewnętrznej bazy danych.

### Decyzja
Zdecydowano się na tymczasowe przechowywanie danych w pamięci serwera backendowego.

Dane początkowe są przygotowywane na podstawie danych testowych (seed), a następnie obsługiwane przez mechanizm przechowywania danych w aplikacji backendowej.

### Rozważane alternatywy
- Relacyjna baza danych, np. PostgreSQL lub MySQL.
- Nierelacyjna baza danych, np. MongoDB.
- Przechowywanie danych w pamięci serwera.

### Konsekwencje
- Prostsza konfiguracja i uruchamianie aplikacji.
- Brak konieczności instalowania i konfigurowania zewnętrznej bazy danych.
- Szybsze przygotowanie prototypu aplikacji.
- Dane nie są trwale zapisywane.
- Po ponownym uruchomieniu serwera dane wracają do stanu początkowego.
- W przyszłości konieczne będzie wdrożenie trwałego mechanizmu przechowywania danych.

 ---

## ADR 6: Odświeżanie danych w interfejsie użytkownika (Polling)

- **Status:** Accepted (Przyjęte)

### Kontekst
W aplikacji Hungrycator kilku domowników może jednocześnie uczestniczyć w głosowaniu na posiłki. Istotne jest, aby propozycje oraz oddane głosy były widoczne również dla pozostałych użytkowników bez konieczności ręcznego odświeżania strony.

### Decyzja
Zdecydowano się na zastosowanie mechanizmu **Polling**, czyli cyklicznego wysyłania zapytań z frontendu do backendu w celu pobierania aktualnych danych.

W przypadku modułu głosowania widok jest odświeżany co 2 sekundy, dzięki czemu zmiany wprowadzone przez innych domowników są szybko widoczne.

### Rozważane alternatywy
- Ręczne odświeżanie strony przez użytkownika.
- WebSocket – utrzymywanie stałego połączenia pomiędzy klientem i serwerem.
- Polling – okresowe pobieranie aktualnych danych z serwera.

### Konsekwencje
- Użytkownicy widzą aktualne propozycje i głosy bez ręcznego odświeżania strony.
- Rozwiązanie jest stosunkowo proste do wdrożenia.
- Nie wymaga utrzymywania stałego połączenia WebSocket.
- Regularne zapytania zwiększają liczbę żądań kierowanych do serwera.
- Aktualizacje nie są natychmiastowe, ponieważ zależą od ustalonego interwału odświeżania.

---

## Podsumowanie

Podjęte decyzje architektoniczne pozwoliły na stworzenie aplikacji Hungrycator w oparciu o architekturę Client-Server, z wykorzystaniem nowoczesnych technologii frontendowych i backendowych.

Zastosowanie React, TypeScript, Vite, Node.js oraz Express umożliwiło rozdzielenie odpowiedzialności pomiędzy poszczególne części systemu. REST API i format JSON zapewniają komunikację pomiędzy frontendem a backendem.

Dodatkowo zastosowanie przechowywania danych w pamięci serwera oraz mechanizmu Polling pozwoliło na realizację podstawowych funkcjonalności aplikacji, w tym wspólnego głosowania na posiłki.

Przyjęte rozwiązania stanowią podstawę do dalszego rozwoju systemu, w szczególności wdrożenia trwałej bazy danych oraz pełnego systemu uwierzytelniania użytkowników.
