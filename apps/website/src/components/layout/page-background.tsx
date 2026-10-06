interface PageBackgroundProps {
  artwork: string;
}

export function PageBackground({ artwork }: PageBackgroundProps) {
  return (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat blur-[100px] brightness-50 duration-1000 sm:animate-breathe sm:motion-reduce:animate-none"
      style={{ backgroundImage: `url(${artwork})` }}
    />
  );
}
