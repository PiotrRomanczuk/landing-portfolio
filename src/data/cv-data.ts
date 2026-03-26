export type CVVariant = "fullstack" | "frontend" | "backend" | "devops";

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  githubUrl: string;
  portfolio: string;
  portfolioUrl: string;
}

export interface ProjectBullet {
  text: string;
  tags: CVVariant[];
}

export interface Project {
  key: string;
  name: string;
  bullets: ProjectBullet[];
  techByVariant: Record<CVVariant, string[]>;
  url: string;
  urlLabel: string;
  sourceUrl?: string;
}

export interface SkillGroup {
  label: string;
  skills: string[];
  tags: CVVariant[];
}

export interface TimelineEntry {
  dates: string;
  title: string;
  descriptionByVariant: Record<CVVariant, string>;
}

export interface VariantConfig {
  title: string;
  subtitle: string;
  sectionTitle: string;
  projectOrder: string[];
  skillOrder: string[];
  showExpanding: boolean;
  summary: string;
}

export const personalInfo: PersonalInfo = {
  name: "Piotr Romanczuk",
  email: "p.romanczuk@gmail.com",
  phone: "+48 513 602 768",
  location: "Warsaw, Poland",
  github: "github.com/PiotrRomanczuk",
  githubUrl: "https://github.com/PiotrRomanczuk",
  portfolio: "romanczuk.vercel.app",
  portfolioUrl: "https://romanczuk.vercel.app",
};

