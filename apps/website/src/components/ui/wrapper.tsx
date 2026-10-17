import { cn } from "tailwind-variants";

type WrapperProps = React.ComponentPropsWithoutRef<"div">;

export function Wrapper({ children, className, ...rest }: WrapperProps) {
  return (
    <div
      className={cn(
        "mx-auto flex flex-1 flex-col px-6 sm:px-8 lg:px-12 2xl:px-20",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
