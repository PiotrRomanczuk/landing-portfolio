"use client";

export type FluencyRow = {
  name: string;
  startYear: number;
  endYear: number;
  use: "daily" | "weekly" | "occasional" | "past";
  group: "frontend" | "backend" | "infra" | "testing";
};

const NOW = new Date().getUTCFullYear();
const SPAN_START = NOW - 7;
const SPAN_END = NOW;

const USE_COLOR: Record<FluencyRow["use"], string> = {
  daily: "var(--accent)",
  weekly: "color-mix(in oklab, var(--accent) 70%, var(--muted))",
  occasional: "color-mix(in oklab, var(--accent) 35%, var(--muted))",
  past: "var(--faint)",
};

export function FluencyTimeline({ rows }: { rows: FluencyRow[] }) {
  const range = SPAN_END - SPAN_START;
  const years: number[] = [];
  for (let y = SPAN_START; y <= SPAN_END; y++) years.push(y);

  return (
    <div className="fluency">
      <div className="fluency-axis" aria-hidden>
        <span className="fluency-axis-label">stack · years shipped</span>
        <div className="fluency-ticks">
          {years.map((y) => (
            <span key={y} className="tick">
              <span className="tick-bar" />
              <span className="tick-lbl">&apos;{String(y).slice(-2)}</span>
            </span>
          ))}
        </div>
      </div>

      {rows.map((r) => {
        const left = ((r.startYear - SPAN_START) / range) * 100;
        const width = ((r.endYear - r.startYear) / range) * 100;
        const yrs = r.endYear - r.startYear;
        return (
          <div className="fluency-row" key={r.name} data-use={r.use} data-group={r.group}>
            <div className="fluency-name">
              <span>{r.name}</span>
              <span className="fluency-yrs">
                {yrs > 0 ? `${yrs} yr${yrs === 1 ? "" : "s"}` : "< 1 yr"}
              </span>
            </div>
            <div className="fluency-track">
              <span
                className="fluency-bar"
                style={{
                  left: `${left}%`,
                  width: `${Math.max(width, 1.5)}%`,
                  background: USE_COLOR[r.use],
                }}
                title={`${r.name} · ${r.startYear}–${r.endYear} · ${r.use}`}
              />
              {r.use !== "past" && r.endYear === NOW ? (
                <span className="fluency-tip" style={{ left: `calc(${left + width}% - 4px)` }} />
              ) : null}
            </div>
            <div className="fluency-use">{r.use}</div>
          </div>
        );
      })}

      <div className="fluency-legend">
        <span><i style={{ background: USE_COLOR.daily }} /> daily</span>
        <span><i style={{ background: USE_COLOR.weekly }} /> weekly</span>
        <span><i style={{ background: USE_COLOR.occasional }} /> occasional</span>
        <span><i style={{ background: USE_COLOR.past }} /> past</span>
      </div>
    </div>
  );
}
