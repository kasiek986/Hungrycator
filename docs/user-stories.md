# Historie Użytkownika – Hungrycator

---

### **S-01: Rejestracja produktów w wirtualnej lodówce** *(Wymaganie: FR-01)*

* **Historia:** Jako domownik chcę dodawać produkty do wirtualnej lodówki wraz z terminem ważności, aby kontrolować zapasy i wiedzieć, co zjeść w pierwszej kolejności.
* **Kryteria akceptacji:**
  * **Scenariusz 1: Dodanie produktu**
    * **Given:** otwarty formularz dodawania produktu,
    * **When:** wpiszę „Pomidory”, wybiorę kategorię „Warzywa”, ilość „4 szt.”, termin „Do 3 dni” i kliknę „Dodaj do lodówki”,
    * **Then:** produkt pojawi się w wirtualnej lodówce w sekcji „Zjedz mnie najpierw”.
  * **Scenariusz 2: Zmiana ilości lub usunięcie**
    * **Given:** produkt „Mleko” w ilości 2 szt. w lodówce,
    * **When:** kliknę przycisk zmniejszenia ilości („-”),
    * **Then:** ilość zmniejszy się do 1 szt. (a przy wartości 0 produkt zostanie usunięty z lodówki).

---

### **S-02: Proponowanie posiłku i głosowanie domowników** *(Wymaganie: FR-02)*

* **Historia:** Jako użytkownik chcę zaproponować danie na dzisiejszy posiłek i zebrać opinie domowników, aby wspólnie zdecydować, co dzisiaj jemy.
* **Kryteria akceptacji:**
  * **Scenariusz 1: Zgłoszenie propozycji i głosowanie**
    * **Given:** otwartą sekcję „Co dziś jemy?”,
    * **When:** wybiorę przepis „Makaron ze szpinakiem” jako propozycję na kolację,
    * **Then:** pozostali domownicy zobaczą propozycję i będą mogli kliknąć „Tak” lub „Nie”.
  * **Scenariusz 2: Własna propozycja spoza bazy**
    * **Given:** ochotę na danie, którego nie ma w bazie (np. „Kebab”),
    * **When:** wpiszę nazwę „Kebab” w polu propozycji dziennej i zatwierdzę,
    * **Then:** propozycja pojawi się na karcie dnia z możliwością głosowania.

---

### **S-03: Dodawanie nowego przepisu do bazy** *(Wymaganie: FR-03)*

* **Historia:** Jako użytkownik chcę stworzyć i opublikować własny przepis, aby rozbudować bazę dań dostępnych w aplikacji.
* **Kryteria akceptacji:**
  * **Scenariusz 1: Opublikowanie nowego przepisu**
    * **Given:** otwarty formularz dodawania nowego przepisu,
    * **When:** uzupełnię nazwę, listę składników, instrukcję krok po kroku i kliknę „Opublikuj”,
    * **Then:** nowy przepis stanie się widoczny w bazie dla wszystkich domowników.

---

### **S-04: Generowanie listy zakupów z brakujących składników** *(Wymaganie: FR-04)*

* **Historia:** Jako domownik chcę automatycznie przenieść brakujące składniki z wybranego przepisu na listę zakupów, aby wygodnie dokupić potrzebne produkty.
* **Kryteria akceptacji:**
  * **Scenariusz 1: Przeniesienie brakujących produktów**
    * **Given:** podgląd przepisu „Makaron ze szpinakiem”, w którym brakuje „Ser parmezan”,
    * **When:** kliknę przycisk „Dodaj brakujące do zakupów”,
    * **Then:** „Ser parmezan” zostanie automatycznie dodany do wspólnej listy zakupów.

---

### **S-05: Zarządzanie domownikami i kod zaproszenia** *(Wymaganie: FR-05)*

* **Historia:** Jako administrator gospodarstwa domowego chcę wygenerować kod zaproszenia, aby łatwo dodać współlokatorów do wspólnej grupy.
* **Kryteria akceptacji:**
  * **Scenariusz 1: Dołączenie nowego domownika**
    * **Given:** wygenerowany unikalny kod zaproszenia (np. "HUNGRY-123"),
    * **When:** nowy użytkownik wpisze ten kod podczas konfiguracji profilu,
    * **Then:** zostanie przypisany do danego gospodarstwa domowego i zyska dostęp do wspólnej lodówki oraz listy zakupów.
