export type CollabType = "barter" | "paid";
export type CollabMode = "online" | "offline";
export type AdRightsType = "none" | "limited" | "lifetime";

export interface Collab {
  id: string;
  brandName: string;
  collabType: CollabType;
  expectedReels: number;
  expectedStories: number;
  reelsDone: boolean;
  storiesDone: boolean;
  dueDate: string | null; // ISO date
  paymentAmount: number | null;
  paymentReceived: boolean;
  barterValue: number | null; // estimated ₹ value of barter perks received
  completed: boolean;
  completedAt: string | null;
  pocName: string;
  pocPhone: string;
  description: string;
  review: string;
  adRightsType: AdRightsType;
  adRightsDays: number | null; // used only when adRightsType is "limited"
  mode: CollabMode;
  visitingDate: string | null; // ISO date, null when mode is "online"
  platform: string;
  createdAt: string;
  updatedAt: string;
}

export type CollabInput = Omit<
  Collab,
  "id" | "createdAt" | "updatedAt" | "completed" | "completedAt" | "reelsDone" | "storiesDone"
>;

export type CollabUpdate = Partial<CollabInput> & {
  completed?: boolean;
  reelsDone?: boolean;
  storiesDone?: boolean;
};
