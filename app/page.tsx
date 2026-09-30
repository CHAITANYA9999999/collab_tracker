import Link from "next/link";
import {
  Wallet,
  Banknote,
  Gift,
  Handshake,
  CheckCircle2,
  CalendarClock,
  AlertTriangle,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { getRepository } from "@/lib/repository";
import { dueWithinDays, monthlySeries, overdueCollabs, totalBarterValue, totalEarned, typeSplit } from "@/lib/stats";
import { formatMoney } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { TrendChart } from "@/components/TrendChart";
import { TypeSplitChart } from "@/components/TypeSplitChart";
import { DueBadge, TypeBadge } from "@/components/Badges";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const repo = await getRepository();
  const collabs = await repo.list();

  const active = collabs.filter((c) => !c.completed);
  const completed = collabs.filter((c) => c.completed);
  const dueSoon = dueWithinDays(collabs, 7);
  const overdue = overdueCollabs(collabs);
  const cashEarned = totalEarned(collabs);
  const barterValue = totalBarterValue(collabs);
  const trend = monthlySeries(collabs);
  const split = typeSplit(collabs);
  const upcoming = [...active]
    .filter((c) => c.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">Your kitchen, at a glance</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {active.length} active collab{active.length === 1 ? "" : "s"} on the stove right now.
            </p>
          </div>
          <Link
            href="/collabs"
            className="flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:bg-terracotta-600"
          >
            <Plus size={16} />
            New collab
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total value (cash + barter)"
            value={formatMoney(cashEarned + barterValue)}
            icon={Wallet}
            tone="terracotta"
            hint="Cash received + estimated barter value"
          />
          <StatCard label="Active collabs" value={String(active.length)} icon={Handshake} tone="gold" hint="In progress right now" />
          <StatCard label="Completed" value={String(completed.length)} icon={CheckCircle2} tone="olive" hint="Wrapped up all-time" />
          <StatCard label="Due within 7 days" value={String(dueSoon.length)} icon={CalendarClock} tone="berry" hint="Keep an eye on these" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Cash earned" value={formatMoney(cashEarned)} icon={Banknote} tone="olive" hint="From paid collabs, received" />
          <StatCard label="Barter value" value={formatMoney(barterValue)} icon={Gift} tone="gold" hint="Estimated value of food/products" />
          <StatCard
            label="Overdue deliverables"
            value={String(overdue.length)}
            icon={AlertTriangle}
            tone="berry"
            hint={overdue.length > 0 ? "Past due date, not yet completed" : "Nothing overdue"}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-terracotta-100 bg-paper p-5 shadow-[0_12px_30px_-18px_rgba(58,47,40,0.25)] lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Collabs & earnings over time</h2>
            </div>
            <TrendChart data={trend} />
          </div>

          <div className="rounded-3xl border border-terracotta-100 bg-paper p-5 shadow-[0_12px_30px_-18px_rgba(58,47,40,0.25)]">
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Barter vs Paid</h2>
            <TypeSplitChart data={split} />
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-terracotta-100 bg-paper p-5 shadow-[0_12px_30px_-18px_rgba(58,47,40,0.25)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Coming up next</h2>
            <Link href="/collabs" className="flex items-center gap-1 text-sm font-medium text-terracotta hover:underline">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-soft">Nothing due yet. Add a collab to get started.</p>
          ) : (
            <div className="flex flex-col divide-y divide-terracotta-100/70">
              {upcoming.map((c) => (
                <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-medium text-ink">{c.brandName}</p>
                    <p className="text-xs text-ink-soft">{c.platform || "No platform set"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TypeBadge type={c.collabType} />
                    <DueBadge dueDate={c.dueDate} completed={c.completed} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
