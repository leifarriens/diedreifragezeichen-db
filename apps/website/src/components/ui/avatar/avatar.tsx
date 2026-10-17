import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { tv, type VariantProps } from "tailwind-variants";

const avatarVariants = tv({
  slots: {
    container:
      "flex size-10 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white/20 align-middle text-sm leading-none font-normal text-white backdrop-blur-2xl select-none",
    fallback:
      "flex size-full items-center justify-center text-base font-medium",
  },
  variants: {
    size: {
      default: {
        container: "size-10",
        fallback: "text-base font-medium",
      },
      large: {
        container: "size-20",
        fallback: "text-3xl font-semibold",
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
