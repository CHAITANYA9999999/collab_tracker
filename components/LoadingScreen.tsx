"use client";

import { useEffect, useState } from "react";
import { ChefHat } from "lucide-react";

const phrases = [
  "Warming up the kitchen...",
  "Plating your collabs...",
  "Simmering the numbers...",
  "Garnishing the dashboard...",
];

export function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta-100 opacity-75" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-cream shadow-lg">
            <ChefHat size={30} className="animate-bounce" />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-terracotta [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-olive" />
        </div>

        <p className="font-display text-sm font-medium text-ink-soft">{phrases[index]}</p>
      </div>
    </div>
  );
}
