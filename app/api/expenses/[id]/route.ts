import { NextResponse } from "next/server";
import { getExpenseRepository } from "@/lib/expenseRepository";
import type { ExpenseInput } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patch = (await request.json()) as Partial<ExpenseInput>;
  const repo = await getExpenseRepository();
  const expense = await repo.update(id, patch);
  return NextResponse.json({ expense });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = await getExpenseRepository();
  await repo.remove(id);
  return NextResponse.json({ ok: true });
}
