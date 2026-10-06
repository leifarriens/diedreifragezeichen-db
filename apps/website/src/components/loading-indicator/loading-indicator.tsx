import styles from "./loading-indicator.module.css";

interface LoadingIndicatorProps {
  ariaLabel?: string;
}

export function LoadingIndicator({ ariaLabel }: LoadingIndicatorProps) {
  return (
    <div
      aria-busy="true"
      aria-label={ariaLabel}
      className="my-4 leading-0.5"
      role="status"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        // eslint-disable-next-line @eslint-react/no-array-index-key
        <span className={styles.icon} key={index}></span>
      ))}
    </div>
  );
}
