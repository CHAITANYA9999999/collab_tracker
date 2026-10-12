import type { Collab, Expense } from "./types";

export function totalEarned(collabs: Collab[]): number {
  return collabs
    .filter((c) => c.collabType === "paid" && c.paymentReceived)
    .reduce((sum, c) => sum + (c.paymentAmount ?? 0), 0);
}

export function totalBarterValue(collabs: Collab[]): number {
  // Perk/barter value can be logged on any collab, paid or barter, so it's
  // not filtered by collabType — it represents extras received on top of cash.
  return collabs.reduce((sum, c) => sum + (c.barterValue ?? 0), 0);
}

export function totalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function dueWithinDays(collabs: Collab[], days: number): Collab[] {
  const cutoff = Date.now() + days * 86_400_000;
  return collabs.filter(
    (c) => !c.completed && c.dueDate && new Date(c.dueDate).getTime() <= cutoff
  );
}

export function overdueCollabs(collabs: Collab[]): Collab[] {
  const now = Date.now();
  return collabs.filter((c) => !c.completed && c.dueDate && new Date(c.dueDate).getTime() < now);
}

export function monthlySeries(collabs: Collab[], months = 6) {
  const now = new Date();
  const buckets: { key: string; label: string; collabs: number; earnings: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      collabs: 0,
      earnings: 0,
    });
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]));

  for (const c of collabs) {
    const created = new Date(c.createdAt);
    const addedKey = `${created.getFullYear()}-${created.getMonth()}`;
    const addedBucket = byKey.get(addedKey);
    if (addedBucket) addedBucket.collabs += 1;

    // Earnings land in the month the collab was closed out, not when it was
    // added — a collab added in September but completed in October counts
    // as October's earnings.
    if (c.collabType === "paid" && c.paymentReceived && c.completed && c.completedAt) {
      const closed = new Date(c.completedAt);
      const closedKey = `${closed.getFullYear()}-${closed.getMonth()}`;
      const closedBucket = byKey.get(closedKey);
      if (closedBucket) closedBucket.earnings += c.paymentAmount ?? 0;
    }
  }

  return buckets;
}

export function typeSplit(collabs: Collab[]) {
  const barter = collabs.filter((c) => c.collabType === "barter").length;
  const paid = collabs.filter((c) => c.collabType === "paid").length;
  return [
    { name: "Barter", value: barter },
    { name: "Paid", value: paid },
  ];
}
