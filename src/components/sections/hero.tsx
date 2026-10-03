import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cvHref, useCopy, useLang, type Lang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

const COPY: Record<Lang, {
  nav: [string, string][];
  cv: string;
  menu: string;
  close: string;
  scroll: string;
  line1: string;
  line2a: string;
  accent: string;
  line2b: string;
  line3: string;
  subhead: string;
}> = {
  en: {
    nav: [
      ['#experience', 'Work'],
      ['#expertise', 'Expertise'],
      ['#projects', 'Projects'],
      ['#education', 'Education'],
      ['#writing', 'Writing'],
      ['#contact', 'Contact'],
    ],
    cv: 'Download CV',
    menu: 'Open menu',
    close: 'Close menu',
    scroll: 'Scroll',
    line1: 'Building systems',
    line2a: 'that ',
    accent: 'survive',
    line2b: ' contact',
    line3: 'with production.',
    subhead:
      'Backend, full-stack and applied AI, based in Berlin. Most recently the only engineer on the AI layer of a B2B marketplace in Munich.',
  },
  fr: {
    nav: [
      ['#experience', 'Parcours'],
      ['#expertise', 'Expertise'],
      ['#projects', 'Projets'],
      ['#education', 'Formation'],
      ['#writing', 'Articles'],
      ['#contact', 'Contact'],
    ],
    cv: 'T\u00e9l\u00e9charger le CV',
    menu: 'Ouvrir le menu',
    close: 'Fermer le menu',
    scroll: 'D\u00e9filer',
    line1: 'Je con\u00e7ois des syst\u00e8mes',
    line2a: 'qui ',
    accent: 'survivent',
    line2b: ' au contact',
    line3: 'de la production.',
    subhead:
      'Backend, full-stack et IA appliqu\u00e9e, bas\u00e9 \u00e0 Berlin. Derni\u00e8rement seul ing\u00e9nieur sur la couche IA d\u2019une marketplace B2B \u00e0 Munich.',
  },
};

/* The toggle lives in the nav; each side is a real link so the language is
   shareable and indexable, not just client state. */
function LangToggle() {
  const lang = useLang();

  const OPTIONS: [Lang, string, string, string][] = [
    ['en', '/', 'EN', 'English'],
    ['fr', '/fr', 'FR', 'Fran\u00e7ais'],
  ];

  return (
    <div
      className="flex items-center rounded-full border border-white/15 overflow-hidden shrink-0"
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map(([code, href, label, full]) => (
        <Link
          key={code}
          href={href}
          aria-current={lang === code ? 'true' : undefined}
          className={cn(
            'flex items-center justify-center min-w-[44px] min-h-[44px] px-3 font-sans text-xs tracking-widest uppercase transition-colors',
            lang === code ? 'bg-primary text-primary-foreground' : 'text-white/50 hover:text-white',
          )}
        >
          <span aria-hidden="true">{label}</span>
          <span className="sr-only">{full}</span>
        </Link>
      ))}
    </div>
  );
}