export const projects: Project[] = [
  {
    key: "crm",
    name: "Guitar CRM",
    bullets: [
      {
        text: "Production SaaS serving 20-30 daily active users -- student management, lesson scheduling, practice tracking",
        tags: ["fullstack", "frontend", "backend", "devops"],
      },
      {
        text: "5-stage CI/CD pipeline: lint, typecheck, unit tests, build, deploy via GitHub Actions",
        tags: ["devops", "backend", "fullstack"],
      },
      {
        text: "Spotify-enriched song library with circuit breaker + 8-strategy fuzzy matching",
        tags: ["backend", "fullstack"],
      },
      {
        text: "Bidirectional Google Calendar sync with SSE streaming",
        tags: ["fullstack", "frontend", "backend"],
      },
      {
        text: "9 AI agents (OpenRouter + Ollama) for lesson planning and content generation",
        tags: ["backend", "fullstack"],
      },
      {
        text: "50+ RLS policies, event-driven notification pipeline, 1,100+ tests across 7 device profiles",
        tags: ["fullstack", "frontend", "backend", "devops"],
      },
      {
        text: "Automated semantic versioning with git tags, GitHub Releases, and PR-label bump logic",
        tags: ["devops"],
      },
      {
        text: "Scheduled cron jobs (every 15 min) for notification queue processing and monitoring",
        tags: ["devops", "backend"],
      },
      {
        text: "Responsive design with mobile-first approach, tested across 7 device profiles",
        tags: ["frontend"],
      },
      {
        text: "Animated transitions and micro-interactions using Framer Motion for smooth UX",
        tags: ["frontend"],
      },
      {
        text: "Accessible UI with ARIA labels, keyboard navigation, and screen reader support",
        tags: ["frontend"],
      },
    ],
    techByVariant: {
      fullstack: [
        "TypeScript",
        "Next.js",
        "Supabase",
        "Spotify API",
        "Google Calendar",
        "OpenRouter",
      ],
      frontend: [
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "SSE",
        "Responsive Design",
      ],
      backend: [
        "TypeScript",
        "Next.js",
        "Supabase/PostgreSQL",
        "REST APIs",
        "Spotify API",
        "Google Calendar",
      ],
      devops: [
        "GitHub Actions",
        "Vercel",
        "Supabase/PostgreSQL",
        "Cron",
        "Node.js 20",
      ],
    },
    url: "https://strummy.app",
    urlLabel: "strummy.app",
    sourceUrl: "github.com/PiotrRomanczuk/guitar-crm",
  },
  {
    key: "webhook",
    name: "Instagram Stories Webhook",
    bullets: [
      {
        text: "SaaS for programmatic Instagram Story publishing with swipe-to-approve review queue",
        tags: ["fullstack", "frontend", "backend"],
      },
      {
        text: "Dockerized FFmpeg video processor deployed on Railway (Alpine Linux container)",
        tags: ["devops", "backend"],
      },
      {
        text: "3-tier video pipeline: FFmpeg.wasm client validation -> server transcoding -> signed-URL uploads",
        tags: ["fullstack", "backend", "devops"],
      },
      {
        text: "CI pipeline: lint, typecheck, tests, build gate, automated code review",
        tags: ["devops", "fullstack"],
      },
      {
        text: "Distributed cron locking for serverless deduplication on Vercel Edge Functions",
        tags: ["devops", "backend"],
      },
      {
        text: "Meta Graph API 3-step container flow with error classification and retry logic",
        tags: ["backend", "fullstack"],
      },
      {
        text: "Drag-and-drop calendar scheduling with Supabase realtime sync",
        tags: ["frontend", "fullstack"],
      },
      {
        text: "656 unit tests, 113 E2E tests, 35 releases with structured changelog",
        tags: ["fullstack", "devops", "backend"],
      },
      {
        text: "Responsive mobile-first UI with touch gestures and swipe interactions",
        tags: ["frontend"],
      },
      {
        text: "Real-time UI updates via Supabase channel subscriptions and optimistic mutations",
        tags: ["frontend", "fullstack"],
      },
      {
        text: "Component library with 40+ reusable UI components following atomic design patterns",
        tags: ["frontend"],
      },
    ],
    techByVariant: {
      fullstack: [
        "TypeScript",
        "Next.js",
        "Supabase",
        "Meta Graph API",
        "FFmpeg",
        "Vercel Cron",
      ],
      frontend: [
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "Framer Motion",
        "DnD",
      ],
      backend: [
        "TypeScript",
        "Next.js",
        "Supabase/PostgreSQL",
        "Meta Graph API",
        "FFmpeg",
        "Docker",
      ],
      devops: [
        "Docker",
        "Railway",
        "GitHub Actions",
        "Vercel Edge",
        "FFmpeg",
      ],
    },
    url: "https://stories-webhook.vercel.app",
    urlLabel: "stories-webhook.vercel.app",
    sourceUrl: "github.com/PiotrRomanczuk/instagram-stories-webhook",
  },
  {
    key: "portfolio",
    name: "Portfolio & INBORR",
    bullets: [
      {
        text: "Personal portfolio site with dynamic CV generation and project showcase",
        tags: ["fullstack", "frontend"],
      },
      {
        text: "Commercial client site (inborr.pl) with i18n, production deployment, domain management",
        tags: ["fullstack", "frontend", "backend"],
      },
      {
        text: "Vercel deployment with preview branches, automatic SSL, edge CDN",
        tags: ["devops", "fullstack"],
      },
      {
        text: "Next.js 16 with ISR caching and optimized build pipelines",
        tags: ["frontend", "fullstack", "devops"],
      },
      {
        text: "Playwright E2E testing in pre-deploy validation workflow",
        tags: ["devops", "fullstack"],
      },
      {
        text: "Env variable management across dev, preview, and production stages",
        tags: ["devops"],
      },
      {
        text: "Print-optimized CSS with @media print rules for pixel-perfect PDF CV generation",
        tags: ["frontend"],
      },
    ],
    techByVariant: {
      fullstack: [
        "TypeScript",
        "Next.js 16",
        "Tailwind CSS",
        "Framer Motion",
        "Playwright",
      ],
      frontend: [
        "TypeScript",
        "React",
        "Next.js 16",
        "Tailwind CSS",
        "Framer Motion",
        "i18n",
      ],
      backend: [
        "TypeScript",
        "Next.js 16",
        "Vercel",
        "ISR",
        "Playwright",
      ],
      devops: [
        "Vercel",
        "Next.js 16",
        "Playwright",
        "DNS/SSL",
        "Edge CDN",
      ],
    },
    url: "https://romanczuk.vercel.app",
    urlLabel: "romanczuk.vercel.app | inborr.pl",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "CI/CD",
    skills: [
      "GitHub Actions",
      "Vercel CI",
      "Automated Releases",
      "Semantic Versioning",
    ],
    tags: ["devops", "backend", "fullstack"],
  },
  {
    label: "Containers",
    skills: ["Docker", "Docker Compose", "Alpine Linux"],
    tags: ["devops", "backend"],
  },
  {
    label: "Cloud",
    skills: ["Vercel", "Railway", "Supabase"],
    tags: ["devops", "backend", "fullstack"],
  },
  {
    label: "Frontend",
    skills: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "HTML5 Canvas",
    ],
    tags: ["frontend", "fullstack"],
  },
  {
    label: "Backend",
    skills: [
      "Node.js",
      "Supabase/PostgreSQL",
      "REST APIs",
      "WebSocket",
      "SSE",
    ],
    tags: ["backend", "fullstack"],
  },
  {
    label: "Languages",
    skills: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Bash",
      "C# (.NET 9)",
      "SQL",
    ],
    tags: ["fullstack", "frontend", "backend", "devops"],
  },
  {
    label: "Databases",
    skills: ["PostgreSQL", "SQL Server", "Supabase RLS"],
    tags: ["backend", "fullstack", "devops"],
  },
  {
    label: "Testing",
    skills: ["Jest", "Vitest", "Playwright", "E2E Automation"],
    tags: ["fullstack", "frontend", "backend", "devops"],
  },
  {
    label: "Monitoring",
    skills: ["Cron Health Checks", "Structured Logging", "HTTP Monitoring"],
    tags: ["devops"],
  },
  {
    label: "Tools",
    skills: ["Git", "Linux CLI", "ESLint", "Docker", "npm"],
    tags: ["fullstack", "frontend", "backend", "devops"],
  },
  {
    label: "Spoken",
    skills: ["Polish \u2014 Native", "English \u2014 C1"],
    tags: ["fullstack", "frontend", "backend", "devops"],
  },
];

