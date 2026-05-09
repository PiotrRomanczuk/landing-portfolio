import { timeline } from "@/lib/data/timeline";

const meta: Record<string, string> = {
  "commercial-client": "Contract · Web",
  "production-app": "Solo · SaaS · Production",
  "realtime-viz": "Frontend · Realtime",
  "multiple-products": "Multiple · Production",
};

export function V5Path() {
  const chapters = [...timeline].reverse();

  return (
    <section className="v5-section" id="path" aria-labelledby="path-h">
      <header className="v5-section-head">
        <h2 id="path-h">Path, in chapters.</h2>
        <div className="right">2023 — present</div>
      </header>
      <div className="v5-path">
        <article className="v5-chapter">
          <div className="y">2026</div>
          <div>
            <h4>Open to senior fullstack</h4>
            <p>
              Looking for a team where I can own a product surface end-to-end
              and stay long enough to see what the launch turns into.
            </p>
            <div className="meta">Mid → Senior · Remote / Warsaw</div>
          </div>
        </article>
        {chapters.map((c) => (
          <article className="v5-chapter" key={c.id}>
            <div className="y">{c.period}</div>
            <div>
              <h4>{c.title}</h4>
              <p>{c.description}</p>
              <div className="meta">{meta[c.id] ?? c.tech.slice(0, 3).join(" · ")}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default V5Path;
