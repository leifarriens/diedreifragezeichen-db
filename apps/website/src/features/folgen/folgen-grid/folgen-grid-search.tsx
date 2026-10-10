interface FolgenGridSearchProps {
  onChange: (value: string) => void;
  value: string;
}

export function FolgenGridSearch({ onChange, value }: FolgenGridSearchProps) {
  return (
    <div>
      <input
        className="border p-2"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        type="search"
        value={value}
      />
    </div>
  );
}
