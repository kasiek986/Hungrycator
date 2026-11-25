# Scenariusze użytkownika – Hungrycator

## 1. Cel dokumentu

Celem dokumentu jest przedstawienie scenariuszy użytkownika opisujących sposób korzystania z wybranych funkcjonalności aplikacji Hungrycator.

Scenariusze przedstawiają działania użytkownika, reakcje systemu oraz możliwe rezultaty wykonanych czynności.

Opracowane scenariusze dotyczą funkcji proponowania posiłków i głosowania domowników, która została opisana w dokumentacji projektu jako historia użytkownika S-02.

## 2. Aktorzy

W scenariuszach występują następujący aktorzy:

- **Domownik** – osoba korzystająca z aplikacji Hungrycator, która może dodawać propozycje posiłków i oddawać głosy.
- **Pozostali domownicy** – inni członkowie gospodarstwa domowego, którzy mogą przeglądać propozycje i uczestniczyć w głosowaniu.
- **System Hungrycator** – aplikacja odpowiedzialna za zapisywanie propozycji, głosów i aktualizowanie widoku.

---

# 3. Scenariusz 1 – Wybór przepisu z bazy i dodanie propozycji posiłku

### Cel scenariusza

Dodanie propozycji posiłku poprzez wybranie przepisu dostępnego w bazie aplikacji.

### Aktor główny

Domownik.

### Warunki początkowe

- Użytkownik ma otwartą aplikację Hungrycator.
- Użytkownik ma dostęp do zakładki Posiłki.
- Baza aplikacji zawiera dostępne przepisy.

### Przebieg podstawowy

1. Użytkownik przechodzi do zakładki Posiłki.
2. Otwiera ekran „Co dziś jemy?”.
3. Wybiera rodzaj posiłku: śniadanie, obiad lub kolację.
4. Klika pole propozycji.
5. System wyświetla dostępne przepisy z bazy.
6. Użytkownik wybiera interesujący go przepis, np. „Makaron ze szpinakiem”.
7. Użytkownik zatwierdza wybór.
8. System dodaje propozycję do wybranego posiłku.
9. Pozostali domownicy mogą zobaczyć dodaną propozycję i oddać na nią głos.

### Scenariusz alternatywny

Jeżeli użytkownik nie znajdzie odpowiedniego przepisu, może skorzystać z własnej propozycji i wpisać nazwę dania, którego nie ma w bazie.

### Rezultat końcowy

Propozycja posiłku zostaje dodana i jest widoczna dla pozostałych domowników.

---

# 4. Scenariusz 2 – Dodanie własnej propozycji posiłku

### Cel scenariusza

Dodanie propozycji dania, którego nie ma w bazie przepisów aplikacji.

### Aktor główny

Domownik.

### Warunki początkowe

- Użytkownik znajduje się w zakładce Posiłki.
- Użytkownik ma otwarty ekran „Co dziś jemy?”.

### Przebieg podstawowy

1. Użytkownik wybiera rodzaj posiłku.
2. Klika pole propozycji.
3. Zamiast wybierać przepis z bazy, wpisuje własną nazwę dania, np. „Kebab”.
4. Użytkownik zatwierdza wpisaną propozycję.
5. System zapisuje nową propozycję.
6. Propozycja pojawia się na karcie danego posiłku.
7. Pozostali domownicy mogą zobaczyć propozycję i oddać na nią głos.

### Scenariusz alternatywny

Jeżeli użytkownik zdecyduje się na wybór przepisu dostępnego w bazie, może wrócić do listy przepisów i wybrać jedną z dostępnych pozycji.

### Rezultat końcowy

Własna propozycja zostaje dodana do listy propozycji posiłków i udostępniona pozostałym domownikom.

---

# 5. Scenariusz 3 – Głosowanie na zaproponowany posiłek

### Cel scenariusza

Umożliwienie domownikom wyrażenia opinii na temat zaproponowanego posiłku.

### Aktor główny

Domownik.

### Aktorzy dodatkowi

Pozostali domownicy.

### Warunki początkowe

- W aplikacji znajduje się przynajmniej jedna propozycja posiłku.
- Domownicy mają dostęp do wspólnego gospodarstwa.

### Przebieg podstawowy

1. Użytkownik przechodzi do zakładki Posiłki.
2. Otwiera ekran „Co dziś jemy?”.
3. Wybiera odpowiedni rodzaj posiłku.
4. Przegląda dostępne propozycje.
5. Wybiera danie, na które chce zagłosować.
6. Oddaje głos, wybierając jedną z opcji: „Tak”, „Może” lub „Nie”.
7. System zapisuje oddany głos.
8. Pozostali domownicy również oddają swoje głosy.
9. System aktualizuje widok, prezentując aktualny stan głosowania.

### Scenariusze alternatywne

- Użytkownik może wybrać odpowiedź „Może”, jeśli nie jest zdecydowany.
- Użytkownik może wybrać odpowiedź „Nie”, jeśli nie chce danego posiłku.
- Jeżeli pozostali domownicy jeszcze nie zagłosowali, głosowanie pozostaje w toku.

### Rezultat końcowy

Głosy zostają zapisane, a po oddaniu głosów przez wszystkich domowników system kończy głosowanie.

Danie zostaje zaakceptowane, jeżeli liczba głosów „Tak” jest większa niż liczba głosów „Nie”.

---

# 6. Powiązanie scenariuszy z Personami

| Scenariusz | Persona | Główny cel |
|---|---|---|
| Wybór przepisu z bazy | Anna Kowalska | Zaproponowanie posiłku domownikom |
| Dodanie własnej propozycji | Anna Kowalska | Dodanie własnego pomysłu na posiłek |
| Głosowanie na posiłek | Marek Nowak | Wyrażenie opinii i uczestnictwo we wspólnej decyzji |

---

# 7. Podsumowanie

Przygotowane scenariusze przedstawiają najważniejsze działania użytkowników związane z funkcją proponowania posiłków i głosowania w aplikacji Hungrycator.

Pokazują one zarówno sposób dodawania propozycji z bazy przepisów, jak i możliwość wpisania własnego dania oraz uczestniczenia w głosowaniu.

Scenariusze stanowią podstawę do opracowania diagramów User Flows, które przedstawiają poszczególne ścieżki użytkownika, decyzje oraz możliwe rezultaty interakcji z aplikacją.
