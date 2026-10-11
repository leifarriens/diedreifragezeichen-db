import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "tailwind-variants";

export interface InputProps extends InputPrimitive.Props {
  label?: string;
}

export function Input({ className, label, ...props }: InputProps) {
  return (
    <label className="flex flex-col items-start gap-1">
      <span className="text-sm font-bold text-neutral-300">{label}</span>

      <InputPrimitive
        className={cn(
          "rounded-xl border border-neutral-100 bg-transparent px-4 py-2 text-base text-neutral-300 placeholder-gray-500 outline-none any-pointer-coarse:text-base",
          className,
        )}
        {...props}
      />
    </label>
  );
}
