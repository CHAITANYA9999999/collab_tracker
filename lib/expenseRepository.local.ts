import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { Expense, ExpenseInput } from "./types";
import type { ExpenseRepository } from "./expenseRepository";

// Dev-only fallback store, used when Supabase env vars are not configured.
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "expenses.json");

async function readAll(): Promise<Expense[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

async function writeAll(expenses: Expense[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2), "utf-8");
}

export class LocalJsonExpenseRepository implements ExpenseRepository {
  async list(): Promise<Expense[]> {
    return readAll();
  }

  async create(input: ExpenseInput): Promise<Expense> {
    const all = await readAll();
    const now = new Date().toISOString();
    const expense: Expense = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(expense);
    await writeAll(all);
    return expense;
  }

  async update(id: string, patch: Partial<ExpenseInput>): Promise<Expense> {
    const all = await readAll();
    const index = all.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Expense not found");
    const updated: Expense = { ...all[index], ...patch, updatedAt: new Date().toISOString() };
    all[index] = updated;
    await writeAll(all);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const all = await readAll();
    await writeAll(all.filter((e) => e.id !== id));
  }
}
