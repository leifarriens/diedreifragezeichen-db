import { QSvg } from "@/components/icons/q";

import styles from "./loading-indicator.module.css";

interface LoadingIndicatorProps {
  ariaLabel?: string;
  type?: "???" | "spinner";
}

export function LoadingIndicator({
  ariaLabel,
  type = "???",
}: LoadingIndicatorProps) {
  if (type === "spinner") {
    return (
      <div aria-busy="true" aria-label={ariaLabel} role="status">
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
            stroke-dasharray="250"
            stroke-dashoffset="210"
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
      className="my-4 leading-0.5"
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
