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

## 4. Wymagania funkcjonalne (Functional Requirements)
* **FR-01 (Zarządzanie lodówką):** System umożliwia dodawanie i edycja produktów spożywczych wraz z kategorią, ilością, jednostką oraz terminem ważności ("do 3 dni", "do tygodnia").
* **FR-02 (Propozycje posiłków i głosowanie):** System umożliwia zgłoszenie propozycji posiłku na dany dzień oraz zbieranie głosów reakcji ("tak/nie") od pozostałych członków gospodarstwa domowego.
* **FR-03 (Baza i tworzenie przepisów):** System pozwala na przeglądanie bazy przepisów, ich filtrowanie, a także dodawanie nowych, autorskich przepisów wraz z wykazem potrzebnych składników.
* **FR-04 (Automatyczna lista zakupów):** System umożliwia tworzenie wspólnej listy zakupów oraz automatyczne przenoszenie brakujących składników z wybranego przepisu na listę do kupienia.
* **FR-05 (Zarządzanie gospodarstwem domowym):** System pozwala na tworzenie grupy gospodarstwa domowego oraz zapraszanie członków za pomocą unikalnego kodu zaproszenia.
