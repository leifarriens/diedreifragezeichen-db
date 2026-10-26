import { cn } from "tailwind-variants";

import { QSvg } from "@/components/icons/q";

import styles from "./loading-indicator.module.css";

interface LoadingIndicatorProps {
  ariaLabel?: string;
  className?: string;
  type?: "???" | "spinner";
}

export function LoadingIndicator({
  ariaLabel,
  className,
  type = "???",
}: LoadingIndicatorProps) {
  if (type === "spinner") {
    return (
      <div
        aria-busy="true"
        aria-label={ariaLabel}
        className={cn("flex w-full justify-center", className)}
        role="status"
      >
        <svg className="size-5 animate-spin" viewBox="0 0 100 100">
          <circle
            className="stroke-current opacity-40"
            cx="50"
            cy="50"
            fill="none"
            r="40"
            strokeWidth="10"
          />
          <circle
            className="stroke-current"
            cx="50"
            cy="50"
            fill="none"
            r="40"
            strokeDasharray="250"
            strokeDashoffset="210"
            strokeWidth="10"
          />
        </svg>
        <span className="sr-only">Laden...</span>
      </div>
    );
  }

  return (
    <div
      aria-busy="true"
      aria-label={ariaLabel}
      className="my-4 flex w-full justify-center leading-0.5"
      role="status"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <QSvg
          aria-hidden="true"
          className={styles.icon}
          color="white"
          // eslint-disable-next-line @eslint-react/no-array-index-key
          key={index}
        />
      ))}
      <span className="sr-only">Laden...</span>
    </div>
  );
}

export function PageLoadingIndicator({
  ariaLabel = "Seite wird geladen…",
}: {
  ariaLabel?: string;
}) {
  return (
    <div className="fixed inset-0 grid flex-1 place-items-center">
      <LoadingIndicator ariaLabel={ariaLabel} />
    </div>
  );
}
