import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";

export default function HomePageLoading() {
  return (
    <main className="pointer-events-none fixed inset-0 grid place-items-center">
      <PageLoadingIndicator />
    </main>
  );
}
