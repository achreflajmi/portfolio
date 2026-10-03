import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

/** Drop your cut-out photo at public/portrait.png and it appears here.
 *  Until it exists the hero composes fine without it. */
const PORTRAIT_SRC = '/portrait.png';

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

/* ─── Hero Section ────────────────────────────────────────────── */
export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const [hasPortrait, setHasPortrait] = useState(true);
  const transitionSpec = {
    duration: shouldReduceMotion ? 0 : 0.8,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[640px] flex flex-col overflow-hidden bg-background"
    >
      {/* Cinematic background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(94,216,240,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_30%,rgba(245,165,36,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
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

      {/* Body — text anchored top-left, portrait fills the right */}
      <div className="relative z-20 flex-1 w-full max-w-[90rem] mx-auto px-6 md:px-12 flex">
        <div className="flex flex-col lg:flex-row items-start justify-between w-full h-full">
          {/* ── Left column ── */}
          <div className="w-full lg:w-[58%] xl:w-[55%] flex flex-col justify-between h-full pt-10 md:pt-14 pb-10 md:pb-14 z-20">
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
                Available now · Berlin
              </p>

              <h1 className="font-sans font-light tracking-tight text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] leading-[1.06] text-white mb-6">
                I build systems <br />
                that decide{' '}
                <span className="text-primary italic font-serif tracking-normal">on their own</span>,{' '}
                <br />
                inside limits{' '}
                <span className="text-gate italic font-serif tracking-normal">a human</span> sets.
              </h1>

              <p className="font-sans text-white/55 text-sm max-w-sm leading-relaxed">
                Backend, full-stack and applied AI. Most recently at{' '}
                <b className="text-white/80 font-medium" translate="no">recash</b> in Munich, as the
                only engineer on the platform&rsquo;s AI layer.
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

            {/* Scroll indicator — bottom-anchored */}
            <div className="hidden md:flex items-end gap-5">
              <ScrollIndicator />
            </div>
          </div>

          {/* ── Portrait ── */}
          {hasPortrait && (
            <motion.div
              className="absolute lg:relative bottom-0 right-0 w-[95%] sm:w-[70%] lg:w-[53%] h-[88%] lg:h-full flex items-end justify-end pointer-events-none z-10 opacity-40 lg:opacity-100"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: shouldReduceMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={PORTRAIT_SRC}
                alt="Achref Lajmi"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onError={() => setHasPortrait(false)}
                className="w-auto h-full object-contain object-bottom origin-bottom"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
