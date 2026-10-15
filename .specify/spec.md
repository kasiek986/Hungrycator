# Specyfikacja Projektu – Hungrycator 

## 1. Cel aplikacji
**Hungrycator** to aplikacja webowa, która pomaga domownikom lepiej planować posiłki, kontrolować zawartość lodówki i niemarnować jedzenia.
Aplikacja umożliwia: 
* Kontrolowanie dat ważności produktów.
* Wspólne wybieranie i głosowanie na posiłki.
* Przeglądanie i dodawanie własnych przepisów.
* Automatyczne tworzenie listy zakupów dla brakujących składników.

## 2. Użytkownicy docelowi
* **Współlokatorzy i rodziny** – osoby, które dzielą kuchnię i wspólnie robią zapasy.
* **Studenci i osoby prywatne** – każdy, kto szuka pomysłów na szybki obiad z tego, co ma pod ręką, i chce ograniczyć wyrzucanie jedzenia.

## 3. Zakres funkcjonalności
* **Wirtualna lodówka:** Wprowadzanie produktów z podziałem na kategorie, ilości oraz termin ważności.
* **Wspólne gospodarstwo domowe:** Dołączanie członków rodziny lub współlokatorów za pomocą kodu zaproszenia.
* **Planowanie posiłków i głosowanie:** Proponowanie dań z bazy lub własnych pomysłów oraz głosowanie przez domowników ("Tak" / "Nie").
* **Baza przepisów:** Wyszukiwanie dań oraz dodawanie własnych przepisów (składniki, opis przygotowania).
* **Lista zakupów:** Automatyczne dodawanie brakujących składników oraz możliwość ręcznego wykreślania kupionych rzeczy.

## 4. Wymagania funkcjonalne 
* **FR-01 (Zarządzanie lodówką):** System umożliwia dodawanie i edycja produktów spożywczych wraz z kategorią, ilością, jednostką oraz terminem ważności ("do 3 dni", "do tygodnia").
* **FR-02 (Propozycje posiłków i głosowanie):** System umożliwia zgłoszenie propozycji posiłku na dany dzień oraz zbieranie głosów reakcji ("tak/nie") od pozostałych członków gospodarstwa domowego.
* **FR-03 (Baza i tworzenie przepisów):** System pozwala na przeglądanie bazy przepisów, ich filtrowanie, a także dodawanie nowych, autorskich przepisów wraz z wykazem potrzebnych składników.
* **FR-04 (Automatyczna lista zakupów):** System umożliwia tworzenie wspólnej listy zakupów oraz automatyczne przenoszenie brakujących składników z wybranego przepisu na listę do kupienia.
* **FR-05 (Zarządzanie gospodarstwem domowym):** System pozwala na tworzenie grupy gospodarstwa domowego oraz zapraszanie członków za pomocą unikalnego kodu zaproszenia.


## 5. Wymagania niefunkcjonalne (NFR) – Klasyfikacja wg ISO/IEC 25002 (SQuaRE)

Wymagania jakościowe zostały skorelowane z wymaganiami funkcjonalnymi (`FR-01`–`FR-05`) oraz mierzalnymi metrykami inżynierii oprogramowania:

- **NFR-01 (Wydajność – *Performance Efficiency / Time Behaviour*):**
  - **Opis z diagramu SysML:** 95% pomiarów ładowania listy produktów trwa maksymalnie 2 s.
  - **Powiązane wymagania (`<<trace>>`):** `FR-01`, `FR-04` (oraz rekomendowane `FR-03`).
  - **Metryka:** Czas odpowiedzi (Response Time – 95. percentyl `p95`).
  - **Warunki pomiaru:** Baza danych zawierająca do 100 produktów i 50 przepisów, 3 aktywnych domowników w gospodarstwie, próba 100 żądań HTTP przy standardowym łączu sieciowym.
  - **Kryterium zaliczenia:** `p95 <= 2,0 s` (minimum 95 na 100 pomiarów kończy się pełnym wyrenderowaniem listy w czasie do 2 sekund).

- **NFR-02 (Dostępność – *Reliability / Availability*):**
  - **Opis z diagramu SysML:** Dostępność systemu (Availability) wynosi co najmniej 99% w miesiącu.
  - **Powiązane wymagania (`<<trace>>`):** `FR-01`, `FR-02`.
  - **Metryka:** Wskaźnik dostępności `Availability = MTBF / (MTBF + MTTR) * 100%` skorelowany z metryką **MTBF (Mean Time Between Failures) >= 50 h**.
  - **Warunki pomiaru:** Ciągły monitoring dostępności usługi (health-check co 60 sekund) w skali miesiąca rozliczeniowego (720 godzin).
  - **Kryterium zaliczenia:** `Availability >= 99,0%` (łączny czas niedostępności w miesiącu nie przekracza 7,2 godziny).

