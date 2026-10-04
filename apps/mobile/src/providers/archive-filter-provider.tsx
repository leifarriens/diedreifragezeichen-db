import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  use,
  useCallback,
  useMemo,
  useState,
} from "react";

export interface ArchiveFilters {
  endDate: null | string;
  showSpecials: boolean;
  startDate: null | string;
}

interface ArchiveFilterContextValue {
  filters: ArchiveFilters;
  resetFilters: () => void;
  setFilters: Dispatch<SetStateAction<ArchiveFilters>>;
}

const ArchiveFilterContext = createContext<ArchiveFilterContextValue | null>(
  null,
);

const initialFilters: ArchiveFilters = {
  endDate: null,
  showSpecials: false,
  startDate: null,
};

export function ArchiveFilterProvider({ children }: PropsWithChildren) {
  const [filters, setFilters] = useState<ArchiveFilters>(initialFilters);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const value = useMemo(
    () => ({ filters, resetFilters, setFilters }),
    [filters, resetFilters],
  );

  return <ArchiveFilterContext value={value}>{children}</ArchiveFilterContext>;
}

export function useArchiveFilters() {
  const context = use(ArchiveFilterContext);

  if (!context) {
    throw new Error(
      "useArchiveFilters must be used within an ArchiveFilterProvider",
    );
  }

  return context;
}
