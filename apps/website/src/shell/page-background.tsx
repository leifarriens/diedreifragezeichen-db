import { cn } from "tailwind-variants";

import { FolgenBackground } from "../features/folgen/folgen-images/folgen-artwork";

interface PageBackgroundProps {
  animate?: boolean;
  artwork: string;
  className?: string;
}

export function PageBackground({
  animate = true,
  artwork,
  className,
}: PageBackgroundProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 blur-[80px] brightness-40 duration-1000",
        {
          "sm:animate-breathe sm:motion-reduce:animate-none": animate,
        },
        className,
      )}
    >
      <FolgenBackground artwork={artwork} className="h-full w-full" />
    </div>
  );
}
