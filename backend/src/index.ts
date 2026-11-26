import { createApp } from "./app.js";
import { seedFridge, seedHousehold, seedRecipes } from "./data/seed.js";
import { FridgeStore } from "./store/fridgeStore.js";
import { MealPlanStore } from "./store/mealPlanStore.js";

const PORT = 3000;

// Jedna wspólna lodówka: korzysta z niej ekran lodówki (S-01)
// i przepisy, które sprawdzają dostępne składniki (S-02).
const fridge = new FridgeStore(seedFridge);
const store = new MealPlanStore({
  household: seedHousehold,
  recipes: seedRecipes,
  fridge,
});

createApp(store, fridge).listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
