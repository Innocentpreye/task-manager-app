import { pgTable, serial, text, numeric, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull(), // 'income' | 'expense'
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, date: true }).extend({
  amount: z.string().or(z.number()), // allow string from form, will be coerced
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type TransactionResponse = Transaction;
export type TransactionsListResponse = Transaction[];
