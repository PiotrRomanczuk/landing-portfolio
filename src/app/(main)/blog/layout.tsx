import "@/components/v5/v5.css";
import "@/components/v5/blog.css";
import { V5Header, V5Footer } from "@/components/v5";

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="v5">
      <a className="v5-skip" href="#main">
        Skip to content
      </a>
      <div className="v5-page">
        <V5Header />
        <main id="main">{children}</main>
        <V5Footer />
      </div>
    </div>
  );
}
