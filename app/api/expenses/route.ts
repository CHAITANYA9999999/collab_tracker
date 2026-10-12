import { NextResponse } from "next/server";
import { getExpenseRepository } from "@/lib/expenseRepository";
import type { ExpenseInput } from "@/lib/types";

export async function GET() {
  const repo = await getExpenseRepository();
  const expenses = await repo.list();
  return NextResponse.json({ expenses });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ExpenseInput>;

  if (!body.description || body.amount === undefined || body.amount === null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const input: ExpenseInput = {
    description: body.description,
    amount: body.amount,
    expenseDate: body.expenseDate ?? null,
  };

  const repo = await getExpenseRepository();
  const expense = await repo.create(input);
  return NextResponse.json({ expense }, { status: 201 });
}
