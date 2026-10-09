import { LoadingIndicator } from "@/components/loading-indicator/loading-indicator";

export default function HomePageLoading() {
  return (
    <main className="grid place-items-center">
      <LoadingIndicator ariaLabel="Seite wird geladen" />
    </main>
  );
}
