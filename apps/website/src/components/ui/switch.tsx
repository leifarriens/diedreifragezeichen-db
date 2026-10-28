import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({
  checked,
  defaultChecked,
  label,
  onCheckedChange,
}: SwitchProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-200">
      <SwitchPrimitive.Root
        checked={checked}
        className="flex h-6 w-11 shrink-0 rounded-xl bg-white/20 p-0.5 transition-colors duration-150 ease-[ease] data-checked:bg-sky-500"
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
      >
        <SwitchPrimitive.Thumb className="size-5 rounded-full bg-white transition-[translate,background-color] duration-150 ease-[ease] data-checked:translate-x-5 data-checked:bg-white" />
      </SwitchPrimitive.Root>
      {label}
    </label>
  );
}
