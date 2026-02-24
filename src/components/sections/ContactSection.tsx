"use client";

import { Mail, Phone } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ContactForm } from "@/components/ContactForm";
import { personalInfo } from "@/lib/data/personal";

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-border py-20">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        {/* Left side */}
        <AnimatedSection>
          <h2 className="mb-8 text-5xl font-bold tracking-tighter">
            Say hello.
          </h2>
          <p className="mb-12 max-w-sm text-lg text-muted-foreground">
            I&apos;m always open to discussing product design work or
            partnership opportunities.
          </p>

          <div className="flex flex-col gap-4 font-mono text-sm">
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-3 transition-colors hover:text-primary"
            >
              <Mail className="h-5 w-5" />
              {personalInfo.email}
            </a>
            {personalInfo.phone && (
              <a
                href={`tel:${personalInfo.phone}`}
                className="flex items-center gap-3 transition-colors hover:text-primary"
              >
                <Phone className="h-5 w-5" />
                {personalInfo.phone}
              </a>
            )}

            <div className="mt-8 flex gap-4">
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-xs font-bold transition-all hover:border-primary hover:text-primary"
                >
                  LN
                </a>
              )}
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-xs font-bold transition-all hover:border-primary hover:text-primary"
              >
                GH
              </a>
              {personalInfo.twitter && (
                <a
                  href={personalInfo.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-xs font-bold transition-all hover:border-primary hover:text-primary"
                >
                  TW
                </a>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Right side - Form */}
        <AnimatedSection delay={0.1}>
          <ContactForm />
        </AnimatedSection>
      </div>
    </section>
  );
}
