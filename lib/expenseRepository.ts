import type { Expense, ExpenseInput } from "./types";

export interface ExpenseRepository {
  list(): Promise<Expense[]>;
  create(input: ExpenseInput): Promise<Expense>;
  update(id: string, patch: Partial<ExpenseInput>): Promise<Expense>;
  remove(id: string): Promise<void>;
}

function usingSupabase(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let cached: ExpenseRepository | null = null;

export async function getExpenseRepository(): Promise<ExpenseRepository> {
  if (cached) return cached;
  if (usingSupabase()) {
    const { SupabaseExpenseRepository } = await import("./expenseRepository.supabase");
    cached = new SupabaseExpenseRepository();
  } else {
    const { LocalJsonExpenseRepository } = await import("./expenseRepository.local");
    cached = new LocalJsonExpenseRepository();
  }
  return cached;
}
