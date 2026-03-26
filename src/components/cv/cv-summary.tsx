import { CVSection } from "./cv-section";

const defaultSummary =
  "Software engineer and guitar teacher based in Warsaw, Poland. Career spans international hospitality, e-commerce, and music education \u2014 bringing strong adaptability and people skills to every role. Now specializing in full-stack web development with TypeScript, React, Next.js, and Tailwind CSS, shipping production apps and commercial client projects.";

interface CVSummaryProps {
  summary?: string;
}

export function CVSummary({ summary }: CVSummaryProps) {
  return (
    <CVSection title="Summary">
      <p className="text-sm text-foreground leading-relaxed max-w-2xl">
        {summary || defaultSummary}
      </p>
    </CVSection>
  );
}
