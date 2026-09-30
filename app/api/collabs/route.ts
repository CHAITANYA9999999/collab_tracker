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
    dueDate: body.dueDate ?? null,
    paymentAmount: body.collabType === "paid" ? body.paymentAmount ?? null : null,
    paymentReceived: body.collabType === "paid" ? body.paymentReceived ?? false : false,
    barterValue: body.collabType === "barter" ? body.barterValue ?? null : null,
    pocName: body.pocName ?? "",
    pocPhone: body.pocPhone ?? "",
    description: body.description ?? "",
    review: body.review ?? "",
    adRightsType: body.adRightsType ?? "none",
    adRightsDays: body.adRightsType === "limited" ? body.adRightsDays ?? null : null,
    mode: body.mode,
    visitingDate: body.mode === "online" ? null : body.visitingDate ?? null,
    platform: body.platform ?? "",
  };

  const repo = await getRepository();
  const collab = await repo.create(input);
  return NextResponse.json({ collab }, { status: 201 });
}
