import {
  V4Header,
  V4Hero,
  V4Projects,
  V4Timeline,
  V4Contact,
  V4Footer,
} from "@/components/v4";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-inter)] bg-[var(--background)] text-[var(--foreground)]">
      <V4Header />
      <ErrorBoundary>
        <V4Hero />
      </ErrorBoundary>
      <ErrorBoundary>
        <V4Projects />
      </ErrorBoundary>
      <ErrorBoundary>
        <V4Timeline />
      </ErrorBoundary>
      <ErrorBoundary>
        <V4Contact />
      </ErrorBoundary>
      <V4Footer />
    </div>
  );
}
