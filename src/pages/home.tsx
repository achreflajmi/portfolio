import { HeroSection } from '@/components/sections/hero';
import { ManifestoSection } from '@/components/sections/manifesto';
import { ExperienceSection } from '@/components/sections/experience';
import { ExpertiseSection } from '@/components/sections/expertise';
import { ProjectsSection } from '@/components/sections/projects';
import { EducationSection } from '@/components/sections/education';
import { WritingSection } from '@/components/sections/writing';
import { ContactSection } from '@/components/sections/contact';
import { SectionIndicator } from '@/components/section-indicator';
import { SectionProvider } from '@/lib/section-context';

export default function Home() {
  return (
    <SectionProvider>
      <div className="bg-background min-h-screen text-foreground font-sans">
        <SectionIndicator />

        <main>
          <HeroSection />
          <ManifestoSection />
          <ExperienceSection />
          <ExpertiseSection />
          <ProjectsSection />
          <EducationSection />
          <WritingSection />
          <ContactSection />
        </main>
      </div>
    </SectionProvider>
  );
}
