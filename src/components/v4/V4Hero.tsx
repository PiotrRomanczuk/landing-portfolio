import Image from "next/image";
import { personalInfo } from "@/lib/data/personal";

export function V4Hero() {
  return (
    <section className="max-w-[1100px] mx-auto px-8 py-14 md:py-[56px] grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-12 md:gap-16 items-center">
      {/* Left column */}
      <div>
        <div className="inline-flex items-center gap-2 bg-[var(--v4-light-blue)] border border-[var(--v4-light-blue-border)] rounded-full px-4 py-1.5 text-xs font-semibold text-[var(--v4-navy)] uppercase tracking-[1px] mb-8">
          <span className="w-1.5 h-1.5 bg-[var(--v4-blue)] rounded-full" />
          Available for new projects
        </div>

        <h1 className="font-[family-name:var(--font-source-serif)] text-[clamp(36px,5vw,56px)] font-black leading-[1.08] tracking-[-2px] mb-7 text-[#1A1A1A]">
          Building digital<br />
          products with<br />
          <span className="bg-gradient-to-br from-[var(--v4-navy)] to-[var(--v4-blue)] bg-clip-text text-transparent">
            craft &amp; intention
          </span>
        </h1>

        <p className="text-lg leading-[1.7] text-[#666] mb-10 max-w-[520px]">
          {personalInfo.bio}
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <a
            href="#work"
            className="inline-flex items-center gap-2 bg-[var(--v4-navy)] text-white font-semibold text-[15px] px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            View My Work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-transparent text-[#1A1A1A] font-medium text-[15px] px-7 py-3.5 rounded-xl border border-[#D0D0CC] hover:border-[#999] transition-colors"
          >
            Get In Touch
          </a>
        </div>

        <div className="flex gap-10 mt-12 pt-8 border-t border-[var(--border)]">
          {[
            { value: "4+", label: "Live Products" },
            { value: "1.2k", label: "Commits This Year" },
            { value: "600+", label: "Tests Written" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="font-[family-name:var(--font-source-serif)] text-[32px] font-bold text-[#1A1A1A]">
                {stat.value}
              </div>
              <div className="text-[13px] text-[#999]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right column - profile image */}
      <div className="relative">
        <div className="w-full aspect-[3/4] rounded-[20px] overflow-hidden bg-[#EEEEEA] border border-[var(--border)] relative">
          <Image
            src="/profile.jpg"
            alt={personalInfo.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-[var(--background)] to-transparent" />
        </div>
        <div className="absolute -bottom-5 -left-5 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-[var(--border)] rounded-2xl px-5 py-4 flex flex-col gap-1">
          <div className="font-[family-name:var(--font-source-serif)] text-[28px] font-bold text-[var(--v4-navy)]">
            3+ yrs
          </div>
          <div className="text-xs text-[#888]">Building for the web</div>
        </div>
      </div>
    </section>
  );
}
