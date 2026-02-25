import { CVSection } from "./cv-section";

export function CVSummary() {
  return (
    <CVSection title="Summary">
      <p className="text-sm text-foreground leading-relaxed max-w-2xl">
        Software engineer and guitar teacher based in Warsaw, Poland. Career
        spans international hospitality, e-commerce, and music education —
        bringing strong adaptability and people skills to every role. Now
        specializing in full-stack web development with{" "}
        <span className="font-medium">TypeScript, React, Next.js</span>, and{" "}
        <span className="font-medium">Tailwind CSS</span>, shipping production
        apps and commercial client projects.
      </p>
    </CVSection>
  );
}
