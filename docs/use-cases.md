# Przypadki użycia – Hungrycator

## 1. Cel

Celem aplikacji Hungrycator jest ułatwienie domownikom zarządzania wspólną wirtualną lodówką, planowania posiłków, korzystania z przepisów oraz tworzenia listy zakupów. Aplikacja ma pomagać w ograniczaniu marnowania żywności.

## 2. Aktorzy

- **Domownik** – użytkownik, który korzysta ze wspólnej lodówki, zarządza produktami, proponuje posiłki, głosuje, przegląda przepisy i korzysta z listy zakupów.
- **Administrator gospodarstwa domowego** – domownik, który dodatkowo może wygenerować kod zaproszenia i umożliwić innym osobom dołączenie do gospodarstwa domowego.

## 3. Przypadki użycia

### UC-01: Zarządzanie produktami w wirtualnej lodówce

**Powiązane wymaganie:** FR-01  
**Aktor:** Domownik

**Cel:** Umożliwienie kontrolowania produktów znajdujących się we wspólnej lodówce.

**Warunki wstępne:**
- Domownik ma dostęp do gospodarstwa domowego.

**Scenariusz podstawowy:**
1. Domownik otwiera wirtualną lodówkę.
2. Wybiera opcję dodania produktu.
3. Wprowadza nazwę, kategorię, ilość, jednostkę oraz termin ważności.
4. Zatwierdza dodanie produktu.
5. System zapisuje produkt i wyświetla go na liście.
6. System wyróżnia produkty, które należy zużyć w pierwszej kolejności.

**Scenariusze alternatywne:**
- Domownik zmienia ilość istniejącego produktu.
- Domownik usuwa produkt poprzez zmniejszenie jego ilości do zera.

**Warunek końcowy:** Lista produktów odzwierciedla wprowadzone zmiany.

### UC-02: Proponowanie posiłków i głosowanie

**Powiązane wymaganie:** FR-02  
**Aktorzy:** Domownik, pozostali domownicy

**Cel:** Umożliwienie wspólnego wyboru posiłku na dany dzień.

**Warunki wstępne:**
- Domownik ma dostęp do gospodarstwa domowego.

**Scenariusz podstawowy:**
1. Domownik otwiera sekcję „Co dziś jemy?”.
2. Wybiera przepis z bazy lub wpisuje własną propozycję.
3. Zatwierdza propozycję posiłku.
4. System wyświetla propozycję pozostałym domownikom.
5. Domownicy oddają głosy „Tak” lub „Nie”.
6. System prezentuje propozycję i zebrane głosy.

**Warunek końcowy:** Propozycja posiłku jest dostępna dla domowników wraz z oddanymi głosami.

### UC-03: Przeglądanie i dodawanie przepisów

**Powiązane wymaganie:** FR-03  
**Aktor:** Domownik

**Cel:** Umożliwienie korzystania z bazy przepisów i jej rozbudowywania.

**Warunki wstępne:**
- Domownik ma dostęp do aplikacji.

**Scenariusz podstawowy:**
1. Domownik otwiera bazę przepisów.
2. Przegląda dostępne przepisy lub filtruje wyniki.
3. Aby dodać własny przepis, otwiera formularz dodawania.
4. Wprowadza nazwę, składniki oraz instrukcję przygotowania.
5. Zatwierdza publikację.
6. System zapisuje przepis i udostępnia go domownikom.

**Warunek końcowy:** Domownik może przeglądać dostępne przepisy, w tym dodane własne przepisy.

### UC-04: Tworzenie listy zakupów z brakujących składników

**Powiązane wymaganie:** FR-04  
**Aktor:** Domownik

**Cel:** Ułatwienie zakupu składników potrzebnych do przygotowania wybranego przepisu.

**Warunki wstępne:**
- Domownik ma dostęp do gospodarstwa domowego.
- Dostępny jest przepis zawierający listę składników.

**Scenariusz podstawowy:**
1. Domownik otwiera wybrany przepis.
2. System porównuje wymagane składniki ze stanem wirtualnej lodówki.
3. System identyfikuje brakujące składniki.
4. Domownik wybiera opcję dodania brakujących składników do zakupów.
5. System dodaje brakujące produkty do wspólnej listy zakupów.

**Scenariusz alternatywny:**
- Domownik ręcznie oznacza zakupiony produkt na liście zakupów.

**Warunek końcowy:** Wspólna lista zakupów zawiera brakujące składniki lub odzwierciedla oznaczone zakupy.

### UC-05: Zarządzanie gospodarstwem domowym i zapraszanie domowników

**Powiązane wymaganie:** FR-05  
**Aktorzy:** Administrator gospodarstwa domowego, nowy domownik

**Cel:** Umożliwienie tworzenia wspólnego gospodarstwa domowego i przyznawania dostępu nowym osobom.

**Warunki wstępne:**
- Administrator ma dostęp do aplikacji.

**Scenariusz podstawowy:**
1. Administrator otwiera sekcję zarządzania gospodarstwem domowym.
2. Generuje unikalny kod zaproszenia.
3. Przekazuje kod nowemu domownikowi.
4. Nowy domownik wpisuje kod w aplikacji.
5. System weryfikuje kod i przypisuje użytkownika do gospodarstwa domowego.
6. Nowy domownik uzyskuje dostęp do wspólnej lodówki i listy zakupów.

**Scenariusz alternatywny:**
- Jeśli kod jest nieprawidłowy, system informuje użytkownika, że nie można dołączyć do gospodarstwa domowego.

**Warunek końcowy:** Uprawniony użytkownik zostaje przypisany do odpowiedniego gospodarstwa domowego.

## 4. Powiązanie przypadków użycia z wymaganiami

| Przypadek użycia | Wymaganie funkcjonalne | Historia użytkownika |
|---|---|---|
| UC-01 | FR-01 | S-01 |
| UC-02 | FR-02 | S-02 |
| UC-03 | FR-03 | S-03 |
| UC-04 | FR-04 | S-04 |
| UC-05 | FR-05 | S-05 |
