"use client";

import { useMemo, useState } from "react";
import { Plus, Search, ArrowUpDown } from "lucide-react";
import type { Collab, CollabInput, CollabType, CollabMode } from "@/lib/types";
import { CollabCard } from "./CollabCard";
import { CollabFormDialog } from "./CollabFormDialog";

type SortKey = "dueDate" | "visitingDate" | "brandName" | "createdAt";
type TypeFilter = "all" | CollabType;
type ModeFilter = "all" | CollabMode;

export function CollabsClient({ initialCollabs }: { initialCollabs: Collab[] }) {
  const [collabs, setCollabs] = useState<Collab[]>(initialCollabs);
  const [tab, setTab] = useState<"active" | "past">("active");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Collab | null>(null);

  const filtered = useMemo(() => {
    let list = collabs.filter((c) => (tab === "active" ? !c.completed : c.completed));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => c.brandName.toLowerCase().includes(q));
    }
    if (typeFilter !== "all") list = list.filter((c) => c.collabType === typeFilter);
    if (modeFilter !== "all") list = list.filter((c) => c.mode === modeFilter);

    const dir = sortDir === "asc" ? 1 : -1;
    list = [...list].sort((a, b) => {
      if (sortKey === "brandName") return a.brandName.localeCompare(b.brandName) * dir;
      if (sortKey === "createdAt") {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
      }
      const aVal = sortKey === "dueDate" ? a.dueDate : a.visitingDate;
      const bVal = sortKey === "dueDate" ? b.dueDate : b.visitingDate;
      if (!aVal && !bVal) return 0;
      if (!aVal) return 1;
      if (!bVal) return -1;
      return (new Date(aVal).getTime() - new Date(bVal).getTime()) * dir;
    });
    return list;
  }, [collabs, tab, search, typeFilter, modeFilter, sortKey, sortDir]);

  async function handleCreate(input: CollabInput) {
    const res = await fetch("/api/collabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const { collab } = await res.json();
    setCollabs((prev) => [collab, ...prev]);
  }

  async function handleUpdate(id: string, input: CollabInput) {
    const res = await fetch(`/api/collabs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const { collab } = await res.json();
    setCollabs((prev) => prev.map((c) => (c.id === id ? collab : c)));
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setCollabs((prev) => prev.map((c) => (c.id === id ? { ...c, ...body } : c)));
    await fetch(`/api/collabs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async function handleDelete(id: string) {
    setCollabs((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/collabs/${id}`, { method: "DELETE" });
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(collab: Collab) {
    setEditing(collab);
    setDialogOpen(true);
  }

  const activeCount = collabs.filter((c) => !c.completed).length;
  const pastCount = collabs.filter((c) => c.completed).length;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-terracotta-100 bg-paper p-1">
          <button
            onClick={() => setTab("active")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === "active" ? "bg-terracotta text-cream" : "text-ink-soft hover:bg-cream"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setTab("past")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === "past" ? "bg-olive text-cream" : "text-ink-soft hover:bg-cream"
            }`}
          >
            Past collabs ({pastCount})
          </button>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream shadow-sm transition hover:bg-terracotta-600"
        >
          <Plus size={16} /> New collab
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-terracotta-100 bg-paper p-3">
        <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl bg-cream px-3 py-2">
          <Search size={15} className="text-ink-soft" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          className="rounded-xl bg-cream px-3 py-2 text-sm text-ink outline-none"
        >
          <option value="all">All types</option>
          <option value="barter">Barter</option>
          <option value="paid">Paid</option>
        </select>

        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value as ModeFilter)}
          className="rounded-xl bg-cream px-3 py-2 text-sm text-ink outline-none"
        >
          <option value="all">All modes</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="rounded-xl bg-cream px-3 py-2 text-sm text-ink outline-none"
        >
          <option value="dueDate">Sort: Due date</option>
          <option value="visitingDate">Sort: Visiting date</option>
          <option value="brandName">Sort: Brand name</option>
          <option value="createdAt">Sort: Date added</option>
        </select>

        <button
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="flex items-center gap-1 rounded-xl bg-cream px-3 py-2 text-sm font-medium text-ink-soft hover:bg-terracotta-100"
          title="Toggle sort direction"
        >
          <ArrowUpDown size={14} />
          {sortDir === "asc" ? "Asc" : "Desc"}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-terracotta-100 bg-paper/60 py-16 text-center text-ink-soft">
          {tab === "active" ? "No active collabs match your filters." : "No past collabs yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((collab) => (
            <CollabCard
              key={collab.id}
              collab={collab}
              onToggleComplete={(id, completed) => patch(id, { completed })}
              onTogglePayment={(id, received) => patch(id, { paymentReceived: received })}
              onToggleDeliverable={(id, field, value) => patch(id, { [field]: value })}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CollabFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={editing}
        onSubmit={(input) => (editing ? handleUpdate(editing.id, input) : handleCreate(input))}
      />
    </div>
  );
}
