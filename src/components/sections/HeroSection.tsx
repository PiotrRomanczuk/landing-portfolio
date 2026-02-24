"use client";

import { motion } from "motion/react";
import { personalInfo } from "@/lib/data/personal";

export function HeroSection() {
  const [firstName, ...lastParts] = personalInfo.name.split(" ");
  const lastName = lastParts.join(" ");

  return (
    <section className="relative flex min-h-[80vh] flex-col justify-center py-20">
      {/* Decorative blur */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-4 font-mono text-sm tracking-widest text-primary"
        >
          {personalInfo.title.toUpperCase()}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="mb-6 text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl"
        >
          {firstName} <br />
          <span className="text-muted-foreground">{lastName}.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="mb-8 max-w-xl text-xl font-light leading-relaxed text-muted-foreground md:text-2xl"
        >
          {personalInfo.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#projects"
            className="flex h-12 items-center justify-center rounded bg-primary px-8 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="flex h-12 items-center justify-center rounded border border-border px-8 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-accent"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
