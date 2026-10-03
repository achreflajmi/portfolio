import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useSectionInView } from '@/lib/use-section-in-view';
import { Watermark } from '@/components/ui/watermark';
import { useCopy, type Lang } from '@/lib/i18n';

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/achreflajmi', Icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/achref-lajmi', Icon: Linkedin },
];

const COPY: Record<Lang, {
  kicker: string;
  intro: string;
  eligibility: string;
  cvLabel: string;
  cvs: { label: string; href: string }[];
  email: string;
  phone: string;
  rights: string;
}> = {
  en: {
    kicker: "Let\u2019s build something",
    intro:
      "I\u2019m looking for full-time backend, full-stack or applied-AI work, I\u2019m based in Berlin, and I\u2019m available now.",
    eligibility:
      'Already resident in Germany \u2014 no relocation required. My degree is Master-equivalent (EQF level 7), meeting the EU Blue Card qualification requirement; employer support is needed to convert my current residence permit to a work permit.',
    cvLabel: 'Download CV',
    cvs: [
      { label: 'CV \u2014 English', href: '/cv/Achref_Lajmi_CV.pdf' },
      { label: 'CV \u2014 Fran\u00e7ais', href: '/cv/Achref_Lajmi_CV_FR.pdf' },
    ],
    email: 'Email me',
    phone: 'Phone',
    rights: 'All rights reserved.',
  },
  fr: {
    kicker: 'Construisons quelque chose',
    intro:
      'Je cherche un poste \u00e0 temps plein en backend, full-stack ou IA appliqu\u00e9e. Je suis bas\u00e9 \u00e0 Berlin et disponible imm\u00e9diatement.',
    eligibility:
      'D\u00e9j\u00e0 r\u00e9sident en Allemagne \u2014 aucune relocalisation n\u00e9cessaire. Mon dipl\u00f4me \u00e9quivaut \u00e0 un master (niveau 7 du CEC) et remplit la condition de qualification de la carte bleue europ\u00e9enne ; le soutien de l\u2019employeur est requis pour convertir mon titre de s\u00e9jour actuel en permis de travail.',
    cvLabel: 'T\u00e9l\u00e9charger le CV',
    cvs: [
      { label: 'CV \u2014 fran\u00e7ais', href: '/cv/Achref_Lajmi_CV_FR.pdf' },
      { label: 'CV \u2014 anglais', href: '/cv/Achref_Lajmi_CV.pdf' },
    ],
    email: '\u00c9crivez-moi',
    phone: 'T\u00e9l\u00e9phone',
    rights: 'Tous droits r\u00e9serv\u00e9s.',
  },
};

export function ContactSection() {
  const ref = useSectionInView(6);
  const t = useCopy(COPY);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-100, 0]);

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen min-h-[100dvh] flex flex-col justify-center bg-background overflow-hidden border-t border-white/5 py-32 px-6 md:px-24"
    >
      <Watermark text="CONTACT" className="text-[14vw] md:text-[18vw]" />

      <div ref={containerRef} className="w-full flex items-center justify-center">
        <motion.div style={{ y }} className="w-full max-w-6xl flex flex-col relative z-10">
          <div className="flex flex-col text-center items-center justify-center w-full">
            <h2 className="text-sm font-sans tracking-widest text-primary uppercase mb-8 font-semibold">
              {t.kicker}
            </h2>

            <p className="font-sans text-white/55 text-base max-w-xl mb-6 leading-relaxed">
              {t.intro}
            </p>

            {/* Work eligibility, stated as it is on the CV — it answers the
                first question a German employer asks. */}
            <p className="font-sans text-white/35 text-sm max-w-xl mb-12 leading-relaxed">
              {t.eligibility}
            </p>

            <a
              href="mailto:achreflajmi1@gmail.com"
              className="inline-flex items-center min-h-[52px] py-2 font-sans font-light leading-tight text-white hover:text-primary transition-colors duration-500 break-all sm:break-normal max-w-full text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem]"
            >
              achreflajmi1@gmail.com
            </a>

            {/* CV variants */}
            <div className="mt-14 w-full">
              <p className="font-sans text-[12px] lg:text-[10px] tracking-widest uppercase text-white/30 mb-5">
                {t.cvLabel}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {t.cvs.map((cv) => (
                  <a
                    key={cv.href}
                    href={cv.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] w-full sm:w-auto rounded-full border border-white/10 bg-white/[0.03] text-white/70 hover:text-primary hover:border-primary/40 transition-all duration-300 font-sans text-xs tracking-widest uppercase"
                  >
                    {cv.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10 w-full">
              <a
                href="mailto:achreflajmi1@gmail.com"
                className="flex items-center justify-center gap-3 px-8 py-4 w-full sm:w-auto rounded-full bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 group font-sans text-sm tracking-widest uppercase font-medium"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                {t.email}
              </a>

              {[...LINKS, { label: t.phone, href: 'tel:+4915565848284', Icon: Phone }].map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-center gap-3 px-8 py-4 w-full sm:w-auto rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/50 hover:text-primary hover:border-primary/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(94,216,240,0.15)] transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                  <span className="font-sans text-sm tracking-widest uppercase">{label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center mt-24 pt-10 border-t border-white/10 font-sans text-xs tracking-widest uppercase text-white/40">
            <p>© {new Date().getFullYear()} Achref Lajmi. {t.rights}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
