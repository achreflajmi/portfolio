import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useSectionInView } from '@/lib/use-section-in-view';
import { SectionHeader } from '@/components/ui/section-header';
import { Watermark } from '@/components/ui/watermark';
import { cn } from '@/lib/utils';

const EXPERIENCES = [
  {
    company: 'recash',
    location: 'CIRCULAR SERVICE GMBH · MUNICH',
    title: 'SOFTWARE ENGINEERING INTERN',
    date: 'FEB — JUL 2026',
    desc: 'Sole developer of the AI layer in a nine-person startup — 24 sprints, continuous deployment, CTO code review. Shipped SmartPilot: an autonomous deal engine closing a four-stage loop, plus a three-signal hybrid semantic search and a behavioural recommendation engine.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'pgvector', 'Drizzle', 'Trigger.dev', 'Claude API'],
  },
  {
    company: 'MASMEDIA',
    location: 'ESPRIT TECH · TUNIS',
    title: 'AI SOFTWARE DEVELOPER INTERN',
    date: 'JUL — SEP 2025',
    desc: 'Sole developer of MASMEDIA AIDITOR across two modules. PARROT covers livestreams in real time at 3.2 s transcription latency and 84% detection precision; SWALLO scrapes 30 tech sources under GPT-4 relevance filtering. Event coverage fell from 4h30 to 1h20.',
    stack: ['NestJS', 'TypeScript', 'MongoDB', 'GPT-4', 'AssemblyAI', 'FFmpeg', 'Docker'],
  },
  {
    company: 'FinConnect',
    location: 'FINANCIAL SOLUTIONS · TUNIS',
    title: 'FULL-STACK DEVELOPER INTERN',
    date: 'JUN — JUL 2024',
    desc: 'Internal ticketing platform: JWT auth, role-based access control across agent, manager and admin, filtering, reporting, PDF export and in-app chat. Scrum with peer review.',
    stack: ['Angular', 'Spring Boot', 'PostgreSQL'],
  },
  {
    company: 'SOFTParadigm',
    location: 'TUNIS',
    title: 'WEB DEVELOPMENT INTERN',
    date: 'JUN — JUL 2022',
    desc: 'Backend REST endpoints and Angular UI components; refactored existing modules. First professional role.',
    stack: ['Angular', 'REST'],
  },
];

export function ExperienceSection() {
  const ref = useSectionInView(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const lineHeight = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '100%']), {
    stiffness: 100,
    damping: 20,
  });

  return (
    <section
      id="experience"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-32 px-6 md:px-24 relative bg-background overflow-hidden"
    >
      <Watermark text="EXPERIENCE" className="text-[14vw] md:text-[16vw]" />

      <div ref={containerRef} className="max-w-6xl mx-auto border-t border-white/10 pt-16 relative z-10">
        <SectionHeader
          subtitle="Where I've shipped"
          title={
            <span>
              Four roles, each one <br />
              <span className="text-primary">built for real use</span>
            </span>
          }
        />

        <div className="relative flex flex-col gap-6 md:gap-8 py-8 md:py-14">
          {/* Track */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />
          {/* Glowing progress — the run line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-6 md:left-1/2 top-0 w-[2px] bg-primary md:-translate-x-1/2 origin-top drop-shadow-[0_0_8px_rgba(94,216,240,0.8)] z-10"
          />

          {EXPERIENCES.map((exp, i) => (
            <ExperienceItem key={exp.company} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({ exp, index }: { exp: (typeof EXPERIENCES)[0]; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.2, 1, 1, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.9, 1, 1, 1, 0.9]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={itemRef}
      style={{ opacity, scale }}
      className={cn(
        'relative flex flex-col md:flex-row items-center w-full group',
        isEven ? 'md:justify-start' : 'md:justify-end',
      )}
    >
      {/* Node */}
      <div className="absolute left-6 md:left-1/2 top-1/2 w-3 h-3 rounded-full bg-background border-2 border-primary -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 group-hover:scale-125 group-hover:bg-primary group-hover:drop-shadow-[0_0_8px_rgba(94,216,240,0.8)]" />

      <div
        className={cn(
          'w-full pl-14 md:pl-0 md:w-[calc(50%-2.5rem)] flex flex-col gap-2.5 py-4',
          isEven ? 'md:text-right md:items-end md:pr-10' : 'md:text-left md:items-start md:pl-10',
        )}
      >
        <div className="flex flex-col gap-1">
          <span className="font-sans text-sm tracking-widest text-primary uppercase">{exp.date}</span>
          <span className="font-sans text-[11px] tracking-widest text-white/40 uppercase">
            {exp.location}
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-sans font-light leading-tight" translate="no">
          {exp.company}
        </h3>

        <div className="px-3.5 py-1.5 border border-white/20 rounded-full font-sans text-xs tracking-widest uppercase bg-white/5 backdrop-blur-sm w-fit">
          {exp.title}
        </div>

        <p className={cn('font-sans text-white/70 text-base max-w-md mt-1', isEven ? 'md:text-right' : 'md:text-left')}>
          {exp.desc}
        </p>

        <ul
          className={cn(
            'flex flex-wrap gap-1.5 mt-3 max-w-md',
            isEven ? 'md:justify-end' : 'md:justify-start',
          )}
          aria-label="Stack"
        >
          {exp.stack.map((t) => (
            <li
              key={t}
              className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] tracking-wide text-primary/80 leading-none"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
