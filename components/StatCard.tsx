import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "terracotta" | "olive" | "gold" | "berry";
  className?: string;
}

const tones = {
  terracotta: "bg-terracotta text-cream",
  olive: "bg-olive text-cream",
  gold: "bg-gold text-ink",
  berry: "bg-berry text-cream",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "terracotta", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "card-texture relative overflow-hidden rounded-3xl border border-terracotta-100 bg-paper p-5 shadow-[0_12px_30px_-18px_rgba(58,47,40,0.25)]",
        className
      )}
    >
      <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-2xl", tones[tone])}>
        <Icon size={18} />
      </div>
      <p className="text-sm font-medium text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
