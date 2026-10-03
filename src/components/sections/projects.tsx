import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { Lock, Play } from 'lucide-react';
import { useSectionInView } from '@/lib/use-section-in-view';
import { SectionHeader } from '@/components/ui/section-header';
import { Watermark } from '@/components/ui/watermark';
import { cn } from '@/lib/utils';

type Feature = { text: string; highlight: string[] };

type Project = {
  title: string;
  tag: string;
  descA: string;
  descB: string;
  features: Feature[];
  tech: string[];
  /** Pages the project is split across while the section is pinned. */
  featureGroups: number[];
  videoId?: string;
  poster?: { src: string; webp?: string; width: number; height: number; alt: string; portrait?: boolean };
  links?: { label: string; href: string }[];
  note?: string;
};

const PROJECTS: Project[] = [
  {
    title: 'SmartPilot',
    tag: 'Flagship · recash',
    descA:
      'An autonomous deal engine closing a four-stage loop: nightly inventory health scoring, AI-mediated price negotiation, targeted deal distribution, and a feedback-driven learning loop.',
    descB:
      'Autonomy and human oversight stay separable concerns — no price reaches the catalogue without a human decision stamped on the record it concerns.',
    features: [
      {
        text: '200 products scored nightly; 61 pricing opportunities queued with no manual initiation.',
        highlight: ['200', '61'],
      },
      {
        text: 'Three-signal hybrid semantic search — pgvector embeddings, PostgreSQL full-text and keyword ranking — shipped to production, returning relevant results for queries sharing no literal words with the listing.',
        highlight: ['pgvector', 'PostgreSQL full-text'],
      },
      {
        text: 'Behavioural recommendation engine with a per-buyer taste vector and a 25–35% discovery fraction under an enforced brand-diversity floor; later inverted to match live deals to the buyers most likely to want them.',
        highlight: ['25–35%'],
      },
      {
        text: 'Learning loop adjusting matching weights nightly within fixed safety bounds — moved the size-fit weight from 0.10 to 0.42 autonomously, never overwriting a human-set value.',
        highlight: ['0.10', '0.42'],
      },
      {
        text: 'Agentic AI assistant, Claude via the Vercel AI SDK, grounded in live data through a fixed, user-scoped tool menu.',
        highlight: ['Claude', 'Vercel AI SDK'],
      },
      {
        text: 'Production eBay connector; code-complete Shopify Admin and Amazon SP-API integrations.',
        highlight: ['eBay', 'Shopify Admin', 'Amazon SP-API'],
      },
    ],
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Drizzle ORM', 'pgvector', 'Trigger.dev', 'Claude API', 'Vercel'],
    featureGroups: [2, 2, 2],
    note: 'Company code, not public. I can walk through it in an interview.',
  },
  {
    title: 'MASMEDIA AIDITOR',
    tag: 'AI Journalism',
    descA:
      'An AI journalism platform built solo across two modules: real-time livestream coverage, and a configurable scraper over 30 tech sources.',
    descB: '',
    features: [
      {
        text: 'PARROT covers livestreams end to end: Streamlink audio into AssemblyAI streaming transcription, GPT-4 key-moment detection, then multi-platform content generation. 3.2 s latency at 84% precision.',
        highlight: ['AssemblyAI', 'GPT-4', '3.2 s', '84%'],
      },
      {
        text: 'Validated live: 8 of 8 announcements caught on an Apple keynote with a 73% cut in coverage time, and 15 of 16 on Google I/O.',
        highlight: ['8 of 8', '73%', '15 of 16'],
      },
      {
        text: 'SWALLO scrapes 30 tech sources with GPT-4 relevance filtering: 1,247 articles in a seven-day run at 84% precision.',
        highlight: ['1,247', '84%'],
      },
      {
        text: 'Event coverage dropped from 4h30 to 1h20; daily monitoring from 4 hours to 12 minutes; three people per live event to one.',
        highlight: ['4h30', '1h20', '12 minutes'],
      },
      {
        text: 'Social publishing over OAuth 2.0 with encrypted token storage; a response cache cut GPT-4 spend 35%.',
        highlight: ['OAuth 2.0', '35%'],
      },
      {
        text: '95 tests at 88% coverage with Jest, Supertest and in-memory MongoDB.',
        highlight: ['95', '88%', 'Jest'],
      },
    ],
    tech: ['NestJS', 'TypeScript', 'MongoDB', 'GPT-4', 'AssemblyAI', 'FFmpeg', 'Docker'],
    featureGroups: [3, 3],
    videoId: 'aoA7SMIzSG4',
    poster: {
      src: '/img/masmedia-800.jpg',
      webp: '/img/masmedia-800.webp',
      width: 1280,
      height: 634,
      alt: 'The MASMEDIA AIDITOR dashboard: a generated article draft beside per-platform Twitter, Instagram and Facebook post panels.',
    },
  },
  {
    title: 'Kiddo AI',
    tag: 'Education',
    descA:
      'An educational app for six-year-olds: an AI tutor speaking Tunisian Arabic, with cloned voice synthesis and avatar personalisation.',
    descB: '',
    features: [
      {
        text: 'Five-person academic team; I was principal author of the Flutter client’s second version — roughly 3,100 of its 4,400 lines.',
        highlight: ['3,100', '4,400'],
      },
      {
        text: 'Restructured the client onto MVVM with a dedicated service layer, replacing view-embedded state and network calls.',
        highlight: ['MVVM'],
      },
      {
        text: 'Built the voice pipeline end to end: cloned speech synthesis in Tunisian Arabic, plus avatar personalisation the child picks.',
        highlight: ['Tunisian Arabic'],
      },
    ],
    tech: ['Flutter', 'Dart', 'RAG', 'Voice cloning', 'MVVM'],
    featureGroups: [3],
    videoId: 'NfDOhjPF7VM',
    poster: {
      src: '/img/kiddoai-290.jpg',
      webp: '/img/kiddoai-290.webp',
      width: 290,
      height: 720,
      alt: 'The Kiddo AI writing board on a phone, with handwritten Arabic traced across ruled guidelines.',
      portrait: true,
    },
    links: [{ label: 'Flutter client', href: 'https://github.com/achreflajmi/KiddoAI-Front' }],
  },
  {
    title: 'MoodyMap',
    tag: 'iOS · SwiftUI',
    descA:
      'A SwiftUI study planner that reads how the day actually went and plans around it. 10 screens, 18 endpoints, about 5,000 lines of Swift.',
    descB: '',
    features: [
      {
        text: 'Hand-built RFC 2388 multipart image upload for server-side emotion detection, without pulling in a networking dependency.',
        highlight: ['RFC 2388'],
      },
      {
        text: 'Camera and photo-library permission bridging, with concurrent home-screen loading through withTaskGroup.',
        highlight: ['withTaskGroup'],
      },
      {
        text: 'LLM study-plan prose parsed into a checkable task list, so the model’s output becomes something the student can actually tick off.',
        highlight: ['LLM'],
      },
    ],
    tech: ['SwiftUI', 'Swift Concurrency', 'REST', 'Emotion detection'],
    featureGroups: [3],
    videoId: 'S_biZwKb0QQ',
    poster: {
      src: '/img/moodymap-240.jpg',
      webp: '/img/moodymap-240.webp',
      width: 240,
      height: 360,
      alt: 'The MoodyMap check-in screen on an iPhone, asking how well the user could concentrate today with four graded answers.',
      portrait: true,
    },
    links: [{ label: 'iOS app', href: 'https://github.com/achreflajmi/FrontIOSMoodyMap' }],
  },
  {
    title: 'SUF’ESS',
    tag: 'Hackathon · 24h',
    descA:
      'A 24-hour hackathon MVP: location-based cultural storytelling with prototype AI guided tours.',
    descB: '',
    features: [
      {
        text: 'Built in FlutterFlow with RAG, 3D assets and geolocation — scoped hard so a working demo existed before the clock ran out.',
        highlight: ['FlutterFlow', 'RAG', '3D', 'geolocation'],
      },
    ],
    tech: ['FlutterFlow', 'RAG', 'Geolocation', '3D'],
    featureGroups: [1],
    videoId: 'NwJ0WE14vEM',
    poster: {
      src: '/img/sufess-800.jpg',
      webp: '/img/sufess-800.webp',
      width: 960,
      height: 720,
      alt: "The SUF'ESS guided-tour screen on a phone, showing a Roman fountain beside an illustrated narrator.",
    },
  },
];

