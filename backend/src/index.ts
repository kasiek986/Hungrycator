import { createApp } from "./app.js";
import { seedFridge, seedHousehold, seedRecipes } from "./data/seed.js";
import { MealPlanStore } from "./store/mealPlanStore.js";

const PORT = 3000;

const store = new MealPlanStore({
  household: seedHousehold,
  recipes: seedRecipes,
  fridge: seedFridge,
});

createApp(store).listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
