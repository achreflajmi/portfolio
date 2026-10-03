import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { GraduationCap, Award, Globe } from 'lucide-react';
import { useSectionInView } from '@/lib/use-section-in-view';
import { SectionHeader } from '@/components/ui/section-header';
import { Watermark } from '@/components/ui/watermark';
import { useCopy, type Lang } from '@/lib/i18n';

/**
 * The degree is the qualification spelled out in full, `institution` the
 * school, place, years and honours beneath it, and `exchange` the semester
 * abroad — one credential block, not two separate entries.
 *
 * Never abbreviate the ESPRIT degree to "Dipl.-Ing." — that is a protected
 * German engineering title awarded under German law, and it does not apply to
 * a Tunisian Diplôme d'Ingénieur. Write it out, with the EQF equivalence.
 */
const CERTS = [
  'AWS Academy Cloud Foundations',
  'NVIDIA Generative AI with Diffusion Models',
  'NVIDIA Applications of AI for Predictive Maintenance',
];

const PHOTO = {
  webp: '/img/graduation-960.webp',
  jpg: '/img/graduation-960.jpg',
  width: 960,
  height: 1200,
};

const COPY: Record<
  Lang,
  {
    watermark: string;
    kicker: string;
    title: string;
    certs: string;
    degree: string;
    institution: string;
    exchange: string;
    photoAlt: string;
    photoCaption: string;
  }
> = {
  en: {
    watermark: 'EDUCATION',
    kicker: 'Academic foundation',
    title: 'Where I studied',
    certs: 'Certifications',
    degree: 'Diplôme d’Ingénieur, Computer Science — equivalent to a German M.Sc. (EQF level 7)',
    institution: 'ESPRIT, Tunis · 2021–2026 · mention Très Bien (highest honours)',
    exchange:
      'Philipps-Universität Marburg · exchange semester, computer science · Oct 2025 – Mar 2026',
    photoAlt: 'Achref Lajmi at his graduation from ESPRIT, September 2026',
    photoCaption: 'ESPRIT, Tunis — September 2026',
  },
  fr: {
    watermark: 'FORMATION',
    kicker: 'Parcours académique',
    title: 'Où j’ai étudié',
    certs: 'Certifications',
    degree:
      'Diplôme d’ingénieur en informatique, option développement web et mobile — équivalent à un M.Sc. allemand (niveau Master, CEC 7)',
    institution: 'ESPRIT, Tunis · 2021–2026 · mention Très Bien',
    exchange:
      'Philipps-Universität Marburg · semestre d’échange, informatique · oct. 2025 – mars 2026',
    photoAlt: 'Achref Lajmi à sa remise de diplôme à ESPRIT, septembre 2026',
    photoCaption: 'ESPRIT, Tunis — septembre 2026',
  },
};

export function EducationSection() {
  const ref = useSectionInView(4);
  const t = useCopy(COPY);

  return (
    <section
      id="education"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen min-h-[100dvh] py-32 px-6 md:px-12 lg:px-24 bg-background flex flex-col justify-center relative overflow-hidden"
    >
      <Watermark text={t.watermark} className="text-[14vw] md:text-[18vw]" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <SectionHeader subtitle={t.kicker} title={t.title} />

        <Credential t={t} />

        {/* Certifications */}
        <div className="mt-20 pt-10 border-t border-white/10">
          <p className="font-sans text-xs tracking-widest uppercase text-white/35 mb-6">{t.certs}</p>
          <ul className="flex flex-wrap gap-3">
            {CERTS.map((c) => (
              <li
                key={c}
                className="px-4 py-2.5 rounded-full border border-white/10 bg-white/[0.03] font-sans text-xs tracking-wide text-white/70"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Credential({ t }: { t: (typeof COPY)['en'] }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  /* If the photo is ever missing the text simply takes the full width. */
  const [hasPhoto, setHasPhoto] = useState(true);

  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start 0.9', 'center 0.5'],
  });

  // The same scroll treatment the section already used: nothing extra.
  const x = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0.92, 1]);

  return (
    <div
      ref={itemRef}
      className="relative flex flex-col lg:flex-row gap-8 lg:gap-14 items-start lg:items-center group"
    >
      {/* Photo first in the source, so it stacks above the text on mobile. */}
      {hasPhoto && (
        <motion.figure
          style={{ scale, opacity }}
          className="w-full max-w-[340px] sm:max-w-[380px] lg:w-[38%] lg:max-w-[420px] shrink-0 m-0"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.45)] bg-white/[0.03]">
            <picture>
              <source srcSet={PHOTO.webp} type="image/webp" />
              <img
                src={PHOTO.jpg}
                alt={t.photoAlt}
                width={PHOTO.width}
                height={PHOTO.height}
                loading="lazy"
                decoding="async"
                onError={() => setHasPhoto(false)}
                className="w-full max-w-full h-auto aspect-[4/5] object-cover object-[50%_28%]"
              />
            </picture>

            {/* Inset edge, so the photo sits in the page rather than on it. */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_-40px_60px_-30px_rgba(8,8,8,0.9)]"
              aria-hidden="true"
            />
          </div>

          <figcaption className="mt-3 font-sans text-[12px] lg:text-[11px] tracking-widest uppercase text-white/35">
            {t.photoCaption}
          </figcaption>
        </motion.figure>
      )}

      {/* Credential */}
      <motion.div
        style={{ x, opacity }}
        className="flex-1 w-full min-w-0 bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="flex flex-col gap-6">
          {/* The qualification, written out in full — see the note above. */}
          <div className="flex items-start gap-3 border-b border-white/10 pb-6">
            <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-1.5" aria-hidden="true" />
            <h3 className="text-xl md:text-2xl font-sans font-light leading-snug text-white">
              {t.degree}
            </h3>
          </div>

          {/* Institution, place, years, honours. Deliberately not uppercased —
              it would wreck the casing of "mention Très Bien". */}
          <div className="flex items-start gap-3 text-white/60 font-sans text-sm leading-relaxed">
            <Award className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" aria-hidden="true" />
            <p>{t.institution}</p>
          </div>

          <div className="flex items-start gap-3 text-white/50 font-sans text-sm leading-relaxed pt-2 border-t border-white/10">
            <Globe className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" aria-hidden="true" />
            <p>{t.exchange}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
