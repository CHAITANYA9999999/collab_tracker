export type CollabType = "barter" | "paid";
export type CollabMode = "online" | "offline";

export interface Collab {
  id: string;
  brandName: string;
  collabType: CollabType;
  expectedReels: number;
  expectedStories: number;
  expectedPosts: number;
  reelsDone: boolean;
  storiesDone: boolean;
  postsDone: boolean;
  dueDate: string | null; // ISO date
  paymentAmount: number | null;
  paymentReceived: boolean;
  completed: boolean;
  completedAt: string | null;
  pocName: string;
  pocPhone: string;
  description: string;
  review: string;
  mode: CollabMode;
  visitingDate: string | null; // ISO date, null when mode is "online"
  platform: string;
  createdAt: string;
  updatedAt: string;
}

export type CollabInput = Omit<
  Collab,
  "id" | "createdAt" | "updatedAt" | "completed" | "completedAt" | "reelsDone" | "storiesDone" | "postsDone"
>;

export type CollabUpdate = Partial<CollabInput> & {
  completed?: boolean;
  reelsDone?: boolean;
  storiesDone?: boolean;
  postsDone?: boolean;
};
