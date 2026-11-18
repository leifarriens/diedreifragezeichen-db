import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { useId } from "react";

type OTPFieldProps = OTPFieldPrimitive.Root.Props;

export function OTPField({ length, ...props }: OTPFieldProps) {
  const id = useId();
  const descriptionId = `${id}-description`;

  return (
    <div className="flex w-full flex-col items-center">
      <p
        className="mb-2 w-full text-center text-sm text-neutral-300"
        id={descriptionId}
      >
        Gib den {length.toString()}-stelligen Code ein, den wir an deine
        E-Mail-Adresse gesendet haben.
      </p>
      <OTPFieldPrimitive.Root
        aria-describedby={descriptionId}
        autoComplete="one-time-code"
        className="flex w-full justify-center gap-2"
        id={id}
        length={length}
        {...props}
      >
        {Array.from({ length }, (_, index) => (
          <OTPFieldPrimitive.Input
            aria-label={
              index === 0
                ? undefined
                : `Zeichen ${String(index + 1)} von ${length.toString()}`
            }
            className="font-inherit m-0 h-12 w-10 rounded-xl border border-neutral-100 bg-transparent text-center text-base font-normal text-neutral-100"
            data-bwignore="true"
            key={index}
          />
        ))}
      </OTPFieldPrimitive.Root>
    </div>
  );
}
