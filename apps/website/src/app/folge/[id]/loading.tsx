import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";

export default function FolgePageLoading() {
  // Keep an in-flow scroll target; the fixed loader alone appears visible
  // to Next.js even when the previous page was scrolled far down.
  return (
    <main className="min-h-dvh">
      <PageLoadingIndicator />
    </main>
  );
}
