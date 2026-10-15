# Plan Testów Akceptacyjnych i Weryfikacji Wymagań – Hungrycator

## 1. Warunki pomiaru i kryteria zaliczenia testów

### 1.1. Środowisko testowe i warunki początkowe
- **Środowisko uruchomieniowe:** Klikalny prototyp aplikacji / aplikacja webowo-mobilna *Hungrycator*.
- **Aktorzy testowi (zgodnie z `UC-01`–`UC-05`):**
  - **Domownik** – zalogowany członek gospodarstwa domowego posiadający dostęp do wspólnej lodówki, przepisów, głosowania i listy zakupów.
  - **Administrator gospodarstwa domowego** – domownik posiadający uprawnienia do generowania kodów zaproszenia (np. `HUNGRY-123`).
  - **Nowy domownik** – użytkownik zewnętrzny próbujący dołączyć do gospodarstwa za pomocą kodu zaproszenia.
- **Zestaw danych początkowych:**
  - Wirtualna lodówka zawiera produkt „Mleko” w ilości `2 szt.`
  - Baza przepisów zawiera przepis „Makaron ze szpinakiem” (wymagający składnika „Ser parmezan”, którego aktualnie brakuje w lodówce).
  - Aktywny kod zaproszenia wygenerowany przez Administratora: `HUNGRY-123`.
- **Warunki techniczne dla pomiarów NFR:**
  - Baza danych obciążona do 100 produktami w lodówce i 50 przepisami.
  - Stabilne połączenie internetowe (opóźnienie sieciowe `<= 50 ms`).
  - Do testów synchronizacji (`NFR-04`): dwie równolegle otwarte sesje różnych domowników należących do tego samego gospodarstwa.

### 1.2. Kryteria zaliczenia testów (Pass/Fail Criteria)
1. **Kryterium zaliczenia testów funkcjonalnych (`TC-FR-01` do `TC-FR-05`):** Test uznaje się za zaliczony (**PASS**), jeżeli po wykonaniu akcji z sekcji `When` stan systemu w 100% odpowiada rezultatowi zdefiniowanemu w sekcji `Then` (włączając scenariusze alternatywne z przypadków użycia `UC-01`–`UC-05`).
2. **Kryterium zaliczenia testów niefunkcjonalnych (`TC-NFR-01` do `TC-NFR-06`):** Test uznaje się za zaliczony (**PASS**), jeżeli zmierzona wartość metryki osiąga lub przewyższa próg docelowy z diagramu SysML i specyfikacji (`p95 <= 2 s`, `Availability >= 99%`, `100% odmów`, `p95 <= 3 s`, `MTTR <= 30 min`, `MTBF >= 50 h`, `Czas dodania <= 15 s`).

---

## 2. Testy Akceptacyjne dla Wymagań Funkcjonalnych (Zadanie 4 – Given–When–Then)

### TC-FR-01: Rejestracja produktów w wirtualnej lodówce
- **Weryfikowane elementy:** `FR-01` | Historia: `S-01` | Przypadek użycia: `UC-01`
- **Aktor:** Domownik

#### Test 1.1: Dodanie produktu z krótkim terminem ważności (Scenariusz podstawowy S-01.1 / UC-01)
- **Given:** Domownik ma dostęp do gospodarstwa domowego i ma otwarty formularz dodawania produktu w wirtualnej lodówce.
- **When:** Domownik wpisze nazwę „Pomidory”, wybierze kategorię „Warzywa”, ilość „4 szt.”, termin ważności „Do 3 dni” i kliknie przycisk „Dodaj do lodówki”.
- **Then:** Wybrana opcja terminu jest wyróżniona, a produkt „Pomidory (4 szt.)” zostaje zapisany i pojawia się w wirtualnej lodówce w sekcji „Zjedz mnie najpierw”.

#### Test 1.2: Zmiana ilości istniejącego produktu (Scenariusz alternatywny S-01.2 / UC-01)
- **Given:** W wirtualnej lodówce znajduje się produkt „Mleko” w ilości `2 szt.`
- **When:** Domownik kliknie przycisk zmniejszenia ilości (`-`) przy produkcie „Mleko”.
- **Then:** Ilość produktu „Mleko” na liście zmniejszy się do `1 szt.`

#### Test 1.3: Usunięcie produktu przez zmniejszenie ilości do zera (Scenariusz alternatywny S-01.2 / UC-01)
- **Given:** W wirtualnej lodówce znajduje się produkt „Mleko” w ilości `1 szt.`
- **When:** Domownik ponownie kliknie przycisk zmniejszenia ilości (`-`), sprowadzając wartość do `0`.
- **Then:** Produkt „Mleko” zostaje całkowicie usunięty z listy produktów w wirtualnej lodówce.

