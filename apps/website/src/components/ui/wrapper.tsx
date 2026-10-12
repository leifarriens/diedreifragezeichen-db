import { cn } from "tailwind-variants";

type WrapperProps = React.ComponentPropsWithoutRef<"div">;

export function Wrapper({ children, className, ...rest }: WrapperProps) {
  return (
    <div
      className={cn("mx-auto flex-1 px-4 sm:px-6 xl:px-20", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
