# Specyfikacja Projektu – Hungrycator 

## 1. Cel aplikacji
Aplikacja webowa **Hungrycator** ma na celu ułatwienie domownikom wspólnego planowania posiłków, zarządzania zapasami w domowej lodówce oraz ograniczenie marnowania żywności. Aplikacja pozwala śledzić terminy ważności produktów, proponować oraz głosować na posiłki na dany dzień, wyszukiwać i dodawać nowe przepisy do bazy oraz automatycznie tworzyć wspólną listę zakupów dla brakujących składników.

## 2. Użytkownicy docelowi
* **Gospodarstwa domowe i współlokatorzy** – osoby dzielące kuchnię i wspólne zapasy produktów.
* **Osoby prywatne / studenci** – szukający pomysłów na szybkie posiłki z wykorzystaniem posiadanych składników i chcący uniknąć marnowania żywności.

## 3. Zakres funkcjonalności
* **Wirtualna lodówka:** Wprowadzanie składników, przydzielanie kategorii, ilości oraz estymowanego terminu ważności (np. "zjedz wkrótce").
* **Wspólne gospodarstwo domowe:** Dołączanie członków rodziny/współlokatorów za pomocą kodu zaproszenia.
* **Głosowanie i propozycje posiłków:** Proponowanie dań z bazy lub własnych pomysłów oraz głosowanie przez domowników ("Tak" / "Nie").
* **Katalog i dodawanie przepisów:** Wyszukiwanie gotowych przepisów oraz ręczne wprowadzanie własnych dań (nazwa, składniki, instrukcje).
* **Wspólna lista zakupów:** Automatyczne oraz ręczne dodawanie brakujących produktów z możliwością oznaczania kupionych rzeczy.

## 4. Wymagania funkcjonalne (Functional Requirements)
* **FR-01 (Zarządzanie lodówką):** System umożliwia rejestrowanie posiadanych produktów spożywczych wraz z kategorią, ilością, jednostką oraz terminem ważności ("do 3 dni", "do tygodnia", "ponad tydzień").
* **FR-02 (Propozycje posiłków i głosowanie):** System umożliwia zgłoszenie propozycji posiłku na dany dzień oraz zbieranie głosów reakcji ("tak/nie") od pozostałych członków gospodarstwa domowego.
* **FR-03 (Baza i tworzenie przepisów):** System pozwala na przeglądanie bazy przepisów, ich filtrowanie, a także dodawanie nowych, autorskich przepisów wraz z wykazem potrzebnych składników.
* **FR-04 (Automatyczna lista zakupów):** System umożliwia tworzenie wspólnej listy zakupów oraz automatyczne przenoszenie brakujących składników z wybranego przepisu na listę do kupienia.
* **FR-05 (Zarządzanie gospodarstwem domowym):** System pozwala na tworzenie grupy gospodarstwa domowego oraz zapraszanie członków za pomocą unikalnego kodu zaproszenia.