---

### TC-FR-02: Proponowanie posiłku i głosowanie domowników
- **Weryfikowane elementy:** `FR-02` | Historia: `S-02` | Przypadek użycia: `UC-02`
- **Aktorzy:** Domownik, pozostali domownicy

#### Test 2.1: Zgłoszenie propozycji z bazy przepisów i głosowanie (Scenariusz S-02.1 / UC-02)
- **Given:** Domownik ma otwartą sekcję „Co dziś jemy?”.
- **When:** Domownik wybierze przepis „Makaron ze szpinakiem” jako propozycję na kolację i zatwierdzi wybór.
- **Then:** Pozostali domownicy zobaczą propozycję „Makaron ze szpinakiem” i będą mogli oddać głos klikając „Tak” lub „Nie”, a system zaprezentuje zebrane głosy.

#### Test 2.2: Zgłoszenie własnej propozycji spoza bazy (Scenariusz S-02.2 / UC-02)
- **Given:** Domownik ma otwartą sekcję „Co dziś jemy?” i ma ochotę na danie, którego nie ma w bazie przepisów (np. „Kebab”).
- **When:** Domownik wpisze nazwę „Kebab” w polu propozycji dziennej i zatwierdzi.
- **Then:** Propozycja „Kebab” pojawi się na karcie dnia dla wszystkich domowników wraz z możliwością głosowania („Tak” / „Nie”).

---

### TC-FR-03: Dodawanie nowego przepisu do bazy
- **Weryfikowane elementy:** `FR-03` | Historia: `S-03` | Przypadek użycia: `UC-03`
- **Aktor:** Domownik

#### Test 3.1: Opublikowanie nowego przepisu (Scenariusz S-03.1 / UC-03)
- **Given:** Domownik ma otwarty formularz dodawania nowego przepisu w bazie przepisów.
- **When:** Domownik uzupełni nazwę przepisu, listę składników oraz instrukcję przygotowania krok po kroku i kliknie przycisk „Opublikuj”.
- **Then:** System zapisze nowy przepis i stanie się on widoczny w bazie przepisów dla wszystkich domowników (z możliwością jego przeglądania i filtrowania).

---

### TC-FR-04: Generowanie listy zakupów z brakujących składników
- **Weryfikowane elementy:** `FR-04` | Historia: `S-04` | Przypadek użycia: `UC-04`
- **Aktor:** Domownik

#### Test 4.1: Automatyczne przeniesienie brakujących składników (Scenariusz S-04.1 / UC-04)
- **Given:** Domownik ma otwarty podgląd przepisu „Makaron ze szpinakiem”, a system po porównaniu ze stanem wirtualnej lodówki wskazuje, że brakuje składnika „Ser parmezan”.
- **When:** Domownik kliknie przycisk „Dodaj brakujące do zakupów”.
- **Then:** Składnik „Ser parmezan” zostanie automatycznie dodany do wspólnej listy zakupów w sekcji produktów do kupienia.

#### Test 4.2: Ręczne oznaczenie zakupionego produktu (Scenariusz alternatywny UC-04)
- **Given:** Na wspólnej liście zakupów znajduje się pozycja „Ser parmezan” jako produkt do kupienia.
- **When:** Domownik ręcznie oznaczy produkt „Ser parmezan” jako zakupiony (wykreśli go z listy).
- **Then:** Wspólna lista zakupów odzwierciedla zmianę i przenosi „Ser parmezan” do produktów kupionych.

---

### TC-FR-05: Zarządzanie domownikami i kod zaproszenia
- **Weryfikowane elementy:** `FR-05` | Historia: `S-05` | Przypadek użycia: `UC-05`
- **Aktorzy:** Administrator gospodarstwa domowego, Nowy domownik

#### Test 5.1: Dołączenie nowego domownika z poprawnym kodem (Scenariusz S-05.1 / UC-05)
- **Given:** Administrator gospodarstwa domowego wygenerował unikalny kod zaproszenia `"HUNGRY-123"` i przekazał go nowemu domownikowi.
- **When:** Nowy użytkownik wpisze kod `"HUNGRY-123"` podczas konfiguracji profilu / dołączania do gospodarstwa.
- **Then:** System pozytywnie zweryfikuje kod, przypisze nowego użytkownika do danego gospodarstwa domowego i przyzna mu dostęp do wspólnej lodówki oraz listy zakupów.

