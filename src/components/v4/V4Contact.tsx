import { personalInfo } from "@/lib/data/personal";
import { V4ContactForm } from "./V4ContactForm";

export function V4Contact() {
  return (
    <section className="max-w-[1100px] mx-auto px-8 pt-16 pb-20" id="contact">
      <div className="bg-gradient-to-br from-white to-[var(--v4-light-blue)] border border-[var(--v4-light-blue-border)] rounded-[28px] p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start relative overflow-hidden">
        {/* Decorative radial */}
        <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(27,46,92,0.04)_0%,transparent_70%)] pointer-events-none" />

        {/* Left: heading + links */}
        <div>
          <div className="text-xs font-semibold text-[var(--v4-navy)] tracking-[2px] uppercase mb-5">
            Say Hello
          </div>
          <h2 className="font-[family-name:var(--font-source-serif)] text-[clamp(32px,4vw,44px)] font-black leading-[1.1] tracking-[-2px] mb-6 text-[#1A1A1A]">
            Let&apos;s create<br />
            something<br />
            <span className="bg-gradient-to-br from-[var(--v4-navy)] to-[var(--v4-blue)] bg-clip-text text-transparent">
              remarkable.
            </span>
          </h2>
          <p className="text-base leading-[1.7] text-[#888] max-w-[420px] mb-8">
            I&apos;m always open to discussing product design work or partnership opportunities.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-3 text-[#1A1A1A] text-sm no-underline"
            >
              <div className="w-9 h-9 rounded-[10px] bg-[var(--v4-light-blue)] border border-[var(--v4-light-blue-border)] flex items-center justify-center text-[var(--v4-navy)] text-sm flex-shrink-0">
                @
              </div>
              <div>
                <div className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#999] uppercase tracking-[1.5px]">Email</div>
                <div className="text-sm font-semibold text-[#1A1A1A]">{personalInfo.email}</div>
              </div>
            </a>

            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[#1A1A1A] text-sm no-underline"
            >
              <div className="w-9 h-9 rounded-[10px] bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[#333] flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </div>
              <div>
                <div className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#999] uppercase tracking-[1.5px]">GitHub</div>
                <div className="text-sm font-semibold text-[#1A1A1A]">PiotrRomanczuk</div>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/piotr-romanczuk/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[#1A1A1A] text-sm no-underline"
            >
              <div className="w-9 h-9 rounded-[10px] bg-[#E3F2FD] border border-[#90CAF9] flex items-center justify-center text-[#1565C0] flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </div>
              <div>
                <div className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#999] uppercase tracking-[1.5px]">LinkedIn</div>
                <div className="text-sm font-semibold text-[#1A1A1A]">Connect with me</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right: form */}
        <V4ContactForm />
      </div>
    </section>
  );
}
