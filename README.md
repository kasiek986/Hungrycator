# Hungrycator

Aplikacja do zarządzania wspólną wirtualną lodówką, produktami i listą zakupów.

## Prototyp interfejsu

Interaktywny prototyp aplikacji Hungrycator został przygotowany w Figmie.
https://www.figma.com/make/bJnYg7LzqwrnrGdigpZOia/Hungrycator-mobile-app-prototype?p=f&t=mJgvenoifXkB55Hy-0

## Technologie

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Kontrola jakości: ESLint
- Formatowanie kodu: Prettier

## Wymagania

- Node.js 24 lub nowszy
- npm

## Uruchomienie projektu

### Frontend

W osobnym terminalu:

bash
cd frontend
npm install
npm run dev

### Backend

W drugim terminalu:

bash
cd backend
npm install
npm run dev

Backend udostępnia testowy endpoint:

`http://localhost:3000/api/health`

### Formatowanie kodu

W głównym katalogu projektu:

bash
npm run format
npm run format:check
