import { FolgenBackground } from "../features/folgen/folgen-images/folgen-artwork";

interface PageBackgroundProps {
  artwork: string;
}

export function PageBackground({ artwork }: PageBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 blur-[80px] brightness-40 duration-1000 sm:animate-breathe sm:motion-reduce:animate-none">
      <FolgenBackground artwork={artwork} className="h-full w-full" preload />
    </div>
  );
}
