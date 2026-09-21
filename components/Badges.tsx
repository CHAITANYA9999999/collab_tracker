import { cn } from "@/lib/utils";
import type { CollabType, CollabMode } from "@/lib/types";
import { Gift, Wallet, Wifi, MapPin } from "lucide-react";

export function TypeBadge({ type }: { type: CollabType }) {
  const isPaid = type === "paid";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        isPaid ? "bg-olive-100 text-olive-600" : "bg-gold-100 text-terracotta-600"
      )}
    >
      {isPaid ? <Wallet size={12} /> : <Gift size={12} />}
      {isPaid ? "Paid" : "Barter"}
    </span>
  );
}

export function ModeBadge({ mode }: { mode: CollabMode }) {
  const isOnline = mode === "online";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        isOnline ? "bg-berry-100 text-berry" : "bg-terracotta-100 text-terracotta-600"
      )}
    >
      {isOnline ? <Wifi size={12} /> : <MapPin size={12} />}
      {isOnline ? "Online" : "Offline"}
    </span>
  );
}

export function DueBadge({ dueDate, completed }: { dueDate: string | null; completed: boolean }) {
  if (!dueDate) {
    return <span className="text-xs font-medium text-ink-soft">No due date</span>;
  }
  const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86_400_000);
  let tone = "bg-olive-100 text-olive-600";
  let label = new Date(dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  if (!completed) {
    if (days < 0) {
      tone = "bg-berry-100 text-berry";
      label = `Overdue · ${label}`;
    } else if (days <= 3) {
      tone = "bg-gold-100 text-terracotta-600";
      label = `Due soon · ${label}`;
    }
  }
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tone)}>{label}</span>;
}
