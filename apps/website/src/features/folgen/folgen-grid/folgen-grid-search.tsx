import { Input } from "@/components/ui/input/input";

interface FolgenGridSearchProps {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

export function FolgenGridSearch({
  onChange,
  placeholder,
  value,
}: FolgenGridSearchProps) {
  return (
    <div>
      <Input
        className="w-80"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </div>
  );
}
