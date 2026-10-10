import { cn } from "tailwind-variants";

type WrapperProps = React.ComponentPropsWithoutRef<"div">;

export function Wrapper({ children, className, ...rest }: WrapperProps) {
  return (
    <div
      className={cn(
        "mx-auto flex-1 self-center px-4 sm:px-10 xl:px-20",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
