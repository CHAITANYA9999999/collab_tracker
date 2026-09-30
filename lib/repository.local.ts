import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { Collab, CollabInput, CollabUpdate } from "./types";
import type { CollabRepository } from "./repository";

// Dev-only fallback store, used when Supabase env vars are not configured.
// Lets the app run and be tested locally before a real database is wired up.
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "collabs.json");

async function readAll(): Promise<Collab[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Collab[];
  } catch {
    return [];
  }
}

async function writeAll(collabs: Collab[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(collabs, null, 2), "utf-8");
}

export class LocalJsonRepository implements CollabRepository {
  async list(): Promise<Collab[]> {
    return readAll();
  }

  async create(input: CollabInput): Promise<Collab> {
    const all = await readAll();
    const now = new Date().toISOString();
    const collab: Collab = {
      ...input,
      id: crypto.randomUUID(),
      reelsDone: false,
      storiesDone: false,
      completed: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(collab);
    await writeAll(all);
    return collab;
  }

  async update(id: string, patch: CollabUpdate): Promise<Collab> {
    const all = await readAll();
    const index = all.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Collab not found");
    const updated: Collab = {
      ...all[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    if (patch.completed === true && !all[index].completed) {
      updated.completedAt = new Date().toISOString();
    }
    if (patch.completed === false) {
      updated.completedAt = null;
    }
    all[index] = updated;
    await writeAll(all);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const all = await readAll();
    await writeAll(all.filter((c) => c.id !== id));
  }
}
