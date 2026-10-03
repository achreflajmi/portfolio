import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useSectionInView } from '@/lib/use-section-in-view';
import { Watermark } from '@/components/ui/watermark';

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/achreflajmi', Icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/achref-lajmi', Icon: Linkedin },
  { label: 'Phone', href: 'tel:+4915565848284', Icon: Phone },
];

const CVS = [
  { label: 'Backend', href: '/cv/Achref_Lajmi_Backend.pdf' },
  { label: 'Full-Stack', href: '/cv/Achref_Lajmi_FullStack.pdf' },
  { label: 'Applied GenAI', href: '/cv/Achref_Lajmi_GenAI.pdf' },
];

export function ContactSection() {
  const ref = useSectionInView(6);
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
      className="relative min-h-screen flex flex-col justify-center bg-background overflow-hidden border-t border-white/5 py-32 px-6 md:px-24"
    >
      <Watermark text="CONTACT" className="text-[14vw] md:text-[18vw]" />

      <div ref={containerRef} className="w-full flex items-center justify-center">
        <motion.div style={{ y }} className="w-full max-w-6xl flex flex-col relative z-10">
          <div className="flex flex-col text-center items-center justify-center w-full">
            <h2 className="text-sm font-sans tracking-widest text-primary uppercase mb-8 font-semibold">
              Let&rsquo;s build something
            </h2>

            <p className="font-sans text-white/55 text-base max-w-xl mb-12 leading-relaxed">
              I&rsquo;m looking for full-time backend, full-stack or applied-AI work, I&rsquo;m based
              in Berlin, and I&rsquo;m available now.
            </p>

            <a
              href="mailto:achreflajmi1@gmail.com"
              className="font-sans font-light leading-tight text-white hover:text-primary transition-colors duration-500 break-all sm:break-normal max-w-full text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem]"
            >
              achreflajmi1@gmail.com
            </a>

            {/* CV variants */}
            <div className="mt-14 w-full">
              <p className="font-sans text-[10px] tracking-widest uppercase text-white/30 mb-5">
                Download CV
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {CVS.map((cv) => (
                  <a
                    key={cv.href}
                    href={cv.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto rounded-full border border-white/10 bg-white/[0.03] text-white/70 hover:text-primary hover:border-primary/40 transition-all duration-300 font-sans text-xs tracking-widest uppercase"
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
                Email me
              </a>

              {LINKS.map(({ label, href, Icon }) => (
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

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-24 pt-10 border-t border-white/10 font-sans text-xs tracking-widest uppercase text-white/40">
            <p>© {new Date().getFullYear()} Achref Lajmi · Berlin</p>
            <p>Built as a static site. No trackers.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
