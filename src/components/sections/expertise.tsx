import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { useSectionInView } from '@/lib/use-section-in-view';
import { useCopy, type Lang } from '@/lib/i18n';

type Card = { title: string; desc: string; skills: string[] };

const SKILLS = [
  ['TypeScript \u00b7 JavaScript', 'Node.js \u00b7 NestJS', 'Next.js server actions & routes', 'Java \u00b7 Spring Boot', 'Python \u00b7 SQL', 'REST APIs \u00b7 Zod', 'JWT \u00b7 RBAC'],
  ['PostgreSQL', 'pgvector', 'Supabase \u00b7 Row-Level Security', 'Drizzle ORM \u00b7 Prisma', 'MongoDB'],
  ['LLM integration \u00b7 tool-calling agents', 'RAG & embeddings', 'Hybrid semantic search', 'Recommender systems', 'STT / TTS pipelines'],
  ['React \u00b7 Next.js', 'Angular', 'Tailwind CSS', 'Flutter', 'SwiftUI'],
  ['Docker', 'CI/CD \u00b7 GitHub Actions', 'Turborepo + pnpm monorepos', 'Trigger.dev \u00b7 Vercel', 'Sentry \u00b7 PostHog \u00b7 Jest'],
];

const COPY: Record<Lang, { technologies: string; cards: Card[] }> = {
  en: {
    technologies: 'Technologies',
    cards: [
      {
        title: 'Backend',
        desc: 'Typed services with the contract enforced at the edge, not assumed. REST surfaces designed so the auth story and the data story never drift apart.',
        skills: SKILLS[0],
      },
      {
        title: 'Data',
        desc: 'Relational schemas that stay honest under growth, with vector search living beside the rows it describes rather than in a separate system to keep in sync.',
        skills: SKILLS[1],
      },
      {
        title: 'Applied AI',
        desc: 'LLMs wired into real products: grounded in live data through fixed, user-scoped tool menus, and measured on outcomes rather than demos.',
        skills: SKILLS[2],
      },
      {
        title: 'Frontend',
        desc: 'Interfaces that make a system legible \u2014 showing what ran unattended, what a person decided, and where the line between them falls.',
        skills: SKILLS[3],
      },
      {
        title: 'Infrastructure',
        desc: 'Pipelines, background jobs and observability set up so a nightly autonomous loop can be trusted to run without anyone watching it.',
        skills: SKILLS[4],
      },
      {
        title: 'Languages',
        desc: 'Working across four languages, currently building a technical vocabulary in German while based in Berlin.',
        skills: ['Arabic \u2014 native', 'French \u2014 C1', 'English \u2014 C1, TOEFL iBT', 'German \u2014 A1, learning'],
      },
    ],
  },
  fr: {
    technologies: 'Technologies',
    cards: [
      {
        title: 'Backend',
        desc: 'Des services typ\u00e9s dont le contrat est v\u00e9rifi\u00e9 \u00e0 la fronti\u00e8re, pas suppos\u00e9. Des API REST con\u00e7ues pour que la logique d\u2019authentification et celle des donn\u00e9es ne divergent jamais.',
        skills: SKILLS[0],
      },
      {
        title: 'Donn\u00e9es',
        desc: 'Des sch\u00e9mas relationnels qui tiennent \u00e0 l\u2019\u00e9chelle, avec la recherche vectorielle log\u00e9e \u00e0 c\u00f4t\u00e9 des lignes qu\u2019elle d\u00e9crit plut\u00f4t que dans un syst\u00e8me \u00e0 synchroniser.',
        skills: SKILLS[1],
      },
      {
        title: 'IA appliqu\u00e9e',
        desc: 'Des LLM branch\u00e9s \u00e0 de vrais produits : ancr\u00e9s dans les donn\u00e9es r\u00e9elles via des menus d\u2019outils fixes et limit\u00e9s \u00e0 l\u2019utilisateur, et mesur\u00e9s sur des r\u00e9sultats plut\u00f4t que sur des d\u00e9mos.',
        skills: SKILLS[2],
      },
      {
        title: 'Frontend',
        desc: 'Des interfaces qui rendent le syst\u00e8me lisible \u2014 ce qui a tourn\u00e9 sans supervision, ce qu\u2019une personne a d\u00e9cid\u00e9, et o\u00f9 passe la fronti\u00e8re entre les deux.',
        skills: SKILLS[3],
      },
      {
        title: 'Infrastructure',
        desc: 'Pipelines, t\u00e2ches de fond et observabilit\u00e9 mis en place pour qu\u2019une boucle autonome nocturne puisse tourner sans que personne ne la surveille.',
        skills: SKILLS[4],
      },
      {
        title: 'Langues',
        desc: 'Je travaille en quatre langues et construis actuellement un vocabulaire technique en allemand depuis Berlin.',
        skills: ['Arabe \u2014 langue maternelle', 'Fran\u00e7ais \u2014 C1', 'Anglais \u2014 C1, TOEFL iBT', 'Allemand \u2014 A1, en cours'],
      },
    ],
  },
};

export function ExpertiseSection() {
  const ref = useSectionInView(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useCopy(COPY);
  const cards = t.cards;
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(cards.length - 1, Math.floor(latest * cards.length * 0.999));
    if (index !== activeIndex) setActiveIndex(index);
  });

  const transitionSpec = {
    duration: shouldReduceMotion ? 0 : 0.65,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <section id="expertise" ref={ref as React.RefObject<HTMLElement>} className="relative bg-background">
      {/* Height scales with card count so each step stays readable while scrolling */}
      <div ref={containerRef} style={{ height: `${cards.length * 85}vh` }} className="relative">
        <div className="sticky top-0 h-screen h-[100dvh] w-full flex items-center justify-center overflow-hidden">
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
                    {Array.from({ length: cards.length }, (_, i) => i + 1).map((num) => (
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
                        {cards[activeIndex].title}
                      </h3>
                      <p className="mt-2 md:mt-4 text-white/60 font-sans text-xs sm:text-sm md:text-base leading-relaxed">
                        {cards[activeIndex].desc}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <div className="text-[12px] md:text-xs font-sans tracking-widest text-white/30 mb-2 md:mb-4 uppercase border-b border-white/10 pb-2 md:pb-4">
                        {t.technologies}
                      </div>
                      <ul className="flex flex-col">
                        {cards[activeIndex].skills.map((skill, i) => (
                          <li
                            key={skill}
                            className="flex items-center justify-between gap-4 py-2 md:py-3 border-b border-white/5 last:border-b-0 text-[12px] md:text-sm font-sans tracking-wide text-white/80"
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
