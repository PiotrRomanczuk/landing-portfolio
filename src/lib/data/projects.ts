import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "guitar-crm",
    title: "Guitar CRM",
    description:
      "A CRM application for managing guitar inventory, clients, and sales workflows.",
    highlights: [
      "Production business app",
      "Full CRUD",
      "Responsive dashboard",
    ],
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Vercel"],
    liveUrl: "https://guitar-crm.vercel.app",
    sourceUrl: "https://github.com/PiotrRomanczuk/guitar-crm",
    variant: "large",
    year: "2024",
    category: "Full-Stack",
  },
  {
    id: "radio-signal",
    title: "Radio Signal Visualization",
    description:
      "Real-time visualization of 1000 radio signal values streaming over WebSocket, rendered on HTML5 Canvas.",
    highlights: [
      "WebSocket streaming",
      "Canvas rendering at 60fps",
      "1000+ data points",
    ],
    tech: ["TypeScript", "React", "WebSocket", "Canvas API"],
    sourceUrl:
      "https://github.com/PiotrRomanczuk/radio-signal-visualization",
    variant: "large",
    year: "2024",
    category: "Data Viz",
  },
  {
    id: "inborr",
    title: "INBORR Landing Page",
    description:
      "A polished commercial landing page with modern design and optimized performance.",
    tech: ["TypeScript", "Next.js", "Tailwind CSS", "Vercel"],
    highlights: [
      "Commercial client project",
      "SEO optimized",
      "Google Maps integration",
    ],
    liveUrl: "https://inborr-landing-page.vercel.app",
    sourceUrl: "https://github.com/PiotrRomanczuk/INBORR---LandingPage",
    screenshot: "/projects/Inborr.png",
    variant: "compact",
    year: "2023",
    category: "Frontend",
  },
  {
    id: "pizza-store",
    title: "Pizza Store",
    description:
      "E-commerce application with menu browsing, cart management, and ordering flow.",
    tech: ["TypeScript", "React", "Vercel"],
    highlights: [
      "Shopping cart with state management",
      "Stripe payment integration",
      "Animated UI with Framer Motion",
    ],
    liveUrl: "https://pizza-store-pearl.vercel.app",
    sourceUrl: "https://github.com/PiotrRomanczuk/pizza-store",
    screenshot: "/projects/PizzaStore.png",
    variant: "compact",
    year: "2023",
    category: "E-Commerce",
  },
];
