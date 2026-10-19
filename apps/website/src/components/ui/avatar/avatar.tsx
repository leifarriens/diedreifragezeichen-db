import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { tv, type VariantProps } from "tailwind-variants";

const avatarVariants = tv({
  defaultVariants: {
    size: "default",
  },
  slots: {
    container:
      "flex items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white/20 align-middle leading-none font-normal text-white backdrop-blur-2xl select-none",
    fallback:
      "flex size-full items-center justify-center text-base font-medium",
  },
  variants: {
    size: {
      default: {
        container: "size-9 text-xs",
        fallback: "text-base font-medium",
      },
      large: {
        container: "size-12 md:size-20",
        fallback: "text-lg font-semibold md:text-3xl",
      },
    },
  },
});

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  name: null | string | undefined;
}

export function Avatar({ name, size }: AvatarProps) {
  const { container, fallback } = avatarVariants({ size });

  return (
    <AvatarPrimitive.Root className={container()}>
      <AvatarPrimitive.Fallback className={fallback()} delay={50}>
        {name?.trim().slice(0, 2).toUpperCase() ?? "?"}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
