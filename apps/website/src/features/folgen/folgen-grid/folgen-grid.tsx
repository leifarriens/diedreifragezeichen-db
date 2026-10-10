import styles from "./folgen-grid.module.css";

interface FolgenGridProps {
  children: React.ReactNode;
}

export function FolgenGrid({ children }: FolgenGridProps) {
  return <div className={styles.grid}>{children}</div>;
}
