import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";
import type { CollabUpdate } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patch = (await request.json()) as CollabUpdate;
  const repo = await getRepository();
  const collab = await repo.update(id, patch);
  return NextResponse.json({ collab });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = await getRepository();
  await repo.remove(id);
  return NextResponse.json({ ok: true });
}
