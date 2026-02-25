"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { personalInfo } from "@/lib/data/personal";

export function AboutSection() {
  return (
    <section
      id="about"
      className="flex flex-col items-start gap-12 py-20 md:flex-row md:items-center md:gap-24"
    >
      {/* Photo */}
      <AnimatedSection
        variant="fade"
        className="flex justify-center md:w-1/3 md:justify-end"
      >
        <div className="relative">
          <div className="size-72 rounded-full border-2 border-primary/30 p-2 md:size-96">
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src="/profile.jpg"
                alt={personalInfo.name}
                fill
                className="object-cover object-top grayscale transition-all duration-500 hover:grayscale-0"
                sizes="(min-width: 768px) 384px, 288px"
                priority
              />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 shadow-lg">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-xs">{personalInfo.location}</span>
          </div>
        </div>
      </AnimatedSection>

      {/* Text */}
      <AnimatedSection
        variant="fade"
        delay={0.1}
        className="max-w-2xl md:w-2/3"
      >
        <h2 className="mb-6 font-mono text-sm uppercase tracking-widest text-muted-foreground">
          About Me
        </h2>
        <p className="mb-8 text-lg leading-relaxed md:text-xl">
          {personalInfo.bio}
        </p>

        <div>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Toolkit
          </h3>
          <div className="flex flex-wrap gap-3">
            {personalInfo.toolkit.map((tool, i) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3, scale: 1.05 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.08 }}
                className="cursor-default rounded border border-border bg-muted px-3 py-1.5 font-mono text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
