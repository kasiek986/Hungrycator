import { createApp } from "./app.js";
import { HOUSEHOLD_ID, openDatabase } from "./db/database.js";
import { FridgeStore } from "./store/fridgeStore.js";
import { MealPlanStore } from "./store/mealPlanStore.js";

const PORT = 3000;

// Dane są zapisywane w pliku bazy SQLite (domyślnie backend/data/hungrycator.db,
// inną ścieżkę można podać w zmiennej DB_PATH), więc nie znikają po restarcie.
const db = openDatabase();

// Jedna wspólna lodówka: korzysta z niej ekran lodówki (S-01)
// i przepisy, które sprawdzają dostępne składniki (S-02).
const fridge = new FridgeStore(db, HOUSEHOLD_ID);
const store = new MealPlanStore({ db, householdId: HOUSEHOLD_ID, fridge });

createApp(store, fridge).listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
