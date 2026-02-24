import type { TimelineMilestone } from "@/types";

interface TimelineItemProps {
  milestone: TimelineMilestone;
}

export function TimelineItem({ milestone }: TimelineItemProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-12">
      <div className="shrink-0 text-left md:w-32 md:text-right">
        <span className="font-mono text-lg font-bold text-primary">
          {milestone.year}
        </span>
      </div>
      <div className="flex-1 border-b border-border/50 pb-8">
        <p className="text-muted-foreground">{milestone.description}</p>
      </div>
    </div>
  );
}
