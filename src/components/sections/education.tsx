import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { MapPin, GraduationCap, Award } from 'lucide-react';
import { useSectionInView } from '@/lib/use-section-in-view';
import { SectionHeader } from '@/components/ui/section-header';
import { Watermark } from '@/components/ui/watermark';

const EDUCATION = [
  {
    year: '2021 — 2026',
    school: 'ESPRIT — Private Higher School of Engineering and Technology',
    degree: 'Diplôme d’Ingénieur, Computer Science',
    honors: 'Mention Très Bien',
    gpa: 'Master level · EQF 7',
    location: 'TUNIS, TUNISIA',
    focus: ['Web & Mobile', 'Software Engineering', 'Applied AI'],
  },
  {
    year: '2025 — 2026',
    school: 'Philipps-Universität Marburg',
    degree: 'Exchange Semester, Computer Science',
    honors: 'Erasmus exchange',
    gpa: 'Oct 2025 — Mar 2026',
    location: 'MARBURG, GERMANY',
    focus: ['Distributed Systems', 'Machine Learning', 'German language'],
  },
];

const CERTS = [
  'AWS Academy Cloud Foundations',
  'NVIDIA Generative AI with Diffusion Models',
  'NVIDIA Applications of AI for Predictive Maintenance',
];

export function EducationSection() {
  const ref = useSectionInView(4);

  return (
    <section
      id="education"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen py-32 px-6 md:px-12 lg:px-24 bg-background flex flex-col justify-center relative overflow-hidden"
    >
      <Watermark text="EDUCATION" className="text-[14vw] md:text-[18vw]" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <SectionHeader subtitle="Academic foundation" title="Where I studied" />

        <div className="flex flex-col gap-16 md:gap-24">
          {EDUCATION.map((edu) => (
            <EduItem key={edu.school} edu={edu} />
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-20 pt-10 border-t border-white/10">
          <p className="font-sans text-xs tracking-widest uppercase text-white/35 mb-6">
            Certifications
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

function EduItem({ edu }: { edu: (typeof EDUCATION)[0] }) {
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <h3 className="text-2xl md:text-3xl font-sans font-light leading-tight text-white">
              {edu.school}
            </h3>
            <div className="flex items-center gap-2 text-primary font-sans text-xs tracking-widest uppercase shrink-0 pb-1">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              {edu.location}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-white/90 font-sans text-sm md:text-base tracking-wide">
              <GraduationCap className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
              <span className="leading-snug">{edu.degree}</span>
            </div>
            <div className="flex items-center gap-3 text-white/50 font-sans text-xs tracking-widest uppercase">
              <Award className="w-4 h-4 text-primary/60 shrink-0" aria-hidden="true" />
              <span>
                {edu.honors} <span className="mx-2 text-white/20">•</span> {edu.gpa}
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {edu.focus.map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full bg-background/50 border border-white/5 text-[10px] font-sans tracking-widest uppercase text-white/60"
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