/* ─── Scroll Indicator ────────────────────────────────────────── */
function ScrollIndicator({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <motion.div
        className="relative w-[26px] h-[42px] rounded-full border-2 border-white/30 flex items-start justify-center pt-[6px]"
        animate={{
          borderColor: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.2)'],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.span
          className="block w-[5px] h-[5px] rounded-full bg-white"
          animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <span
        className="font-sans text-[11px] lg:text-[9px] uppercase text-white/35"
        style={{ writingMode: 'vertical-rl', letterSpacing: '0.2em' }}
      >
        {label}
      </span>
    </div>
  );
}


/* Full-screen sheet for phones and tablets. Locks the page behind it and
   closes on Escape, on backdrop tap, and on any link — a hash link would
   otherwise leave the overlay covering the section it jumped to. */
function MobileMenu({
  open,
  onClose,
  t,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  t: (typeof COPY)['en'];
  lang: Lang;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden bg-background/97 backdrop-blur-xl flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
          >
            <span className="flex items-center gap-2 font-display text-base tracking-[0.18em] text-white uppercase" translate="no">
              <img
                src="/img/avatar-96.png"
                alt=""
                width={96}
                height={96}
                className="w-7 h-7 rounded-full shrink-0 ring-1 ring-primary/30"
              />
              Achref Lajmi
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-white/80"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-6 gap-1">
            {t.nav.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={onClose}
                className="font-sans font-light text-3xl sm:text-4xl text-white/85 hover:text-primary transition-colors py-3"
              >
                {label}
              </a>
            ))}
          </nav>

          <div
            className="px-6 pb-8 pt-4 border-t border-white/10"
            style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
          >
            <a
              href={cvHref(lang)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full min-h-[52px] rounded-full bg-primary text-primary-foreground font-sans text-xs tracking-widest uppercase font-medium"
            >
              {t.cv}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Hero Section ────────────────────────────────────────────── */
export function HeroSection() {
  const reduce = useReducedMotion();
  const lang = useLang();
  const t = useCopy(COPY);
  const [menuOpen, setMenuOpen] = useState(false);

  /* The section's only motion: the three headline lines rise in sequence,
     with the portrait and its light settling in behind them. */
  const rise = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : '0.55em' },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.95,
      delay: reduce ? 0 : 0.3 + i * 0.13,
      ease: EASE,
    },
  });

  return (
    <section
      id="home"
      className="relative w-full min-h-screen min-h-[100dvh] lg:h-screen lg:h-[100dvh] lg:min-h-[680px] flex flex-col overflow-hidden bg-background"
    >
      {/* ── Portrait: full-bleed to the top and right edges, no frame. Its
             left edge is masked away so it dissolves into the background
             instead of sitting on it. ── */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 right-0 h-full w-full md:w-[58%] lg:w-[62%] xl:w-[58%] pointer-events-none"
        initial={{ opacity: 0, scale: reduce ? 1 : 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduce ? 0 : 1.6, ease: EASE }}
      >
        <picture>
          <source media="(min-width: 1536px)" srcSet="/img/hero-1812.webp" type="image/webp" />
          <source media="(min-width: 768px)" srcSet="/img/hero-1400.webp" type="image/webp" />
          <source srcSet="/img/hero-900.webp" type="image/webp" />
          <img
            src="/img/hero-1400.jpg"
            alt=""
            width={1812}
            height={868}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-[64%_12%] md:object-[62%_18%]"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.25) 14%, rgba(0,0,0,0.85) 34%, black 52%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.25) 14%, rgba(0,0,0,0.85) 34%, black 52%)',
            }}
          />
        </picture>
      </motion.div>

      {/* ── One palette, committed: a cool cyan-to-indigo light sitting behind
             the portrait and bleeding left across the frame. ── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 1.8, ease: EASE }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(58% 70% at 74% 26%, rgba(94,216,240,0.20), transparent 62%)',
              'radial-gradient(52% 64% at 96% 76%, rgba(63,94,214,0.22), transparent 66%)',
              'radial-gradient(70% 90% at 50% 100%, rgba(26,38,82,0.30), transparent 70%)',
            ].join(','),
          }}
        />

        {/* Darkening scrim so the text always lands on the darkest ground.
            Flat on small screens where the copy spans the whole frame. */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(to bottom, rgb(8 8 8 / 0.30) 0%, rgb(8 8 8 / 0.22) 26%, rgb(8 8 8 / 0.62) 48%, rgb(8 8 8 / 0.93) 66%, rgb(8 8 8 / 0.98) 100%)',
          }}
        />
        <div
          className="hidden md:block absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgb(8 8 8 / 0.96) 0%, rgb(8 8 8 / 0.9) 26%, rgb(8 8 8 / 0.52) 48%, rgb(8 8 8 / 0.1) 68%, transparent 82%)',
          }}
        />

        {/* Blend the bottom edge into the section below */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background to-transparent" />
      </motion.div>

      {/* ── Nav. Below lg the section links collapse into a sheet; without it
             a phone had no way to reach any section but by scrolling. ── */}
      <nav
        className="relative z-30 w-full px-6 md:px-12 py-4 md:py-6 flex items-center justify-between gap-3"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <a
          href="#home"
          className="flex items-center gap-2 font-display text-sm min-[400px]:text-base sm:text-xl tracking-[0.07em] min-[400px]:tracking-[0.18em] sm:tracking-widest text-white uppercase min-w-0 min-h-[44px]"
          translate="no"
        >
          <img
            src="/img/avatar-96.png"
            alt=""
            width={96}
            height={96}
            className="w-7 h-7 rounded-full shrink-0 ring-1 ring-primary/30"
          />
          <span className="truncate">Achref Lajmi</span>
        </a>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans text-xs tracking-widest uppercase text-white/60">
          {t.nav.map(([href, label]) => (
            <a key={href} href={href} className="hover:text-white transition-colors py-2">
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <LangToggle />

          <a
            href={cvHref(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 min-h-[44px] font-sans text-xs tracking-widest uppercase text-white hover:text-primary transition-colors group"
          >
            <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-primary">
              {t.cv}
            </span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t.menu}
            aria-expanded={menuOpen}
            className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-white/80 hover:text-primary hover:border-primary/40 transition-colors"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} t={t} lang={lang} />

      {/* Scroll cue — pinned to the section's bottom edge so it never rides up
          under the copy when the hero is taller than its content. */}
      <motion.div
        className="hidden md:block absolute bottom-10 left-6 md:left-12 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 1.1, ease: EASE }}
      >
        <ScrollIndicator label={t.scroll} />
      </motion.div>

      {/* ── Body ── */}
      <div className="relative z-20 flex-1 w-full max-w-[90rem] mx-auto px-6 md:px-12 flex">
        <div className="flex flex-col justify-end md:justify-center w-full min-w-0 pt-12 md:pt-10 pb-20 md:pb-32">
          <div className="min-w-0">
            {/* Headline — three lines, each break controlled. Fluid type keeps
                every line on one line at any width. "survive" is the only
                accent in the whole headline. */}
            <h1
              className="font-sans font-light tracking-tight leading-[1.05] text-white mb-7"
              style={{ fontSize: 'clamp(1.95rem, 4.7vw, 4rem)' }}
            >
              <motion.span className="block" {...rise(0)}>
                {t.line1}
              </motion.span>
              <motion.span className="block" {...rise(1)}>
                {t.line2a}
                <span className="italic font-serif tracking-normal text-primary">{t.accent}</span>
                {t.line2b}
              </motion.span>
              <motion.span className="block" {...rise(2)}>
                {t.line3}
              </motion.span>
            </h1>

            {/* Subhead */}
            <motion.p
              className="font-sans text-white/50 text-sm leading-relaxed max-w-[380px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.75, ease: EASE }}
            >
              {t.subhead}
            </motion.p>
          </div>

        </div>
      </div>
    </section>
  );
}
