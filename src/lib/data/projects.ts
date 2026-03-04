import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "strummy",
    title: "Strummy — Guitar CRM",
    description:
      "Production SaaS for guitar teachers. Manages students, lessons, and repertoire.",
    tech: [
      "TypeScript",
      "Next.js",
      "Supabase",
      "Spotify API",
      "Google Calendar",
      "Tailwind CSS",
    ],
    liveUrl: "https://strummy.vercel.app",
    sourceUrl: "https://github.com/PiotrRomanczuk/guitar-crm",
    screenshot: "/projects/Strummy.png",
    variant: "large",
    year: "2024",
    category: "Full-Stack SaaS",
    terminalPath: "~/projects/strummy",
    terminalLines: [
      { type: "command", text: "cat README.md" },
      { type: "output", text: "# Strummy — Guitar CRM" },
      {
        type: "output",
        text: "Production SaaS for guitar teachers.",
      },
      {
        type: "output",
        text: "Manages students, lessons, and repertoire.",
      },
      { type: "command", text: "git log --oneline | wc -l" },
      { type: "success", text: "1,200+ commits across 80+ releases" },
      { type: "command", text: "cat integrations.yml" },
      { type: "output", text: "supabase: PostgreSQL + RLS" },
      { type: "output", text: "spotify: song metadata enrichment" },
      { type: "output", text: "google-calendar: lesson sync" },
      { type: "comment", text: "20-30 daily active users since Oct 2024" },
    ],
    status: "active",
  },
  {
    id: "instagram-webhook",
    title: "Instagram Stories Webhook",
    description:
      "Automated IG Story publishing via Meta Graph API. Built in 123.5 hours across 41 days.",
    tech: [
      "TypeScript",
      "Next.js",
      "Supabase",
      "Meta Graph API",
      "FFmpeg",
      "Playwright",
    ],
    sourceUrl:
      "https://github.com/PiotrRomanczuk/instagram-stories-webhook",
    screenshot: "/projects/IGWebhook.png",
    variant: "large",
    year: "2025",
    category: "Full-Stack Automation",
    terminalPath: "~/projects/ig-webhook",
    terminalLines: [
      { type: "command", text: "cat README.md" },
      { type: "output", text: "# Instagram Stories Webhook" },
      {
        type: "output",
        text: "Automated IG Story publishing via Meta Graph API.",
      },
      {
        type: "output",
        text: "Built in 123.5 hours across 41 days.",
      },
      { type: "command", text: "npm test -- --summary" },
      { type: "success", text: "500+ unit tests, 113 E2E tests passed" },
      { type: "command", text: "cat architecture.md" },
      { type: "output", text: "→ FFmpeg video pipeline (client + server)" },
      { type: "output", text: "→ Distributed cron with DB-level locking" },
      {
        type: "output",
        text: "→ Meta API 3-step container flow with retry",
      },
      {
        type: "output",
        text: "→ Tinder-style swipe UI for content review",
      },
    ],
    status: "active",
  },
  {
    id: "inborr",
    title: "INBORR — Warsaw Apartments",
    description:
      "Commercial client landing page for short-term apartment rentals in Warsaw.",
    tech: ["TypeScript", "Next.js", "Tailwind CSS", "Google Maps", "i18n"],
    liveUrl: "https://inborr-landing-page.vercel.app",
    sourceUrl: "https://github.com/PiotrRomanczuk/INBORR---LandingPage",
    screenshot: "/projects/Inborr.png",
    variant: "compact",
    year: "2023",
    category: "Frontend",
    terminalPath: "~/projects/inborr",
    terminalLines: [
      { type: "command", text: "cat README.md" },
      { type: "output", text: "# INBORR — Warsaw Apartments" },
      {
        type: "output",
        text: "Commercial client landing page for short-term rentals.",
      },
      { type: "command", text: "ls features/" },
      {
        type: "output",
        text: "booking-system/  i18n-pl-en/  google-maps/  seo/",
      },
    ],
    status: "completed",
  },
  {
    id: "pizza-store",
    title: "Pizza Store",
    description:
      "E-commerce demo with interactive ordering, cart management, and payments.",
    tech: ["TypeScript", "React", "Stripe", "Framer Motion", "Swiper"],
    liveUrl: "https://pizza-store-pearl.vercel.app",
    sourceUrl: "https://github.com/PiotrRomanczuk/pizza-store",
    screenshot: "/projects/PizzaStore.png",
    variant: "compact",
    year: "2023",
    category: "E-Commerce",
    terminalPath: "~/projects/pizza-store",
    terminalLines: [
      { type: "command", text: "cat README.md" },
      { type: "output", text: "# Pizza Store" },
      {
        type: "output",
        text: "E-commerce demo with interactive ordering.",
      },
      { type: "command", text: "ls integrations/" },
      {
        type: "output",
        text: "stripe-payments/  framer-motion/  swiper-carousel/",
      },
    ],
    status: "completed",
  },
];
