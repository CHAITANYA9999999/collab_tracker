import { getExpenseRepository } from "@/lib/expenseRepository";
import { Navbar } from "@/components/Navbar";
import { ExpensesClient } from "@/components/ExpensesClient";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const repo = await getExpenseRepository();
  const expenses = await repo.list();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="mb-1 font-display text-3xl font-semibold text-ink">Expenses</h1>
        <p className="mb-6 text-sm text-ink-soft">
          Track what you spend running this — travel, props, subscriptions — so your cash number stays honest.
        </p>
        <ExpensesClient initialExpenses={expenses} />
      </main>
    </div>
  );
}