/* Slots are generated from each project's featureGroups configuration. */
const SCROLL_SLOTS = PROJECTS.flatMap((proj, projIdx) =>
  proj.featureGroups.map((_, page) => ({ projIdx, page })),
);
const TOTAL_SLOTS = SCROLL_SLOTS.length;

/* ─── Feature text renderer (highlights keywords in cyan) ─────── */
function FeatureText({ text, highlight }: Feature) {
  if (!highlight.length) return <span className="block">{text}</span>;

  const escaped = highlight.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className="block">
      {parts.map((part, i) =>
        highlight.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
          <span key={i} className="text-primary font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}

/* ─── Media panel: poster until clicked, then the real embed ──── */
function ProjectMedia({ proj, compact }: { proj: Project; compact?: boolean }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-background/40 backdrop-blur-md flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />

      {/* Confidential work gets a built panel instead of a demo */}
      {!proj.videoId && (
        <div className="relative z-10 flex flex-col items-center gap-5 px-8 text-center">
          <div className="w-16 h-16 rounded-full border border-gate/40 bg-gate/5 flex items-center justify-center text-gate">
            <Lock className="w-6 h-6" aria-hidden="true" />
          </div>
          <p className="font-sans text-sm text-white/55 max-w-xs leading-relaxed">{proj.note}</p>
          <dl className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-4 border-t border-white/10">
            {[
              { k: 'Scored nightly', v: '200' },
              { k: 'Deals queued', v: '61' },
              { k: 'Weight moved', v: '0.10→0.42' },
            ].map((f) => (
              <div key={f.k} className="flex flex-col gap-1">
                <dd className="font-sans font-light text-xl text-primary leading-none">{f.v}</dd>
                <dt className="font-sans text-[9px] tracking-widest uppercase text-white/35">{f.k}</dt>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Poster + play */}
      {proj.videoId && !playing && proj.poster && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 z-10 group cursor-pointer"
        >
          <picture>
            {proj.poster.webp && <source type="image/webp" srcSet={proj.poster.webp} />}
            <img
              src={proj.poster.src}
              width={proj.poster.width}
              height={proj.poster.height}
              loading="lazy"
              decoding="async"
              alt={proj.poster.alt}
              className={cn(
                'w-full h-full',
                proj.poster.portrait ? 'object-contain py-4' : 'object-cover',
              )}
            />
          </picture>
          <span className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-500" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/25 bg-background/60 backdrop-blur-xl flex items-center justify-center text-white group-hover:border-primary group-hover:text-primary group-hover:scale-110 transition-all duration-300">
            <Play className={compact ? 'w-6 h-6 ml-1' : 'w-8 h-8 ml-1'} aria-hidden="true" />
          </span>
          <span className="sr-only">Play the {proj.title} demo</span>
        </button>
      )}

      {proj.videoId && playing && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${proj.videoId}?rel=0&autoplay=1`}
          title={`${proj.title} demo video`}
          className="absolute inset-0 w-full h-full z-20"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
    </div>
  );
}

/* ─── Desktop content card ───────────────────────────────────── */
function DesktopCard({
  proj,
  page,
  transitionSpec,
  shouldReduceMotion,
}: {
  proj: Project;
  page: number;
  transitionSpec: object;
  shouldReduceMotion: boolean | null;
}) {
  const startIndex = proj.featureGroups.slice(0, page).reduce((sum, count) => sum + count, 0);
  const visibleCount = proj.featureGroups[page] ?? proj.features.length;
  const currentFeatures = proj.features.slice(startIndex, startIndex + visibleCount);
  const currentDesc = page === 0 ? proj.descA : proj.descB;

  return (
    <motion.div
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -40 }}
      transition={transitionSpec}
      className="absolute inset-0 w-full flex flex-col justify-start pt-2"
    >
      {page === 0 ? (
        <div className="flex flex-col gap-2 mb-4">
          <p className="font-sans text-[10px] tracking-widest uppercase text-primary">{proj.tag}</p>
          <h3
            className="font-sans font-light text-3xl md:text-4xl lg:text-5xl leading-tight text-white"
            translate="no"
          >
            {proj.title}
          </h3>
        </div>
      ) : (
        <h3 className="font-sans font-light text-2xl leading-tight text-white/60 mb-3" translate="no">
          {proj.title}
          <span className="text-primary text-sm font-sans tracking-widest uppercase ml-3">cont.</span>
        </h3>
      )}

      {currentDesc && (
        <p className="text-white/60 font-sans text-sm leading-snug mb-5">{currentDesc}</p>
      )}

      <div className="flex flex-col mb-3">
        {currentFeatures.map((feat, i) => (
          <div
            key={i}
            className="py-2.5 border-b border-white/10 text-sm md:text-[0.95rem] font-sans leading-relaxed text-white/80"
          >
            <FeatureText text={feat.text} highlight={feat.highlight} />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-auto pt-4">
        {proj.tech.map((t) => (
          <span
            key={t}
            className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 font-mono text-[11px] text-primary/90 leading-none"
          >
            {t}
          </span>
        ))}
      </div>

      {proj.links && (
        <div className="flex flex-wrap gap-4 mt-4">
          {proj.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs tracking-widest uppercase text-white/70 underline underline-offset-4 decoration-white/25 hover:text-primary hover:decoration-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────── */
export function ProjectsSection() {
  const ref = useSectionInView(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [activeSlot, setActiveSlot] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const slot = Math.min(TOTAL_SLOTS - 1, Math.floor(latest * TOTAL_SLOTS * 0.999));
    if (slot !== activeSlot) setActiveSlot(slot);
  });

  const transitionSpec = {
    duration: shouldReduceMotion ? 0 : 0.65,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  const { projIdx, page } = SCROLL_SLOTS[activeSlot];
  const activeProj = PROJECTS[projIdx];

  return (
    <section id="projects" ref={ref as React.RefObject<HTMLElement>} className="relative bg-background">
      {/* ── DESKTOP: pinned scroll ── */}
      <div
        ref={containerRef}
        style={{ height: `${TOTAL_SLOTS * 90}vh` }}
        className="hidden lg:block relative"
      >
        <div className="sticky top-0 h-screen w-full flex items-start justify-center overflow-hidden pt-14 pb-10">
          {/* Giant background odometer */}
          <Watermark className="text-[35vw] md:text-[40vw] text-transparent">
            <span className="text-white/[0.04]">0</span>
            <div className="h-[0.8em] overflow-hidden relative text-white/[0.06] font-sans font-light">
              <motion.div
                animate={{ y: `calc(-${projIdx} * 0.8em)` }}
                transition={transitionSpec}
                className="flex flex-col"
              >
                {Array.from({ length: PROJECTS.length }, (_, i) => i + 1).map((num) => (
                  <div key={num} className="h-[0.8em] flex items-center justify-center pb-2">
                    {num}
                  </div>
                ))}
              </motion.div>
            </div>
          </Watermark>

          <div className="w-full max-w-[90rem] mx-auto px-12 lg:px-24 flex flex-row items-center justify-between gap-16 xl:gap-24 relative z-10 h-full">
            {/* LEFT: media */}
            <div className="flex-1 w-full">
              <ProjectMedia key={activeProj.title} proj={activeProj} />
            </div>

            {/* RIGHT: content */}
            <div className="w-[460px] xl:w-[510px] shrink-0">
              <div className="relative h-[520px] w-full">
                <AnimatePresence mode="popLayout">
                  <DesktopCard
                    key={activeSlot}
                    proj={activeProj}
                    page={page}
                    transitionSpec={transitionSpec}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: stacked ── */}
      <div className="block lg:hidden py-32 px-6 md:px-12 relative z-10 w-full max-w-3xl mx-auto">
        <SectionHeader subtitle="Selected works" title="Things I built" />

        <div className="flex flex-col gap-28">
          {PROJECTS.map((proj, idx) => (
            <div key={proj.title} className="flex flex-col gap-7">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-primary/50 font-sans font-light text-3xl leading-none tracking-tighter">
                    0{idx + 1}
                  </span>
                  <h3
                    className="font-sans font-light text-3xl md:text-4xl leading-tight text-white"
                    translate="no"
                  >
                    {proj.title}
                  </h3>
                </div>
                <p className="font-sans text-[10px] tracking-widest uppercase text-primary mt-2">
                  {proj.tag}
                </p>
                <p className="text-white/55 font-sans text-sm leading-relaxed mt-2">{proj.descA}</p>
                {proj.descB && (
                  <p className="text-white/45 font-sans text-sm leading-relaxed mt-1">{proj.descB}</p>
                )}
              </div>

              <ProjectMedia proj={proj} compact />

              <div className="flex flex-wrap gap-2">
                {proj.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 font-mono text-[11px] text-primary/90 leading-none"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-col">
                {proj.features.map((feat, i) => (
                  <div
                    key={i}
                    className="py-3 border-b border-white/10 text-sm font-sans leading-relaxed text-white/75 flex items-start gap-2"
                  >
                    <span className="text-primary/50 shrink-0 mt-0.5" aria-hidden="true">
                      —
                    </span>
                    <FeatureText text={feat.text} highlight={feat.highlight} />
                  </div>
                ))}
              </div>

              {proj.links && (
                <div className="flex flex-wrap gap-4">
                  {proj.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-xs tracking-widest uppercase text-white/70 underline underline-offset-4 decoration-white/25 hover:text-primary transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
