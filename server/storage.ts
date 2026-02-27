import { db } from "./db";
import {
  transactions,
  type InsertTransaction,
  type TransactionResponse
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTransactions(): Promise<TransactionResponse[]>;
  createTransaction(transaction: InsertTransaction): Promise<TransactionResponse>;
  deleteTransaction(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTransactions(): Promise<TransactionResponse[]> {
    return await db.select().from(transactions);
  }

  async createTransaction(transaction: InsertTransaction): Promise<TransactionResponse> {
    const [created] = await db.insert(transactions).values({
      ...transaction,
      amount: transaction.amount.toString(),
    }).returning();
    return created;
  }

  async deleteTransaction(id: number): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  }
}

export const storage = new DatabaseStorage();
