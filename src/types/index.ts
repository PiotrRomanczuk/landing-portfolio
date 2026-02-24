export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  bio: string;
  tagline: string;
  techSummary: string;
  toolkit: string[];
  github: string;
  linkedin?: string;
  twitter?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  tech: string[];
  liveUrl?: string;
  sourceUrl: string;
  screenshot?: string;
  variant: "large" | "compact";
}

export interface TimelineMilestone {
  year: string;
  description: string;
}