#### Test 5.2: Próba dołączenia z nieprawidłowym kodem (Scenariusz alternatywny UC-05)
- **Given:** Nowy domownik znajduje się na ekranie wpisywania kodu zaproszenia.
- **When:** Nowy domownik wprowadzi nieprawidłowy lub nieistniejący kod (np. `"BLEDNY-999"`) i zatwierdzi formularz.
- **Then:** System odrzuci żądanie i wyświetli komunikat informujący użytkownika, że nie można dołączyć do gospodarstwa domowego.

---

## 3. Testy Weryfikujące Wymagania Niefunkcjonalne (Zadanie 4 – Given–When–Then dla NFR)

### TC-NFR-01: Weryfikacja wydajności ładowania listy produktów
- **Weryfikowane wymaganie:** `NFR-01` (Wydajność) — powiązane z `FR-01`, `FR-04`
- **Metryka docelowa:** Czas odpowiedzi `p95 <= 2 s`
- **Given:** W wirtualnej lodówce i na liście zakupów znajduje się łącznie do 100 pozycji produktowych.
- **When:** Domownik 100-krotnie wywołuje ładowanie listy produktów w lodówce (`UC-01`) oraz generowanie listy zakupów (`UC-04`).
- **Then:** Co najmniej **95% pomiarów (95 na 100 prób)** kończy się pełnym wyświetleniem listy produktów w czasie **maksymalnie 2,0 s**.

### TC-NFR-02: Weryfikacja dostępności systemu w skali miesiąca
- **Weryfikowane wymaganie:** `NFR-02` (Dostępność) — powiązane z `FR-01`, `FR-02`
- **Metryka docelowa:** `Availability >= 99%` w miesiącu (przy `MTBF >= 50 h`)
- **Given:** Moduły wirtualnej lodówki (`FR-01`) oraz proponowania posiłków i głosowania (`FR-02`) są uruchomione i monitorowane w sposób ciągły przez 30 dni (720 godzin).
- **When:** Narzędzie monitorujące odpytuje usługę co 60 sekund i oblicza dostępność wg wzoru `Availability = MTBF / (MTBF + MTTR) * 100%`.
- **Then:** Uzyskana dostępność systemu wynosi **co najmniej 99,0%** w skali miesiąca, a średni czas bezawaryjnej pracy **MTBF wynosi minimum 50 godzin**.

### TC-NFR-03: Weryfikacja bezpieczeństwa i ochrony przed nieuprawnionym dostępem
- **Weryfikowane wymaganie:** `NFR-03` (Bezpieczeństwo) — powiązane z `FR-05`
- **Metryka docelowa:** `100%` prób nieuprawnionego dostępu kończy się odmową
- **Given:** Gospodarstwo domowe jest chronione autoryzacją oraz unikalnym kodem zaproszenia (`FR-05`).
- **When:** Wykonanych zostaje 50 prób dostępu do zasobów gospodarstwa przez osobę niebędącą członkiem grupy lub posługującą się błędnym/wygasłym kodem zaproszenia.
- **Then:** **100% prób (50 na 50)** kończy się odmową dostępu i wyświetleniem komunikatu błędu bez ujawnienia zawartości lodówki ani listy zakupów.

### TC-NFR-04: Weryfikacja czasu synchronizacji danych między domownikami
- **Weryfikowane wymaganie:** `NFR-04` (Synchronizacja danych) — powiązane z `FR-01`, `FR-02`
- **Metryka docelowa:** Czas synchronizacji `p95 <= 3 s`
- **Given:** Dwóch domowników tego samego gospodarstwa ma jednocześnie otwartą aplikację *Hungrycator*.
- **When:** Pierwszy domownik wykonuje serię 100 zmian: dodaje „Pomidory” lub zmienia ilość „Mleka” (`UC-01`) oraz oddaje głos „Tak/Nie” na „Makaron ze szpinakiem” (`UC-02`).
- **Then:** W przypadku co najmniej **95% zmian** zaktualizowany stan pojawia się u drugiego domownika w ciągu **maksymalnie 3,0 s**.

### TC-NFR-05: Weryfikacja czasu naprawy i odtwarzania po awarii (MTTR)
- **Weryfikowane wymaganie:** `NFR-05` (Odtwarzanie po awarii) — powiązane z `FR-01`
- **Metryka docelowa:** `MTTR <= 30 minut`
- **Given:** Wirtualna lodówka (`FR-01`) zawiera zapisane produkty domowników i następuje nieoczekiwane zatrzymanie usługi bazodanowej.
- **When:** Zostaje uruchomiona procedura odtworzenia usługi i przywrócenia stanu z kopii zapasowej.
- **Then:** Średni czas naprawy (**MTTR**) od momentu awarii do pełnego przywrócenia działania modułu `FR-01` **nie przekracza 30 minut**, a lista produktów jest kompletna.

