import type { TimelineMilestone } from "@/types";

export const timeline: TimelineMilestone[] = [
  {
    id: "commercial-client",
    title: "First Commercial Client Project",
    period: "2023",
    description:
      "Delivered a production landing page for INBORR as a paid freelance engagement — first revenue from code.",
    tech: ["React", "Tailwind CSS", "Figma"],
  },
  {
    id: "production-app",
    title: "Shipped a Production Business App",
    period: "2024",
    description:
      "Built Guitar CRM from scratch for a real business — full inventory management, client tracking, and reporting.",
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
  },
  {
    id: "realtime-viz",
    title: "Real-Time Data Visualization",
    period: "2024",
    description:
      "Engineered a WebSocket-powered dashboard rendering 1 000+ live data points at 60 fps with zero dropped frames.",
    tech: ["React", "WebSocket", "D3.js", "TypeScript"],
  },
  {
    id: "multiple-products",
    title: "Multiple Live Products in Production",
    period: "2025",
    description:
      "Running several deployed applications — actively maintained, monitored, and used by real users every day.",
    tech: ["Next.js", "TypeScript", "Supabase", "Vercel", "CI/CD"],
  },
];
