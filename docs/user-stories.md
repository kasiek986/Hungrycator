# Historie Użytkownika (User Stories) – Hungrycator

### US-01: Rejestracja produktów w wirtualnej lodówce
**Powiązane wymaganie:** FR-01  
**Opis:** Jako domownik chcę dodawać produkty do wirtualnej lodówki wraz z terminem ważności, aby kontrolować zapasy i wiedzieć, co należy zjeść w pierwszej kolejności.  

* **Kryteria akceptacji (Acceptance Criteria):**
  * *Scenario 1: Pomyślne dodanie produktu z terminem ważności*
    * **Given** użytkownik znajduje się w formularzu dodawania produktu do lodówki,
    * **When** wprowadzi nazwę „Pomidory”, wybierze kategorię „Warzywa”, ilość „4 szt.” oraz przybliżony termin ważności „Do 3 dni” i kliknie „Dodaj do lodówki”,
    * **Then** produkt zostaje zapisany w wirtualnej lodówce w sekcji „Zjedz mnie najpierw”.
  * *Scenario 2: Usunięcie lub zmiana ilości zapasów*
    * **Given** produkt „Mleko” znajduje się w lodówce w ilości 2 szt.,
    * **When** użytkownik kliknie przycisk zmniejszenia ilości („-”),
    * **Then** ilość produktu zmniejsza się do 1 szt., a przy wartości 0 produkt jest usuwany z lodówki.

---

### US-02: Proponowanie posiłku i głosowanie domowników
**Powiązane wymaganie:** FR-02  
**Opis:** Jako użytkownik chcę zaproponować danie na dzisiejszy posiłek i zebrać opinii domowników, aby wspólnie zdecydować, co dzisiaj jemy.  

* **Kryteria akceptacji (Acceptance Criteria):**
  * *Scenario 1: Zgłoszenie propozycji i oddanie głosu na „Tak”*
    * **Given** użytkownik znajduje się w sekcji „Co dziś jemy?”,
    * **When** wybierze przepis „Makaron ze szpinakiem” jako propozycję na kolację,
    * **Then** pozostali domownicy widzą propozycję w swojej aplikacji i mogą kliknąć przycisk „Tak” lub „Nie”.
  * *Scenario 2: Propozycja własnego dania spoza bazy*
    * **Given** użytkownik ma ochotę na danie, którego nie ma jeszcze w bazie (np. „Kebab”),
    * **When** wpisze nazwę „Kebab” w polu propozycji dziennej i zatwierdzi,
    * **Then** propozycja pojawia się na karcie dnia z możliwością głosowania przez resztę grupy.

---

### US-03: Dodawanie nowego przepisu do bazy
**Powiązane wymaganie:** FR-03  
**Opis:** Jako użytkownik chcę stworzyć i opublikować własny przepis, aby rozbudować bazę dań dostępnych w aplikacji.  

* **Kryteria akceptacji (Acceptance Criteria):**
  * *Scenario 1: Tworzenie i upload nowego przepisu*
    * **Given** użytkownik otworzy formularz dodawania nowego przepisu,
    * **When** uzupełni nazwę przepisu, listę wymaganych składników oraz instrukcję przygotowania krok po kroku i kliknie „Opublikuj”,
    * **Then** nowy przepis staje się widoczny w bazie przepisów dla wszystkich domowników.

---

### US-04: Generowanie listy zakupów z brakujących składników
**Powiązane wymaganie:** FR-04  
**Opis:** Jako domownik chcę automatycznie przenieść brakujące składniki z wybranego przepisu na listę zakupów, aby wygodnie dokupić potrzebne produkty.  

* **Kryteria akceptacji (Acceptance Criteria):**
  * *Scenario 1: Przeniesienie brakujących produktów na listę*
    * **Given** użytkownik przegląda szczegóły przepisu „Makaron ze szpinakiem”, gdzie brakuje mu „Ser parmezan”,
    * **When** kliknie przycisk „Dodaj brakujące do zakupów”,
    * **Then** „Ser parmezan” zostaje automatycznie dodany do wspólnej listy zakupów w sekcji „Do kupienia”.

---

### US-05: Zarządzanie domownikami i kod zaproszenia
**Powiązane wymaganie:** FR-05  
**Opis:** Jako administrator gospodarstwa domowego chcę wygenerować kod zaproszenia, aby łatwo dodać współlokatorów do wspólnej przestrzeni.  

* **Kryteria akceptacji (Acceptance Criteria):**
  * *Scenario 1: Dołączenie nowego domownika przy użyciu kodu*
    * **Given** administrator wygenerował unikalny kod zaproszenia (np. `HUNGRY-482`),
    * **When** nowy użytkownik wpisze ten kod podczas konfiguracji profilu,
    * **Then** zostaje przypisany do danego gospodarstwa domowego i zyskuje dostęp do wspólnej lodówki oraz listy zakupów.
