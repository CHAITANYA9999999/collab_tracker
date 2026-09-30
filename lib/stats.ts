import type { Collab } from "./types";

export function totalEarned(collabs: Collab[]): number {
  return collabs
    .filter((c) => c.collabType === "paid" && c.paymentReceived)
    .reduce((sum, c) => sum + (c.paymentAmount ?? 0), 0);
}

export function totalBarterValue(collabs: Collab[]): number {
  return collabs
    .filter((c) => c.collabType === "barter")
    .reduce((sum, c) => sum + (c.barterValue ?? 0), 0);
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
    const key = `${created.getFullYear()}-${created.getMonth()}`;
    const bucket = byKey.get(key);
    if (!bucket) continue;
    bucket.collabs += 1;
    if (c.collabType === "paid" && c.paymentReceived) {
      bucket.earnings += c.paymentAmount ?? 0;
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
