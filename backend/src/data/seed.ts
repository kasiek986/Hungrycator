import type { FridgeItem, Household, Recipe } from "../types.js";

// Dane startowe prototypu. Do czasu podłączenia bazy danych (NFR-05)
// stan aplikacji jest przechowywany w pamięci serwera.

export const seedHousehold: Household = {
  id: "zielona-24",
  name: "Zielona 24",
  members: [
    {
      id: "ania",
      firstName: "Ania",
      firstNameGenitive: "Ani",
      fullName: "Ania Kowalska",
      role: "admin",
      color: "#2f7d55",
    },
    {
      id: "marek",
      firstName: "Marek",
      firstNameGenitive: "Marka",
      fullName: "Marek Nowak",
      role: "member",
      color: "#5b7ba3",
    },
    {
      id: "ola",
      firstName: "Ola",
      firstNameGenitive: "Oli",
      fullName: "Ola Wiśniewska",
      role: "member",
      color: "#c27a4e",
    },
  ],
};

export const seedRecipes: Recipe[] = [
  {
    id: "makaron-ze-szpinakiem",
    name: "Makaron ze szpinakiem",
    description: "Kremowy, prosty i idealny na wspólną kolację.",
    prepTimeMinutes: 25,
    ingredients: [
      { name: "Makaron", amount: "1 opakowanie" },
      { name: "Jajka", amount: "2 sztuki" },
      { name: "Ser parmezan", amount: "50 g" },
    ],
  },
  {
    id: "kurczak-curry",
    name: "Kurczak curry z ryżem",
    description: "Rozgrzewające curry z jogurtem i pomidorami.",
    prepTimeMinutes: 40,
    ingredients: [
      { name: "Kurczak", amount: "1 opakowanie" },
      { name: "Jogurt naturalny", amount: "1 kubek" },
      { name: "Pomidory", amount: "2 sztuki" },
      { name: "Ryż", amount: "200 g" },
    ],
  },
  {
    id: "szakszuka",
    name: "Szakszuka",
    description: "Jajka w pikantnym sosie pomidorowym, podawane z pieczywem.",
    prepTimeMinutes: 20,
    ingredients: [
      { name: "Jajka", amount: "4 sztuki" },
      { name: "Pomidory", amount: "4 sztuki" },
      { name: "Pieczywo", amount: "4 kromki" },
    ],
  },
  {
    id: "omlet-ze-szpinakiem",
    name: "Omlet ze szpinakiem",
    description: "Szybkie śniadanie z tego, co jest w lodówce.",
    prepTimeMinutes: 10,
    ingredients: [
      { name: "Jajka", amount: "3 sztuki" },
      { name: "Szpinak", amount: "1 garść" },
    ],
  },
  {
    id: "salatka-grecka",
    name: "Sałatka grecka",
    description: "Lekka sałatka z pomidorami, ogórkiem i fetą.",
    prepTimeMinutes: 15,
    ingredients: [
      { name: "Pomidory", amount: "3 sztuki" },
      { name: "Ogórek", amount: "1 sztuka" },
      { name: "Ser feta", amount: "1 opakowanie" },
    ],
  },
];

export const seedFridge: FridgeItem[] = [
  { name: "Kurczak", quantity: 1, unit: "opak." },
  { name: "Jogurt naturalny", quantity: 2, unit: "szt." },
  { name: "Pomidory", quantity: 4, unit: "szt." },
  { name: "Jajka", quantity: 8, unit: "szt." },
  { name: "Makaron", quantity: 1, unit: "opak." },
  { name: "Szpinak", quantity: 1, unit: "opak." },
];
