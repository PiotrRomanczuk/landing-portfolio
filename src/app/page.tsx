import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionConnector } from "@/components/SectionConnector";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 pt-24 pb-20 lg:px-20">
        <HeroSection />
        <SectionConnector />
        <AboutSection />
        <SectionConnector />
        <ProjectsSection />
        <SectionConnector />
        <TimelineSection />
        <SectionConnector />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
