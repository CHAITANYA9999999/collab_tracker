import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Collab, CollabInput, CollabUpdate } from "./types";
import type { CollabRepository } from "./repository";

type Row = {
  id: string;
  brand_name: string;
  collab_type: string;
  expected_reels: number;
  expected_stories: number;
  expected_posts: number;
  reels_done: boolean;
  stories_done: boolean;
  posts_done: boolean;
  due_date: string | null;
  payment_amount: number | null;
  payment_received: boolean;
  completed: boolean;
  completed_at: string | null;
  poc_name: string;
  poc_phone: string;
  description: string;
  review: string;
  ad_rights_type: string;
  ad_rights_days: number | null;
  mode: string;
  visiting_date: string | null;
  platform: string;
  created_at: string;
  updated_at: string;
};

function toCollab(row: Row): Collab {
  return {
    id: row.id,
    brandName: row.brand_name,
    collabType: row.collab_type as Collab["collabType"],
    expectedReels: row.expected_reels,
    expectedStories: row.expected_stories,
    expectedPosts: row.expected_posts,
    reelsDone: row.reels_done,
    storiesDone: row.stories_done,
    postsDone: row.posts_done,
    dueDate: row.due_date,
    paymentAmount: row.payment_amount,
    paymentReceived: row.payment_received,
    completed: row.completed,
    completedAt: row.completed_at,
    pocName: row.poc_name,
    pocPhone: row.poc_phone,
    description: row.description,
    review: row.review,
    adRightsType: row.ad_rights_type as Collab["adRightsType"],
    adRightsDays: row.ad_rights_days,
    mode: row.mode as Collab["mode"],
    visitingDate: row.visiting_date,
    platform: row.platform,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(
  input: Partial<CollabInput & { completed: boolean; completedAt: string | null; reelsDone: boolean; storiesDone: boolean; postsDone: boolean }>
) {
  const row: Record<string, unknown> = {};
  if (input.brandName !== undefined) row.brand_name = input.brandName;
  if (input.collabType !== undefined) row.collab_type = input.collabType;
  if (input.expectedReels !== undefined) row.expected_reels = input.expectedReels;
  if (input.expectedStories !== undefined) row.expected_stories = input.expectedStories;
  if (input.expectedPosts !== undefined) row.expected_posts = input.expectedPosts;
  if (input.reelsDone !== undefined) row.reels_done = input.reelsDone;
  if (input.storiesDone !== undefined) row.stories_done = input.storiesDone;
  if (input.postsDone !== undefined) row.posts_done = input.postsDone;
  if (input.dueDate !== undefined) row.due_date = input.dueDate;
  if (input.paymentAmount !== undefined) row.payment_amount = input.paymentAmount;
  if (input.paymentReceived !== undefined) row.payment_received = input.paymentReceived;
  if (input.completed !== undefined) row.completed = input.completed;
  if (input.completedAt !== undefined) row.completed_at = input.completedAt;
  if (input.pocName !== undefined) row.poc_name = input.pocName;
  if (input.pocPhone !== undefined) row.poc_phone = input.pocPhone;
  if (input.description !== undefined) row.description = input.description;
  if (input.review !== undefined) row.review = input.review;
  if (input.adRightsType !== undefined) row.ad_rights_type = input.adRightsType;
  if (input.adRightsDays !== undefined) row.ad_rights_days = input.adRightsDays;
  if (input.mode !== undefined) row.mode = input.mode;
  if (input.visitingDate !== undefined) row.visiting_date = input.visitingDate;
  if (input.platform !== undefined) row.platform = input.platform;
  return row;
}

export class SupabaseRepository implements CollabRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      { auth: { persistSession: false } }
    );
  }

  async list(): Promise<Collab[]> {
    const { data, error } = await this.client
      .from("collabs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data as Row[]).map(toCollab);
  }

  async create(input: CollabInput): Promise<Collab> {
    const { data, error } = await this.client
      .from("collabs")
      .insert(toRow(input))
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return toCollab(data as Row);
  }

  async update(id: string, patch: CollabUpdate): Promise<Collab> {
    const row = toRow(patch);
    row.updated_at = new Date().toISOString();
    const { data, error } = await this.client
      .from("collabs")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return toCollab(data as Row);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.client.from("collabs").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}
