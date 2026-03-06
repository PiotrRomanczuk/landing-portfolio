import {
  V4Header,
  V4Hero,
  V4Projects,
  V4Timeline,
  V4Contact,
  V4Footer,
} from "@/components/v4";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-inter)] bg-[var(--background)] text-[var(--foreground)]">
      <V4Header />
      <V4Hero />
      <V4Projects />
      <V4Timeline />
      <V4Contact />
      <V4Footer />
    </div>
  );
}
