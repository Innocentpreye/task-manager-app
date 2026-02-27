import { db } from "../server/db";
import { transactions } from "../shared/schema";

async function seed() {
  const existing = await db.select().from(transactions);
  if (existing.length === 0) {
    console.log("Seeding database...");
    await db.insert(transactions).values([
      { type: "income", amount: "5000", category: "Salary", description: "Monthly Salary", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { type: "expense", amount: "1200", category: "Rent", description: "Apartment Rent", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
      { type: "expense", amount: "150", category: "Utilities", description: "Electric Bill", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { type: "expense", amount: "400", category: "Food", description: "Groceries", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { type: "expense", amount: "50", category: "Transport", description: "Gas", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ]);
    console.log("Database seeded successfully.");
  } else {
    console.log("Database already seeded.");
  }
}

seed().catch(console.error).finally(() => process.exit(0));