export const timelineEntries: TimelineEntry[] = [
  {
    dates: "2021 \u2014 Present",
    title: "Software Engineer & Entrepreneur (Self-taught)",
    descriptionByVariant: {
      fullstack:
        "Built and operated 3 production apps end-to-end: architecture, databases, APIs, CI/CD, and deployment. Self-taught through TypeScript, React, Next.js, and cloud services.",
      frontend:
        "Built responsive, accessible web applications from scratch. Self-taught through React, TypeScript, Next.js, and modern CSS. Focused on component architecture and user experience.",
      backend:
        "Designed and built APIs, databases, and data pipelines for 3 production applications. Self-taught through TypeScript, Node.js, PostgreSQL, and cloud infrastructure.",
      devops:
        "Built and operated 4 production apps end-to-end: infrastructure, CI/CD, deployment, monitoring. Self-taught through TypeScript, React, Next.js, and cloud services.",
    },
  },
  {
    dates: "2022 \u2014 Present",
    title: "Guitar Teacher",
    descriptionByVariant: {
      fullstack:
        "Built a custom CRM (Strummy) for 20-30 active students. Runs on self-managed infra with automated deployments.",
      frontend:
        "Built a custom CRM (Strummy) for 20-30 active students. Runs on self-managed infra with automated deployments.",
      backend:
        "Built a custom CRM (Strummy) for 20-30 active students. Runs on self-managed infra with automated deployments.",
      devops:
        "Built a custom CRM (Strummy) for 20-30 active students. Runs on self-managed infra with automated deployments.",
    },
  },
  {
    dates: "2020 \u2014 2022",
    title: "PC Sales Specialist",
    descriptionByVariant: {
      fullstack:
        "Technical consulting on custom PC builds. Strong troubleshooting and communication skills.",
      frontend:
        "Technical consulting on custom PC builds. Strong troubleshooting and communication skills.",
      backend:
        "Technical consulting on custom PC builds. Strong troubleshooting and communication skills.",
      devops:
        "Technical consulting on custom PC builds. Strong troubleshooting and communication skills.",
    },
  },
  {
    dates: "2015 \u2014 2020",
    title: "International Chef",
    descriptionByVariant: {
      fullstack:
        "High-pressure, multi-country environments (Poland, Ireland, Netherlands). Cross-cultural communication and adaptability.",
      frontend:
        "High-pressure, multi-country environments (Poland, Ireland, Netherlands). Cross-cultural communication and adaptability.",
      backend:
        "High-pressure, multi-country environments (Poland, Ireland, Netherlands). Cross-cultural communication and adaptability.",
      devops:
        "High-pressure, multi-country environments (Poland, Ireland, Netherlands). Cross-cultural communication and adaptability.",
    },
  },
];

export const expandingSkills =
  "Kubernetes (K8s)  \u2022  Terraform / IaC  \u2022  AWS (EC2, S3, Lambda, IAM)  \u2022  Prometheus + Grafana  \u2022  Nginx / Reverse Proxies  \u2022  Linux Administration";

export const education =
  "IU University of Applied Sciences \u2014 Software Development (in progress)";

