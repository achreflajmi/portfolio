import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import { useSectionInView } from '@/lib/use-section-in-view';
import { SectionHeader } from '@/components/ui/section-header';
import { Watermark } from '@/components/ui/watermark';
import { useCopy, type Lang } from '@/lib/i18n';

/**
 * `degree` is the qualification spelled out in full, `meta` the institution,
 * place, years and honours beneath it.
 *
 * Never abbreviate the ESPRIT degree to "Dipl.-Ing." \u2014 that is a protected
 * German engineering title awarded under German law, and it does not apply to
 * a Tunisian Dipl\u00f4me d'Ing\u00e9nieur. Write it out, with the EQF equivalence.
 */
type Degree = { year: string; degree: string; meta: string; focus: string[] };

const CERTS = [
  'AWS Academy Cloud Foundations',
  'NVIDIA Generative AI with Diffusion Models',
  'NVIDIA Applications of AI for Predictive Maintenance',
];

const COPY: Record<Lang, { watermark: string; kicker: string; title: string; certs: string; entries: Degree[] }> = {
  en: {
    watermark: 'EDUCATION',
    kicker: 'Academic foundation',
    title: 'Where I studied',
    certs: 'Certifications',
    entries: [
      {
        year: '2021 \u2014 2026',
        degree: 'Dipl\u00f4me d\u2019Ing\u00e9nieur, Computer Science \u2014 equivalent to a German M.Sc. (EQF level 7)',
        meta: 'ESPRIT, Tunis \u00b7 2021\u20132026 \u00b7 mention Tr\u00e8s Bien (highest honours)',
        focus: ['Web & Mobile', 'Software Engineering', 'Applied AI'],
      },
      {
        year: '2025 \u2014 2026',
        degree: 'Exchange Semester, Computer Science',
        meta: 'Philipps-Universit\u00e4t Marburg, Germany \u00b7 Oct 2025 \u2013 Mar 2026 \u00b7 Erasmus exchange',
        focus: ['Distributed Systems', 'Machine Learning', 'German language'],
      },
    ],
  },
  fr: {
    watermark: 'FORMATION',
    kicker: 'Parcours acad\u00e9mique',
    title: 'O\u00f9 j\u2019ai \u00e9tudi\u00e9',
    certs: 'Certifications',
    entries: [
      {
        year: '2021 \u2014 2026',
        degree: 'Dipl\u00f4me d\u2019ing\u00e9nieur en informatique, option d\u00e9veloppement web et mobile \u2014 \u00e9quivalent \u00e0 un M.Sc. allemand (niveau Master, CEC 7)',
        meta: 'ESPRIT, Tunis \u00b7 2021\u20132026 \u00b7 mention Tr\u00e8s Bien',
        focus: ['Web & mobile', 'G\u00e9nie logiciel', 'IA appliqu\u00e9e'],
      },
      {
        year: '2025 \u2014 2026',
        degree: 'Semestre d\u2019\u00e9change, informatique',
        meta: 'Philipps-Universit\u00e4t Marburg, Allemagne \u00b7 oct. 2025 \u2013 mars 2026 \u00b7 \u00e9change Erasmus',
        focus: ['Syst\u00e8mes distribu\u00e9s', 'Apprentissage automatique', 'Allemand'],
      },
    ],
  },
};

export function EducationSection() {
  const ref = useSectionInView(4);
  const t = useCopy(COPY);
  const watermark = t.watermark;

  return (
    <section
      id="education"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen min-h-[100dvh] py-32 px-6 md:px-12 lg:px-24 bg-background flex flex-col justify-center relative overflow-hidden"
    >
      <Watermark text={watermark} className="text-[14vw] md:text-[18vw]" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <SectionHeader subtitle={t.kicker} title={t.title} />

        <div className="flex flex-col gap-16 md:gap-24">
          {t.entries.map((edu) => (
            <EduItem key={edu.degree} edu={edu} />
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-20 pt-10 border-t border-white/10">
          <p className="font-sans text-xs tracking-widest uppercase text-white/35 mb-6">
            {t.certs}
          </p>
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

function EduItem({ edu }: { edu: Degree }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start 0.9', 'center 0.5'],
  });

  const x = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0.8, 1]);

  return (
    <div ref={itemRef} className="relative flex flex-col lg:flex-row gap-6 lg:gap-16 items-start group">
      <motion.div
        style={{ scale, opacity }}
        className="text-4xl md:text-5xl lg:text-[4rem] font-sans font-light text-white/20 tracking-tighter shrink-0 select-none lg:w-[260px] lg:text-right transition-colors duration-500 group-hover:text-primary/40 pt-2 lg:pt-4"
      >
        {edu.year}
      </motion.div>

      <motion.div
        style={{ x, opacity }}
        className="flex-1 w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="flex flex-col gap-6">
          {/* The qualification, written out in full — see the note on EDUCATION. */}
          <div className="flex items-start gap-3 border-b border-white/10 pb-6">
            <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-1.5" aria-hidden="true" />
            <h3 className="text-xl md:text-2xl font-sans font-light leading-snug text-white">
              {edu.degree}
            </h3>
          </div>

          {/* Institution, place, years, honours. Deliberately not uppercased —
              it would wreck the casing of "mention Très Bien". */}
          <div className="flex items-start gap-3 text-white/55 font-sans text-sm leading-relaxed">
            <Award className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" aria-hidden="true" />
            <p>{edu.meta}</p>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {edu.focus.map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full bg-background/50 border border-white/5 text-[12px] lg:text-[10px] font-sans tracking-widest uppercase text-white/60"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
