import type { ReactNode } from "react";

import { Input } from "@/components/ui/input/input";

interface UserCollectionSearchProps {
  onSearchTermChange: (value: string) => void;
  searchPlaceholder: string;
  searchTerm: string;
  /**
   * Sort options differ depending on the type of collection.
   */
  sortOptions: ReactNode;
}

export function UserCollectionSearch({
  onSearchTermChange,
  searchPlaceholder,
  searchTerm,
  sortOptions,
}: UserCollectionSearchProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:place-items-end">
      <div className="self-stretch lg:justify-self-start">
        <Input
          className="w-full lg:w-80"
          onChange={(e) => {
            onSearchTermChange(e.target.value);
          }}
          placeholder={searchPlaceholder}
          type="search"
          value={searchTerm}
        />
      </div>

      {sortOptions}
    </div>
  );
}
