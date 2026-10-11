import { Input } from "@/components/ui/input/input";

interface FolgenGridSearchProps {
  onChange: (value: string) => void;
  value: string;
}

export function FolgenGridSearch({ onChange, value }: FolgenGridSearchProps) {
  return (
    <div>
      <Input
        className="w-72"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder="Folgen durchsuchen"
        type="search"
        value={value}
      />
    </div>
  );
}
