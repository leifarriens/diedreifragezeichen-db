import { FolgenBackground } from "../folgen-images/folgen-artwork";

interface PageBackgroundProps {
  artwork: string;
}

export function PageBackground({ artwork }: PageBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 blur-[100px] brightness-30 duration-1000 sm:animate-breathe sm:motion-reduce:animate-none">
      <FolgenBackground artwork={artwork} className="h-full w-full" preload />
    </div>
  );
}
