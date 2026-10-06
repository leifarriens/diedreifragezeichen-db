export function ExternalLink({
  "aria-label": ariaLabel,
  children,
  className,
  href,
  title,
}: {
  "aria-label"?: string;
  children: React.ReactNode;
  className?: string;
  href: string;
  title?: string;
}) {
  return (
    <a
      aria-label={ariaLabel}
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