### TC-NFR-06: Weryfikacja użyteczności dodawania produktu (Usability)
- **Weryfikowane wymaganie:** `NFR-06` (Użyteczność) — powiązane z `FR-01`
- **Metryka docelowa:** Czas wykonania zadania `<= 15 s`, skuteczność `100%`
- **Given:** Domownik ma otwarty formularz dodawania produktu (`S-01`).
- **When:** Wpisuje nazwę „Pomidory”, wybiera kategorię „Warzywa”, ilość „4 szt.” i kliknięciem wybiera przybliżony termin „Do 3 dni”.
- **Then:** Cały proces dodania produktu trwa **maksymalnie 15 sekund**, a **100% badanych użytkowników** poprawnie wykonuje zadanie bez konieczności wpisywania daty z kalendarza.

---

## 4. Sprawdzenie weryfikowalności wymagań (Zadanie 5)

Poniższa tabela stanowi audyt weryfikowalności wszystkich wymagań funkcjonalnych (`FR`) i niefunkcjonalnych (`NFR`) z diagramu SysML oraz specyfikacji:

| ID Wymagania | Kategoria SQuaRE (ISO/IEC 25002) | Powiązane S / UC / FR | Przypisana metryka | Kryterium zaliczenia | Identyfikator testu | Czy weryfikowalne? |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **FR-01** | *Functional Suitability* | `S-01`, `UC-01` | Zgodność ze scenariuszem GWT | Dodanie „Pomidorów”, zmiana ilości „Mleka” (`2 -> 1 -> 0`) | `TC-FR-01` (Testy 1.1–1.3) | ✅ TAK |
| **FR-02** | *Functional Suitability* | `S-02`, `UC-02` | Zgodność ze scenariuszem GWT | Propozycja „Makaron ze szpinakiem” / „Kebab” + głosy „Tak/Nie” | `TC-FR-02` (Testy 2.1–2.2) | ✅ TAK |
| **FR-03** | *Functional Suitability* | `S-03`, `UC-03` | Zgodność ze scenariuszem GWT | Publikacja przepisu i widoczność w bazie dla domowników | `TC-FR-03` (Test 3.1) | ✅ TAK |
| **FR-04** | *Functional Suitability* | `S-04`, `UC-04` | Zgodność ze scenariuszem GWT | Dodanie „Sera parmezan” do zakupów i ręczne wykreślenie | `TC-FR-04` (Testy 4.1–4.2) | ✅ TAK |
| **FR-05** | *Functional Suitability* | `S-05`, `UC-05` | Zgodność ze scenariuszem GWT | Dołączenie kodem `HUNGRY-123` i odrzucenie błędnego kodu | `TC-FR-05` (Testy 5.1–5.2) | ✅ TAK |
| **NFR-01** | *Performance Efficiency* | `FR-01`, `FR-04` | Czas ładowania listy (`p95`) | `p95 <= 2,0 s` (dla 95% pomiarów) | `TC-NFR-01` | ✅ TAK |
| **NFR-02** | *Reliability (Availability)* | `FR-01`, `FR-02` | `Availability` oraz `MTBF` | `Availability >= 99%` w miesiącu (`MTBF >= 50 h`) | `TC-NFR-02` | ✅ TAK |
| **NFR-03** | *Security* | `FR-05` | Access Rejection Rate (%) | `100%` nieuprawnionych prób zakończonych odmową | `TC-NFR-03` | ✅ TAK |
| **NFR-04** | *Performance / Co-existence* | `FR-01`, `FR-02` | Czas synchronizacji (`p95`) | `p95 <= 3,0 s` (dla 95% zmian u drugiego domownika) | `TC-NFR-04` | ✅ TAK |
| **NFR-05** | *Reliability (Recoverability)* | `FR-01` | `MTTR` (oraz `MTBF`) | `MTTR <= 30 minut`, brak utraty danych | `TC-NFR-05` | ✅ TAK |
| **NFR-06** | *Usability (Operability)* | `FR-01` | Czas wykonania zadania i skuteczność | Czas `<= 15 s`, skuteczność `100%` | `TC-NFR-06` | ✅ TAK |
