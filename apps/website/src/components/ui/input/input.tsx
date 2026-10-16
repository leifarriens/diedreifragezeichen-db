import { Input as InputPrimitive } from "@base-ui/react/input";
import { useId } from "react";
import { cn } from "tailwind-variants";

export interface InputProps extends InputPrimitive.Props {
  label?: string;
}

export function Input({ className, label, ...props }: InputProps) {
  const id = useId();

  return (
    <div className="flex flex-col items-start gap-3">
      {label && (
        <label className="text-sm font-medium text-neutral-300" htmlFor={id}>
          {label}
        </label>
      )}

      <InputPrimitive
        className={cn(
          "rounded-lg border border-neutral-400 bg-transparent px-4 py-2 text-base text-neutral-300 placeholder-gray-500 outline-none focus:border-neutral-200 any-pointer-coarse:text-base",
          className,
        )}
        id={id}
        {...props}
      />
    </div>
  );
}
