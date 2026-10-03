import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Scroll Indicator ────────────────────────────────────────── */
function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 select-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Mouse capsule */}
      <motion.div
        className="relative w-[26px] h-[42px] rounded-full border-2 border-white/40 flex items-start justify-center pt-[6px]"
        animate={{
          borderColor: ['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.25)'],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.span
          className="block w-[5px] h-[5px] rounded-full bg-white"
          animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.span
        className="font-sans text-[9px] uppercase text-white/40"
        style={{ writingMode: 'vertical-rl', letterSpacing: '0.2em' }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Scroll
      </motion.span>
    </motion.div>
  );
}

/* ─── SmartPilot loop — the hero's visual anchor ──────────────── */
const LOOP_STAGES = [
  {
    marker: '1',
    label: 'Score inventory',
    fact: '200 products scored nightly for inventory health.',
    gate: false,
  },
  {
    marker: '2',
    label: 'Negotiate price',
    fact: '61 pricing opportunities queued, none manually initiated.',
    gate: false,
  },
  {
    marker: '■',
    label: 'A human decides',
    fact: 'The loop halts. Nothing reaches the catalogue until a person has decided.',
    gate: true,
  },
  {
    marker: '3',
    label: 'Distribute deals',
    fact: 'Live deals matched to the buyers most likely to want them.',
    gate: false,
  },
  {
    marker: '4',
    label: 'Learn from the outcome',
    fact: 'Weights adjust nightly inside fixed bounds. Size-fit moved 0.10 → 0.42 on its own.',
    gate: false,
  },
];

function SmartPilotLoop({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-background/60 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_8px_48px_rgba(0,0,0,0.6)] relative overflow-hidden">
      {/* Ambient wash */}
      <div className="absolute -top-20 -right-16 w-56 h-56 rounded-full bg-primary/15 blur-[80px] pointer-events-none" />

      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6 relative">
        <span className="font-sans text-sm tracking-widest uppercase text-white/90" translate="no">
          SmartPilot
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-primary/80">
          one nightly cycle
        </span>
      </div>

      <ol className="flex flex-col relative">
        {/* Track line behind the markers */}
        <span className="absolute left-[13px] top-3 bottom-8 w-px bg-white/10" aria-hidden="true" />

        {/* Travelling pulse — the system running unattended */}
        {!shouldReduceMotion && (
          <motion.span
            aria-hidden="true"
            className="absolute left-[11px] w-[5px] h-[5px] rounded-full bg-primary shadow-[0_0_10px_rgba(94,216,240,0.9)]"
            animate={{ top: ['0.75rem', '92%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.1, 0.9, 1] }}
          />
        )}

        {LOOP_STAGES.map((stage, i) => (
          <motion.li
            key={stage.label}
            className="relative flex gap-4 pb-5 last:pb-0"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              delay: shouldReduceMotion ? 0 : 0.45 + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span
              aria-hidden="true"
              className={cn(
                'relative z-10 shrink-0 w-[27px] h-[27px] rounded-full border flex items-center justify-center font-mono text-[11px] bg-background',
                stage.gate
                  ? 'border-gate text-gate shadow-[0_0_14px_rgba(245,165,36,0.35)]'
                  : 'border-primary/50 text-primary',
              )}
            >
              {stage.marker}
            </span>

            <div className="flex flex-col gap-1 pt-0.5">
              <p
                className={cn(
                  'font-sans text-sm tracking-wide',
                  stage.gate ? 'text-gate' : 'text-white/90',
                )}
              >
                {stage.label}
              </p>
              <p className="font-sans text-xs leading-relaxed text-white/45">{stage.fact}</p>
            </div>
          </motion.li>
        ))}
      </ol>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[10px] tracking-widest uppercase text-white/40">
        <span className="flex items-center gap-2">
          <i className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
          Runs unattended
        </span>
        <span className="flex items-center gap-2">
          <i className="w-2 h-2 rounded-full bg-gate" aria-hidden="true" />
          A person decided
        </span>
      </div>
    </div>
  );
}

/* ─── Hero Section ────────────────────────────────────────────── */
export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const transitionSpec = {
    duration: shouldReduceMotion ? 0 : 0.8,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col overflow-hidden bg-background"
    >
      {/* Cinematic background — built, not photographed */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(94,216,240,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_30%,rgba(245,165,36,0.07),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
        {/* Faint engineering grid */}
        <div
          className="absolute inset-0 opacity-[0.17]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent 75%)',
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-30 w-full px-6 md:px-12 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/5">
        <a
          href="#home"
          className="flex items-center gap-2 font-display text-xl tracking-widest text-white uppercase"
          translate="no"
        >
          <Terminal className="w-4 h-4 text-primary" aria-hidden="true" />
          Achref Lajmi
        </a>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans text-xs tracking-widest uppercase text-white/60">
          <a href="#experience" className="hover:text-white transition-colors">Work</a>
          <a href="#expertise" className="hover:text-white transition-colors">Expertise</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#education" className="hover:text-white transition-colors">Education</a>
          <a href="#writing" className="hover:text-white transition-colors">Writing</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        <a
          href="/cv/Achref_Lajmi_Backend.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-white hover:text-primary transition-colors group shrink-0"
        >
          <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-primary">
            Download CV
          </span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </a>
      </nav>

      {/* Body */}
      <div className="relative z-20 flex-1 w-full max-w-[90rem] mx-auto px-6 md:px-12 flex items-center lg:pb-28">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-16 w-full">
          {/* ── Left column ── */}
          <div className="w-full lg:w-[52%] flex flex-col pt-12 md:pt-16 pb-10 lg:pb-16 z-20">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transitionSpec, delay: 0.15 }}
            >
              {/* Availability */}
              <p className="flex items-center gap-2.5 font-sans text-[11px] tracking-widest uppercase text-white/50 mb-7">
                <span className="relative flex w-2 h-2" aria-hidden="true">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-primary opacity-60 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
                </span>
                Available now · Berlin · open to relocation across Europe
              </p>

              <h1 className="font-sans font-light tracking-tight text-[2.6rem] sm:text-5xl lg:text-[3.9rem] xl:text-[4.4rem] leading-[1.07] text-white mb-7">
                I build systems <br />
                that decide{' '}
                <span className="text-primary italic font-display tracking-normal">
                  on their own
                </span>
                , <br />
                inside limits{' '}
                <span className="text-gate italic font-display tracking-normal">a human</span> sets.
              </h1>

              <p className="font-sans text-white/55 text-sm md:text-base max-w-md leading-relaxed">
                Backend, full-stack and applied AI. Most recently at{' '}
                <b className="text-white/80 font-medium" translate="no">recash</b> in Munich, as the
                only engineer on the platform&rsquo;s AI layer, where I shipped an autonomous deal
                engine end to end.
              </p>

              {/* Hard numbers */}
              <dl className="flex flex-wrap gap-x-10 gap-y-4 mt-9">
                {[
                  { v: '24', k: 'sprints, continuous deployment' },
                  { v: '9', k: 'person startup' },
                  { v: 'Très Bien', k: 'ESPRIT, 2026' },
                ].map((stat) => (
                  <div key={stat.k} className="flex flex-col gap-1">
                    <dd className="font-sans font-light text-2xl md:text-3xl text-white leading-none">
                      {stat.v}
                    </dd>
                    <dt className="font-sans text-[10px] tracking-widest uppercase text-white/35">
                      {stat.k}
                    </dt>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>

          {/* ── Right column: the loop ── */}
          <motion.div
            className="w-full lg:w-[44%] flex items-center lg:self-center pb-16 lg:pb-0"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: shouldReduceMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <SmartPilotLoop shouldReduceMotion={shouldReduceMotion} />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue — anchored to the hero's bottom edge, clear of both columns */}
      <div className="hidden lg:block absolute bottom-10 left-6 md:left-12 z-30">
        <ScrollIndicator />
      </div>
    </section>
  );
}
