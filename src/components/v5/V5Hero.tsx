export function V5Hero() {
  return (
    <section className="v5-hero" aria-label="Introduction">
      <div>
        <p className="display v5-reveal">
          Builds web software that <em>actually</em> ships,
          <br />
          <span className="light">then keeps it running.</span>
        </p>
        <p className="deck v5-reveal d1">
          A fullstack engineer between Next.js, .NET and the parts no one wants
          to own. Currently looking for a senior role where the work outlasts
          the launch.
        </p>
        <div className="v5-status-line v5-reveal d2">
          <span>
            <span className="v5-dot" />
            Available · Senior fullstack
          </span>
          <span className="sep">/</span>
          <span>Warsaw, PL</span>
          <span className="sep">/</span>
          <a href="#contact">Contact ↓</a>
        </div>
      </div>
      <aside className="rail v5-reveal d3" aria-label="Now">
        <div className="row">
          <b>Now</b>
          <span>Strummy v3 · billing</span>
        </div>
        <div className="row">
          <b>Stack</b>
          <span>Next 16 · TS · .NET 9</span>
        </div>
        <div className="row">
          <b>Shipped</b>
          <span>Strummy · IG Webhook</span>
        </div>
        <div className="row">
          <b>Reading</b>
          <span>Designing Data-Intensive…</span>
        </div>
      </aside>
    </section>
  );
}

export default V5Hero;
