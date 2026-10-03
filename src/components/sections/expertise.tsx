import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { useSectionInView } from '@/lib/use-section-in-view';

const EXPERTISE = [
  {
    title: 'Backend',
    desc: 'Typed services with the contract enforced at the edge, not assumed. REST surfaces designed so the auth story and the data story never drift apart.',
    skills: ['TypeScript · Node.js', 'NestJS', 'Next.js server actions & routes', 'Java · Spring Boot', 'Zod · JWT · RBAC'],
  },
  {
    title: 'Data',
    desc: 'Relational schemas that stay honest under growth, with vector search living beside the rows it describes rather than in a separate system to keep in sync.',
    skills: ['PostgreSQL', 'pgvector', 'Supabase · Row-Level Security', 'Drizzle ORM · Prisma', 'MongoDB'],
  },
  {
    title: 'Applied AI',
    desc: 'LLMs wired into real products: grounded in live data through fixed, user-scoped tool menus, and measured on outcomes rather than demos.',
    skills: ['LLM integration · tool-calling agents', 'RAG & embeddings', 'Hybrid semantic search', 'Recommender systems', 'STT / TTS pipelines'],
  },
  {
    title: 'Frontend',
    desc: 'Interfaces that make a system legible — showing what ran unattended, what a person decided, and where the line between them falls.',
    skills: ['React · Next.js', 'Angular', 'Tailwind CSS', 'Flutter', 'SwiftUI'],
  },
  {
    title: 'Infrastructure',
    desc: 'Pipelines, background jobs and observability set up so a nightly autonomous loop can be trusted to run without anyone watching it.',
    skills: ['Docker', 'CI/CD · GitHub Actions', 'Turborepo + pnpm monorepos', 'Trigger.dev · Vercel', 'Sentry · PostHog · Jest'],
  },
  {
    title: 'Languages',
    desc: 'Working across four languages, currently building a technical vocabulary in German while based in Berlin.',
    skills: ['Arabic — native', 'French — C1', 'English — C1, TOEFL iBT', 'German — A1, learning'],
  },
];

export function ExpertiseSection() {
  const ref = useSectionInView(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(EXPERTISE.length - 1, Math.floor(latest * EXPERTISE.length * 0.999));
    if (index !== activeIndex) setActiveIndex(index);
  });

  const transitionSpec = {
    duration: shouldReduceMotion ? 0 : 0.65,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <section id="expertise" ref={ref as React.RefObject<HTMLElement>} className="relative bg-background">
      {/* Height scales with card count so each step stays readable while scrolling */}
      <div ref={containerRef} style={{ height: `${EXPERTISE.length * 85}vh` }} className="relative">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 lg:gap-24 relative z-10 h-full">
            {/* LEFT: giant rolling number */}
            <div className="hidden md:flex flex-1 items-center justify-start select-none pt-24">
              <div className="font-sans font-light leading-[0.8] tracking-tighter text-[22vw] lg:text-[24vw] flex items-center">
                <span className="text-white/10">0</span>
                <div className="h-[0.8em] overflow-hidden relative text-white/90">
                  <motion.div
                    animate={{ y: `calc(-${activeIndex} * 0.8em)` }}
                    transition={transitionSpec}
                    className="flex flex-col"
                  >
                    {Array.from({ length: EXPERTISE.length }, (_, i) => i + 1).map((num) => (
                      <div key={num} className="h-[0.8em] flex items-center justify-center pb-2">
                        {num}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* RIGHT: content card */}
            <div className="w-full max-w-[500px] md:max-w-none md:w-[600px] shrink-0 relative h-[460px] md:h-[500px] my-auto flex items-center">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -40 }}
                  transition={transitionSpec}
                  className="absolute inset-0 w-full h-full flex flex-col"
                >
                  <div className="bg-background/50 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col h-full">
                    <div className="mb-4 md:mb-8">
                      <h3 className="font-sans font-light text-2xl sm:text-3xl md:text-4xl leading-tight text-white mb-2 md:mb-4">
                        {EXPERTISE[activeIndex].title}
                      </h3>
                      <p className="mt-2 md:mt-4 text-white/60 font-sans text-xs sm:text-sm md:text-base leading-relaxed">
                        {EXPERTISE[activeIndex].desc}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <div className="text-[11px] md:text-xs font-sans tracking-widest text-white/30 mb-2 md:mb-4 uppercase border-b border-white/10 pb-2 md:pb-4">
                        Technologies
                      </div>
                      <ul className="flex flex-col">
                        {EXPERTISE[activeIndex].skills.map((skill, i) => (
                          <li
                            key={skill}
                            className="flex items-center justify-between gap-4 py-2 md:py-3 border-b border-white/5 last:border-b-0 text-[11px] md:text-sm font-sans tracking-wide text-white/80"
                          >
                            <span>{skill}</span>
                            <span className="text-primary opacity-60 font-mono text-[10px] md:text-xs shrink-0">
                              0{i + 1}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
