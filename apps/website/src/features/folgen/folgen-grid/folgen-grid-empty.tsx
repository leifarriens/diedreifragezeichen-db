interface FolgenGridEmptyProps {
  description?: string;
  title: string;
}

export function FolgenGridEmpty({ description, title }: FolgenGridEmptyProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
      <p className="text-lg font-semibold">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      )}
    </section>
  );
}
