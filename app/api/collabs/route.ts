import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";
import type { CollabInput } from "@/lib/types";

export async function GET() {
  const repo = await getRepository();
  const collabs = await repo.list();
  return NextResponse.json({ collabs });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<CollabInput>;

  if (!body.brandName || !body.collabType || !body.mode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const input: CollabInput = {
    brandName: body.brandName,
    collabType: body.collabType,
    expectedReels: body.expectedReels ?? 0,
    expectedStories: body.expectedStories ?? 0,
    expectedPosts: body.expectedPosts ?? 0,
    dueDate: body.dueDate ?? null,
    paymentAmount: body.paymentAmount ?? null,
    paymentReceived: body.paymentReceived ?? false,
    pocName: body.pocName ?? "",
    pocPhone: body.pocPhone ?? "",
    description: body.description ?? "",
    review: body.review ?? "",
    mode: body.mode,
    visitingDate: body.mode === "online" ? null : body.visitingDate ?? null,
    platform: body.platform ?? "",
  };

  const repo = await getRepository();
  const collab = await repo.create(input);
  return NextResponse.json({ collab }, { status: 201 });
}
