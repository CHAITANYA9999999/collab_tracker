"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Receipt } from "lucide-react";
import type { Expense } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export function ExpensesClient({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const total = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  async function handleAdd() {
    if (!description.trim() || !amount) return;
    setSaving(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          amount: Number(amount),
          expenseDate: expenseDate || null,
        }),
      });
      const { expense } = await res.json();
      setExpenses((prev) => [expense, ...prev]);
      setDescription("");
      setAmount("");
      setExpenseDate("");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <div className="mb-6 rounded-3xl border border-terracotta-100 bg-paper p-5 shadow-[0_12px_30px_-18px_rgba(58,47,40,0.25)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-berry text-cream">
            <Receipt size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-soft">Total expenses</p>
            <p className="font-display text-2xl font-semibold text-ink">{formatMoney(total)}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-terracotta-100 bg-paper p-4">
        <label className="flex min-w-[160px] flex-1 flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Ring light, cab to shoot..."
            className="h-11 rounded-xl border border-terracotta-100 bg-cream px-4 text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta-100"
          />
        </label>
        <label className="flex w-32 flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Amount (₹)</span>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-11 rounded-xl border border-terracotta-100 bg-cream px-4 text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta-100"
          />
        </label>
        <label className="flex w-40 flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Date</span>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="h-11 rounded-xl border border-terracotta-100 bg-cream px-4 text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta-100"
          />
        </label>
        <button
          onClick={handleAdd}
          disabled={saving || !description.trim() || !amount}
          className="flex h-11 items-center gap-1.5 rounded-xl bg-terracotta px-4 text-sm font-semibold text-cream transition hover:bg-terracotta-600 disabled:opacity-60"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-terracotta-100 bg-paper/60 py-16 text-center text-ink-soft">
          No expenses logged yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-terracotta-100 bg-paper shadow-[0_12px_30px_-18px_rgba(58,47,40,0.25)]">
          <div className="flex flex-col divide-y divide-terracotta-100/70">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div>
                  <p className="font-medium text-ink">{expense.description}</p>
                  <p className="text-xs text-ink-soft">
                    {expense.expenseDate
                      ? new Date(expense.expenseDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "No date"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-semibold text-berry">
                    -{formatMoney(expense.amount)}
                  </span>
                  {confirmingDeleteId === expense.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="rounded-full bg-berry px-3 py-1.5 text-xs font-semibold text-cream hover:bg-berry-600"
                      >
                        Yes, delete
                      </button>
                      <button
                        onClick={() => setConfirmingDeleteId(null)}
                        className="rounded-full px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-cream"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingDeleteId(expense.id)}
                      className="rounded-full p-2 text-ink-soft hover:bg-berry-100 hover:text-berry"
                      title="Delete expense"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
