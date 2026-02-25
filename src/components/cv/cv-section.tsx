interface CVSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function CVSection({ title, children, className = "" }: CVSectionProps) {
  return (
    <section className={`pt-4 ${className}`} aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <h2
        id={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
        className="text-[10px] font-semibold tracking-widest uppercase text-[var(--cv-subtle)] mb-2 font-sans"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
