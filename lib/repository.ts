import type { Collab, CollabInput, CollabUpdate } from "./types";

export interface CollabRepository {
  list(): Promise<Collab[]>;
  create(input: CollabInput): Promise<Collab>;
  update(id: string, patch: CollabUpdate): Promise<Collab>;
  remove(id: string): Promise<void>;
}

function usingSupabase(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let cached: CollabRepository | null = null;

export async function getRepository(): Promise<CollabRepository> {
  if (cached) return cached;
  if (usingSupabase()) {
    const { SupabaseRepository } = await import("./repository.supabase");
    cached = new SupabaseRepository();
  } else {
    const { LocalJsonRepository } = await import("./repository.local");
    cached = new LocalJsonRepository();
  }
  return cached;
}
