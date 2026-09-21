import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

export function formatMoney(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return `${currencySymbol}0`;
  return `${currencySymbol}${amount.toLocaleString("en-IN")}`;
}
