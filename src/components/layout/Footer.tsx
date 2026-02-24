import { personalInfo } from "@/lib/data/personal";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 py-8 font-mono text-sm text-muted-foreground md:flex-row lg:px-20">
        <p>
          &copy; {new Date().getFullYear()} {personalInfo.name}. All rights
          reserved.
        </p>
        <div className="flex gap-6">
          {personalInfo.twitter && (
            <a
              href={personalInfo.twitter}
              className="transition-colors hover:text-primary"
            >
              Twitter
            </a>
          )}
          {personalInfo.linkedin && (
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              LinkedIn
            </a>
          )}
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            Github
          </a>
        </div>
      </div>
    </footer>
  );
}
