"use client";

import { useState } from "react";
import { Film, Camera, FileText, Phone, Calendar, ChevronDown, Pencil, Trash2, Check, type LucideIcon } from "lucide-react";
import type { Collab } from "@/lib/types";
import { TypeBadge, ModeBadge, DueBadge } from "./Badges";
import { formatMoney, cn } from "@/lib/utils";

type Deliverable = "reelsDone" | "storiesDone" | "postsDone";

interface CollabCardProps {
  collab: Collab;
  onToggleComplete: (id: string, completed: boolean) => void;
  onTogglePayment: (id: string, received: boolean) => void;
  onToggleDeliverable: (id: string, field: Deliverable, value: boolean) => void;
  onEdit: (collab: Collab) => void;
  onDelete: (id: string) => void;
}

export function CollabCard({
  collab,
  onToggleComplete,
  onTogglePayment,
  onToggleDeliverable,
  onEdit,
  onDelete,
}: CollabCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="card-texture flex flex-col gap-3 rounded-3xl border border-terracotta-100 bg-paper p-5 shadow-[0_12px_30px_-18px_rgba(58,47,40,0.25)] transition hover:shadow-[0_16px_36px_-16px_rgba(58,47,40,0.3)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">{collab.brandName}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <TypeBadge type={collab.collabType} />
            <ModeBadge mode={collab.mode} />
            {collab.platform && (
              <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-ink-soft">
                {collab.platform}
              </span>
            )}
          </div>
        </div>

        <label
          className="group flex shrink-0 flex-col items-center gap-1"
          title={collab.completed ? "Mark as not completed" : "Mark as completed"}
        >
          <input
            type="checkbox"
            checked={collab.completed}
            onChange={(e) => onToggleComplete(collab.id, e.target.checked)}
            className="peer sr-only"
          />
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-olive/40 text-transparent transition peer-checked:border-olive peer-checked:bg-olive peer-checked:text-cream cursor-pointer">
            <Check size={16} strokeWidth={3} />
          </span>
          <span className="text-[10px] font-medium text-ink-soft">Done</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-medium">
        <DeliverableChip
          icon={Film}
          label={`${collab.expectedReels} reels`}
          done={collab.reelsDone}
          onClick={() => onToggleDeliverable(collab.id, "reelsDone", !collab.reelsDone)}
        />
        <DeliverableChip
          icon={Camera}
          label={`${collab.expectedStories} stories`}
          done={collab.storiesDone}
          onClick={() => onToggleDeliverable(collab.id, "storiesDone", !collab.storiesDone)}
        />
        <DeliverableChip
          icon={FileText}
          label={`${collab.expectedPosts} posts`}
          done={collab.postsDone}
          onClick={() => onToggleDeliverable(collab.id, "postsDone", !collab.postsDone)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DueBadge dueDate={collab.dueDate} completed={collab.completed} />
        <span className="flex items-center gap-1 text-xs text-ink-soft">
          <Calendar size={12} />
          Visit: {collab.mode === "online" ? "NA" : collab.visitingDate ? new Date(collab.visitingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Not set"}
        </span>
      </div>

      {(collab.pocName || collab.pocPhone) && (
        <div className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2 text-sm text-ink">
          <Phone size={14} className="text-terracotta" />
          <span className="font-medium">{collab.pocName || "POC"}</span>
          {collab.pocPhone && (
            <a href={`tel:${collab.pocPhone}`} className="ml-auto text-terracotta hover:underline">
              {collab.pocPhone}
            </a>
          )}
        </div>
      )}

      {collab.collabType === "paid" && (
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={collab.paymentReceived}
            onChange={(e) => onTogglePayment(collab.id, e.target.checked)}
            className="h-4 w-4 accent-terracotta"
          />
          Payment received{collab.paymentAmount ? ` — ${formatMoney(collab.paymentAmount)}` : ""}
        </label>
      )}

      {(collab.description || collab.review) && (
        <div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-terracotta hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
            <ChevronDown size={13} className={`transition ${expanded ? "rotate-180" : ""}`} />
          </button>
          {expanded && (
            <div className="mt-2 flex flex-col gap-2">
              {collab.description && (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{collab.description}</p>
              )}
              {collab.review && (
                <p className="whitespace-pre-wrap rounded-xl bg-cream px-3 py-2 text-sm leading-relaxed text-ink-soft">
                  <span className="font-semibold text-ink">Review: </span>
                  {collab.review}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-1 flex justify-end gap-1 border-t border-terracotta-100/70 pt-3">
        <button
          onClick={() => onEdit(collab)}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-cream"
        >
          <Pencil size={12} /> Edit
        </button>
        {confirmingDelete ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-ink-soft">Sure?</span>
            <button
              onClick={() => onDelete(collab.id)}
              className="rounded-full bg-berry px-3 py-1.5 text-xs font-semibold text-cream hover:bg-berry-600"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-cream"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-berry hover:bg-berry-100"
          >
            <Trash2 size={12} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

function DeliverableChip({
  icon: Icon,
  label,
  done,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={done ? "Mark as not delivered" : "Mark as delivered"}
      className={cn(
        "flex items-center gap-1 rounded-full px-2.5 py-1 transition",
        done ? "bg-olive-100 text-olive-600" : "bg-berry-100 text-berry"
      )}
    >
      <Icon size={12} /> {label}
    </button>
  );
}
