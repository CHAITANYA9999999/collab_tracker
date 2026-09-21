"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ChefHat } from "lucide-react";

function LoginForm() {
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("That password didn't work. Try again.");
      return;
    }
    window.location.assign(params.get("next") || "/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="password"
        autoFocus
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full rounded-xl border border-terracotta-100 bg-cream px-4 py-3 text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta-100"
      />
      {error && <p className="text-sm text-berry">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-1 rounded-xl bg-terracotta px-4 py-3 font-medium text-cream transition hover:bg-terracotta-600 disabled:opacity-60"
      >
        {loading ? "Checking..." : "Log in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-terracotta-100 bg-paper p-8 shadow-[0_20px_60px_-20px_rgba(58,47,40,0.25)]">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta text-cream">
            <ChefHat size={28} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">Collab Tracker</h1>
          <p className="text-sm text-ink-soft">Enter your password to open the kitchen.</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