export const variants: Record<CVVariant, VariantConfig> = {
  fullstack: {
    title: "Software Engineer",
    subtitle: "Full-Stack Developer",
    sectionTitle: "Selected Projects",
    projectOrder: ["crm", "webhook", "portfolio"],
    skillOrder: [
      "Languages",
      "Frontend",
      "Backend",
      "Cloud",
      "CI/CD",
      "Databases",
      "Testing",
      "Tools",
      "Spoken",
    ],
    showExpanding: false,
    summary:
      "Full-stack software engineer with production experience building SaaS applications end-to-end. Delivered 3 production apps with TypeScript, React, Next.js, and Supabase \u2014 including a CRM serving 20\u201330 daily users and an Instagram automation platform with 650+ tests. Hands-on with CI/CD pipelines, Docker, PostgreSQL, and cloud deployments across Vercel and Railway.",
  },
  frontend: {
    title: "Frontend Developer",
    subtitle: "Frontend Engineer",
    sectionTitle: "Selected Projects",
    projectOrder: ["crm", "portfolio", "webhook"],
    skillOrder: [
      "Languages",
      "Frontend",
      "Testing",
      "Tools",
      "Backend",
      "Cloud",
      "Spoken",
    ],
    showExpanding: false,
    summary:
      "Frontend-focused software engineer with production experience building responsive, accessible web applications. Delivered 3 production apps with TypeScript, React, Next.js, and Tailwind CSS \u2014 including a CRM with real-time SSE streaming, drag-and-drop scheduling, and 7-device responsive testing. Strong foundation in API integration, component architecture, and automated testing with Jest, Vitest, and Playwright.",
  },
  backend: {
    title: "Backend Developer",
    subtitle: "Backend Engineer",
    sectionTitle: "Selected Projects",
    projectOrder: ["webhook", "crm", "portfolio"],
    skillOrder: [
      "Languages",
      "Backend",
      "Databases",
      "Cloud",
      "Containers",
      "CI/CD",
      "Testing",
      "Tools",
      "Spoken",
    ],
    showExpanding: false,
    summary:
      "Backend-focused software engineer with production experience building APIs, data pipelines, and cloud infrastructure. Delivered 3 production apps with TypeScript, Node.js, Next.js, and Supabase/PostgreSQL \u2014 including a multi-tier video processing pipeline with FFmpeg, distributed cron locking, and 50+ RLS database policies. Hands-on with Docker, CI/CD, and cloud deployments.",
  },
  devops: {
    title: "Junior DevOps Engineer",
    subtitle: "DevOps Engineer",
    sectionTitle: "DevOps & Infrastructure Experience",
    projectOrder: ["crm", "webhook", "portfolio"],
    skillOrder: [
      "CI/CD",
      "Containers",
      "Cloud",
      "Monitoring",
      "Languages",
      "Databases",
      "Testing",
      "Tools",
      "Spoken",
    ],
    showExpanding: true,
    summary:
      "Self-taught software engineer with production experience in CI/CD pipelines, container orchestration, cloud deployments, and infrastructure automation. Built and maintained GitHub Actions pipelines with automated testing, semantic versioning, and release management across 4 production projects. Hands-on with Docker, Vercel, Supabase (PostgreSQL), and Azure services. Strong foundation in monitoring, cron scheduling, and deployment workflows.",
  },
};

export function getProjectsForVariant(variant: CVVariant) {
  const config = variants[variant];
  return config.projectOrder
    .map((key) => projects.find((p) => p.key === key)!)
    .map((project) => ({
      name: project.name,
      bullets: project.bullets
        .filter((b) => b.tags.includes(variant))
        .slice(0, 6)
        .map((b) => b.text),
      tech: project.techByVariant[variant],
      url: project.url,
      urlLabel: project.urlLabel,
      sourceUrl: project.sourceUrl,
    }));
}

export function getSkillsForVariant(variant: CVVariant) {
  const config = variants[variant];
  return config.skillOrder
    .map((label) => skillGroups.find((g) => g.label === label))
    .filter(
      (g): g is SkillGroup => g != null && g.tags.includes(variant)
    )
    .map((g) => ({ label: g.label, skills: g.skills }));
}

export function getTimelineForVariant(variant: CVVariant) {
  return timelineEntries.map((entry) => ({
    dates: entry.dates,
    title: entry.title,
    description: entry.descriptionByVariant[variant],
  }));
}
