import "@/components/v5/v5.css";
import {
  V5Header,
  V5Hero,
  V5Projects,
  V5Path,
  V5Contact,
  V5Footer,
  V5SectionBoundary,
} from "@/components/v5";

export default function Home() {
  return (
    <div className="v5">
      <a className="v5-skip" href="#work">
        Skip to work
      </a>
      <div className="v5-page">
        <V5SectionBoundary name="Header">
          <V5Header />
        </V5SectionBoundary>
        <V5SectionBoundary name="Hero">
          <V5Hero />
        </V5SectionBoundary>
        <V5SectionBoundary name="Projects">
          <V5Projects />
        </V5SectionBoundary>
        <V5SectionBoundary name="Path">
          <V5Path />
        </V5SectionBoundary>
        <V5SectionBoundary name="Contact">
          <V5Contact />
        </V5SectionBoundary>
        <V5Footer />
      </div>
    </div>
  );
}
