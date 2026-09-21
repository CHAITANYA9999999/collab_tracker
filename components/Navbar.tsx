"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat, LayoutGrid, Handshake, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/collabs", label: "Collabs", icon: Handshake },
];

export function Navbar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.assign("/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-terracotta-100/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-terracotta text-cream sm:h-9 sm:w-9">
            <ChefHat size={16} />
          </div>
          <span className="whitespace-nowrap font-display text-base font-semibold text-ink sm:text-lg">
            Collab Tracker
          </span>
        </div>

        <nav className="flex items-center gap-1 rounded-full border border-terracotta-100 bg-paper/70 p-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium transition sm:px-3.5 sm:text-sm",
                  active ? "bg-terracotta text-cream shadow-sm" : "text-ink-soft hover:bg-terracotta-100/60"
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-berry-100 hover:text-berry"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
