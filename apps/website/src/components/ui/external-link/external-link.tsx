export function ExternalLink({
  ariaLabel: ariaLabel,
  children,
  className,
  href,
  title,
}: {
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
  href: string;
  title?: string;
}) {
  return (
    <a
      aria-label={`${ariaLabel} (externer Link)`}
      className={className}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title={title}
    >
      {children}
    </a>
  );
}