- **NFR-03 (Bezpieczeństwo – *Security / Confidentiality & Authenticity*):**
  - **Opis z diagramu SysML:** 100% prób nieuprawnionego dostępu kończy się odmową.
  - **Powiązane wymagania (`<<trace>>`):** `FR-05`.
  - **Metryka:** Odsetek zablokowanych nieautoryzowanych prób dostępu (Access Rejection Rate %).
  - **Warunki pomiaru:** Próby dołączenia do gospodarstwa za pomocą nieprawidłowego lub wygasłego kodu zaproszenia (scenariusz alternatywny `UC-05`) oraz próby odczytu lodówki bez przypisania do grupy.
  - **Kryterium zaliczenia:** `100%` nieuprawnionych żądań zostaje odrzuconych komunikatem o błędzie (status HTTP 401/403).

- **NFR-04 (Synchronizacja danych / Niezawodność współdziałania – *Performance Efficiency & Reliability*):**
  - **Opis z diagramu SysML:** 95% zmian jest widocznych u drugiego domownika w ciągu 3 s.
  - **Powiązane wymagania (`<<trace>>`):** `FR-01`, `FR-02`.
  - **Metryka:** Czas propagacji zmian (Sync Latency – 95. percentyl `p95`).
  - **Warunki pomiaru:** Dwie aktywne sesje domowników tego samego gospodarstwa; pierwszy domownik dodaje produkt/zmienia ilość (`UC-01`) lub oddaje głos „Tak/Nie” na posiłek (`UC-02`).
  - **Kryterium zaliczenia:** `p95 <= 3,0 s` od momentu zatwierdzenia akcji przez pierwszego domownika do aktualizacji widoku u drugiego domownika.

- **NFR-05 (Odtwarzanie po awarii / Niezawodność – *Reliability / Recoverability*):**
  - **Opis z diagramu SysML:** Średni czas naprawy (MTTR) nie przekracza 30 minut.
  - **Powiązane wymagania (`<<trace>>`):** `FR-01`.
  - **Metryka:** **MTTR (Mean Time To Repair)** = `Całkowity czas naprawy / Liczba awarii` oraz **MTBF (Mean Time Between Failures) >= 50 h**.
  - **Warunki pomiaru:** Symulacja awarii serwera/bazy danych przechowującej stan wirtualnej lodówki i pomiar czasu potrzebnego na restart usługi oraz przywrócenie spójności danych.
  - **Kryterium zaliczenia:** `MTTR <= 30 minut` oraz `0` utraconych rekordów produktów zapisanych przed awarią.

- **NFR-06 (Użyteczność – *Usability / Operability*):**
  - **Opis:** Dodanie nowego produktu z wyborem predefiniowanego terminu ważności („Do 3 dni”, „Do tygodnia”, „Ponad tydzień”) zajmuje użytkownikowi maksymalnie 15 sekund.
  - **Powiązane wymagania (`<<trace>>`):** `FR-01`.
  - **Metryka:** Czas wykonania zadania (Task Completion Time) oraz skuteczność zadania (Task Success Rate %).
  - **Warunki pomiaru:** Test użyteczności na prototypie z udziałem 5 użytkowników wykonujących scenariusz `S-01` (dodanie produktu bez konieczności ręcznego wpisywania daty kalendarzowej).
  - **Kryterium zaliczenia:** Czas operacji `<= 15 s` oraz `100%` użytkowników poprawnie kończących dodawanie produktu.

## 6. Powiązanie wymagań funkcjonalnych, NFR, historii i przypadków użycia

| Wymaganie funkcjonalne | Historia użytkownika | Przypadek użycia | Powiązane wymagania NFR |
| :--- | :--- | :--- | :--- |
| **FR-01** (Zarządzanie lodówką) | `S-01` | `UC-01` | `NFR-01`, `NFR-02`, `NFR-04`, `NFR-05`, `NFR-06` |
| **FR-02** (Propozycje posiłków i głosowanie) | `S-02` | `UC-02` | `NFR-02`, `NFR-04` |
| **FR-03** (Baza i tworzenie przepisów) | `S-03` | `UC-03` | `NFR-01` *(rekomendowane powiązanie)* |
| **FR-04** (Automatyczna lista zakupów) | `S-04` | `UC-04` | `NFR-01` |
| **FR-05** (Zarządzanie gospodarstwem domowym) | `S-05` | `UC-05` | `NFR-03` |
