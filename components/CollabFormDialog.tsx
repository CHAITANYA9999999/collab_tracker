"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { AdRightsType, Collab, CollabInput, CollabMode, CollabType } from "@/lib/types";

interface CollabFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CollabInput) => Promise<void>;
  initial?: Collab | null;
}

const empty: CollabInput = {
  brandName: "",
  collabType: "barter",
  expectedReels: 0,
  expectedStories: 0,
  dueDate: null,
  paymentAmount: null,
  paymentReceived: false,
  barterValue: null,
  pocName: "",
  pocPhone: "",
  description: "",
  review: "",
  adRightsType: "none",
  adRightsDays: null,
  mode: "offline",
  visitingDate: null,
  platform: "",
};

export function CollabFormDialog({ open, onClose, onSubmit, initial }: CollabFormDialogProps) {
  const [form, setForm] = useState<CollabInput>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              brandName: initial.brandName,
              collabType: initial.collabType,
              expectedReels: initial.expectedReels,
              expectedStories: initial.expectedStories,
              dueDate: initial.dueDate,
              paymentAmount: initial.paymentAmount,
              paymentReceived: initial.paymentReceived,
              barterValue: initial.barterValue ?? null,
              pocName: initial.pocName,
              pocPhone: initial.pocPhone,
              description: initial.description,
              review: initial.review ?? "",
              adRightsType: initial.adRightsType ?? "none",
              adRightsDays: initial.adRightsDays ?? null,
              mode: initial.mode,
              visitingDate: initial.visitingDate,
              platform: initial.platform,
            }
          : empty
      );
    }
  }, [open, initial]);

  if (!open) return null;

  function update<K extends keyof CollabInput>(key: K, value: CollabInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.brandName.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        visitingDate: form.mode === "online" ? null : form.visitingDate,
        adRightsDays: form.adRightsType === "limited" ? form.adRightsDays : null,
        paymentAmount: form.collabType === "paid" ? form.paymentAmount : null,
        paymentReceived: form.collabType === "paid" ? form.paymentReceived : false,
        barterValue: form.collabType === "barter" ? form.barterValue : null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-paper p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">
            {initial ? "Edit collab" : "New collab"}
          </h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-ink-soft hover:bg-terracotta-100">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Brand name" className="sm:col-span-2">
            <input
              value={form.brandName}
              onChange={(e) => update("brandName", e.target.value)}
              placeholder="e.g. The Spice Route"
              className="input"
            />
          </Field>

          <Field label="Type of collab">
            <select
              value={form.collabType}
              onChange={(e) => update("collabType", e.target.value as CollabType)}
              className="input"
            >
              <option value="barter">Barter</option>
              <option value="paid">Paid</option>
            </select>
          </Field>

          <Field label="Platform">
            <input
              value={form.platform}
              onChange={(e) => update("platform", e.target.value)}
              placeholder="Instagram, WhatsApp..."
              className="input"
            />
          </Field>

          <Field label="Expected reels">
            <input
              type="number"
              min={0}
              value={form.expectedReels}
              onChange={(e) => update("expectedReels", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Expected stories">
            <input
              type="number"
              min={0}
              value={form.expectedStories}
              onChange={(e) => update("expectedStories", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Due date">
            <input
              type="date"
              value={form.dueDate ?? ""}
              onChange={(e) => update("dueDate", e.target.value || null)}
              className="input"
            />
          </Field>

          <Field label="Ad rights">
            <select
              value={form.adRightsType}
              onChange={(e) => {
                const value = e.target.value as AdRightsType;
                update("adRightsType", value);
                if (value !== "limited") update("adRightsDays", null);
              }}
              className="input"
            >
              <option value="none">None</option>
              <option value="limited">Limited (days)</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </Field>
          {form.adRightsType === "limited" && (
            <Field label="Ad rights duration (days)">
              <input
                type="number"
                min={1}
                value={form.adRightsDays ?? ""}
                onChange={(e) => update("adRightsDays", e.target.value ? Number(e.target.value) : null)}
                placeholder="e.g. 30"
                className="input"
              />
            </Field>
          )}

          {form.collabType === "paid" && (
            <>
              <Field label="Payment amount (₹)">
                <input
                  type="number"
                  min={0}
                  value={form.paymentAmount ?? ""}
                  onChange={(e) => update("paymentAmount", e.target.value ? Number(e.target.value) : null)}
                  className="input"
                />
              </Field>
              <Field label="Payment received">
                <label className="flex h-11 items-center gap-2 rounded-xl border border-terracotta-100 bg-cream px-4">
                  <input
                    type="checkbox"
                    checked={form.paymentReceived}
                    onChange={(e) => update("paymentReceived", e.target.checked)}
                    className="h-4 w-4 accent-terracotta"
                  />
                  <span className="text-sm text-ink">Yes, received</span>
                </label>
              </Field>
            </>
          )}

          {form.collabType === "barter" && (
            <Field label="Estimated barter value (₹)">
              <input
                type="number"
                min={0}
                value={form.barterValue ?? ""}
                onChange={(e) => update("barterValue", e.target.value ? Number(e.target.value) : null)}
                placeholder="Value of food/products received"
                className="input"
              />
            </Field>
          )}

          <Field label="POC name">
            <input
              value={form.pocName}
              onChange={(e) => update("pocName", e.target.value)}
              placeholder="Contact person"
              className="input"
            />
          </Field>
          <Field label="POC phone">
            <input
              value={form.pocPhone}
              onChange={(e) => update("pocPhone", e.target.value)}
              placeholder="+91 ..."
              className="input"
            />
          </Field>

          <Field label="Mode">
            <select
              value={form.mode}
              onChange={(e) => update("mode", e.target.value as CollabMode)}
              className="input"
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </Field>
          <Field label="Visiting date">
            <input
              type="date"
              disabled={form.mode === "online"}
              value={form.visitingDate ?? ""}
              onChange={(e) => update("visitingDate", e.target.value || null)}
              className="input disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={form.mode === "online" ? "NA" : undefined}
            />
          </Field>

          <Field label="Description" className="sm:col-span-2">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              placeholder="Full brief, deliverables, notes..."
              className="input resize-none"
            />
          </Field>

          <Field label="Review" className="sm:col-span-2">
            <textarea
              value={form.review}
              onChange={(e) => update("review", e.target.value)}
              rows={3}
              placeholder="Your notes on how the collab went..."
              className="input resize-none"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-cream">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.brandName.trim()}
            className="rounded-xl bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-terracotta-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : initial ? "Save changes" : "Add collab"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          height: 2.75rem;
          border-radius: 0.75rem;
          border: 1px solid var(--color-terracotta-100);
          background-color: var(--color-cream);
          padding: 0 1rem;
          color: var(--color-ink);
          outline: none;
        }
        .input:focus {
          border-color: var(--color-terracotta);
          box-shadow: 0 0 0 3px var(--color-terracotta-100);
        }
        textarea.input {
          height: auto;
          padding: 0.65rem 1rem;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
