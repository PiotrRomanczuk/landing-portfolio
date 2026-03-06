export function V4SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-12">
      <div className="font-[family-name:var(--font-source-serif)] text-sm font-bold uppercase tracking-[3px] text-[var(--v4-navy)]">
        {title}
      </div>
      <div className="flex-1 h-px bg-[var(--border)] ml-6" />
    </div>
  );
}
