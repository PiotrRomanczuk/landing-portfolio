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
}

export interface TerminalLine {
  type: "command" | "output" | "success" | "comment";
  text: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  sourceUrl: string;
  screenshot?: string;
  variant: "large" | "compact";
  year: string;
  category: string;
  terminalPath: string;
  terminalLines: TerminalLine[];
  status: "active" | "archived" | "completed";
}

export interface TimelineMilestone {
  id: string;
  title: string;
  period: string;
  description: string;
  tech: string[];
}
