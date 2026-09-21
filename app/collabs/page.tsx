import { getRepository } from "@/lib/repository";
import { Navbar } from "@/components/Navbar";
import { CollabsClient } from "@/components/CollabsClient";

export const dynamic = "force-dynamic";

export default async function CollabsPage() {
  const repo = await getRepository();
  const collabs = await repo.list();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-1 font-display text-3xl font-semibold text-ink">Collabs</h1>
        <p className="mb-6 text-sm text-ink-soft">Track every brand deal from pitch to payout.</p>
        <CollabsClient initialCollabs={collabs} />
      </main>
    </div>
  );
}
