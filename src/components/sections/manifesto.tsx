import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSectionInView } from '@/lib/use-section-in-view';
import { cvHref, useCopy, useLang, type Lang } from '@/lib/i18n';
import { Watermark } from '@/components/ui/watermark';

const COPY: Record<Lang, { watermark: string; text: string; byline: string; cv: string; run: string[]; gate: string[] }> = {
  en: {
    watermark: 'MANIFESTO',
    text:
      'A system can run all night on its own. It still stops at a person before anything is final. That is the line I design to. The deal engine scores, negotiates and learns without supervision \u2014 and writes nothing to the catalogue until someone has decided, on the record it concerns. Autonomy and oversight are separate problems, and treating them that way is what makes either one safe to ship.',
    byline: 'Achref Lajmi, on building the deal engine at recash',
    cv: 'Download CV',
    run: ['autonomy', 'learns', 'negotiates', 'scores', 'supervision', 'unattended'],
    gate: ['person', 'someone', 'decided', 'oversight', 'final', 'stops'],
  },
  fr: {
    watermark: 'MANIFESTE',
    text:
      'Un syst\u00e8me peut tourner toute la nuit seul. Il s\u2019arr\u00eate quand m\u00eame devant une personne avant que quoi que ce soit ne devienne d\u00e9finitif. C\u2019est la ligne que je vise. Le moteur de deals \u00e9value, n\u00e9gocie et apprend sans supervision \u2014 et n\u2019\u00e9crit rien au catalogue tant que quelqu\u2019un n\u2019a pas tranch\u00e9, sur la fiche concern\u00e9e. L\u2019autonomie et le contr\u00f4le sont deux probl\u00e8mes distincts, et les traiter ainsi est ce qui rend l\u2019un comme l\u2019autre s\u00fbr \u00e0 livrer.',
    byline: 'Achref Lajmi, \u00e0 propos du moteur de deals chez recash',
    cv: 'T\u00e9l\u00e9charger le CV',
    run: ['autonomie', 'apprend', 'n\u00e9gocie', '\u00e9value', 'supervision'],
    gate: ['personne', 'quelqu\u2019un', 'tranch\u00e9', 'contr\u00f4le', 'd\u00e9finitif', 's\u2019arr\u00eate'],
  },
};

export function ManifestoSection() {
  const ref = useSectionInView(0);
  const textRef = useRef<HTMLDivElement>(null);
  const lang = useLang();
  const t = useCopy(COPY);
  const watermark = t.watermark;
  const words = t.text.split(' ');
  const run = new Set(t.run);
  const gate = new Set(t.gate);

  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ['start 0.8', 'end 0.4'],
  });

  return (
    <section
      id="manifesto"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen min-h-[100dvh] flex items-center justify-center py-32 px-6 md:px-24 relative overflow-hidden"
    >
      <Watermark text={watermark} className="text-[14vw] md:text-[18vw]" />

      <div ref={textRef} className="max-w-3xl w-full mx-auto relative z-10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-sans font-light leading-relaxed text-center flex flex-wrap justify-center gap-x-2.5 gap-y-1.5 md:gap-x-3 md:gap-y-2">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = Math.min(1, start + 4 / words.length);

            return (
              <Word
                key={i}
                word={word}
                progress={scrollYProgress}
                range={[start, end]}
                run={run}
                gate={gate}
              />
            );
          })}
        </h2>

        <p className="mt-10 text-center font-sans text-xs tracking-widest uppercase text-white/35">
          {t.byline}
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href={cvHref(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 min-h-[48px] font-sans text-sm tracking-widest uppercase text-white hover:text-primary transition-colors group"
          >
            <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-primary">
              {t.cv}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Word({
  word,
  progress,
  range,
  run,
  gate,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  run: Set<string>;
  gate: Set<string>;
}) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  /* Keep accents and apostrophes so the French highlight words still match. */
  const cleaned = word.toLowerCase().replace(/[^\p{L}\p{N}.\u2019-]/gu, '');

  const tone = run.has(cleaned)
    ? 'text-primary'
    : gate.has(cleaned)
      ? 'text-gate'
      : 'text-foreground';

  return (
    <motion.span style={{ opacity }} className={tone}>
      {word}
    </motion.span>
  );
}
