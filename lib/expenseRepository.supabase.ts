import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Expense, ExpenseInput } from "./types";
import type { ExpenseRepository } from "./expenseRepository";

type Row = {
  id: string;
  description: string;
  amount: number;
  expense_date: string | null;
  created_at: string;
  updated_at: string;
};

function toExpense(row: Row): Expense {
  return {
    id: row.id,
    description: row.description,
    amount: row.amount,
    expenseDate: row.expense_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(input: Partial<ExpenseInput>) {
  const row: Record<string, unknown> = {};
  if (input.description !== undefined) row.description = input.description;
  if (input.amount !== undefined) row.amount = input.amount;
  if (input.expenseDate !== undefined) row.expense_date = input.expenseDate;
  return row;
}

export class SupabaseExpenseRepository implements ExpenseRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      { auth: { persistSession: false } }
    );
  }

  async list(): Promise<Expense[]> {
    const { data, error } = await this.client
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data as Row[]).map(toExpense);
  }

  async create(input: ExpenseInput): Promise<Expense> {
    const { data, error } = await this.client
      .from("expenses")
      .insert(toRow(input))
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return toExpense(data as Row);
  }

  async update(id: string, patch: Partial<ExpenseInput>): Promise<Expense> {
    const row = toRow(patch);
    row.updated_at = new Date().toISOString();
    const { data, error } = await this.client
      .from("expenses")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return toExpense(data as Row);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.client.from("expenses").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}
