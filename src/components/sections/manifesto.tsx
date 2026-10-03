import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSectionInView } from '@/lib/use-section-in-view';
import { Watermark } from '@/components/ui/watermark';

const TEXT =
  'A system can run all night on its own. It still stops at a person before anything is final. That is the line I design to. SmartPilot scores, negotiates and learns without supervision — and writes nothing to the catalogue until someone has decided, on the record it concerns. Autonomy and oversight are separate problems, and treating them that way is what makes either one safe to ship.';

const words = TEXT.split(' ');

/** Cyan words: the system acting alone. */
const RUN_WORDS = new Set([
  'autonomy',
  'learns',
  'negotiates',
  'scores',
  'smartpilot',
  'supervision',
  'unattended',
]);

/** Amber words: the human gate. */
const GATE_WORDS = new Set(['person', 'someone', 'decided', 'oversight', 'final', 'stops']);

export function ManifestoSection() {
  const ref = useSectionInView(0);
  const textRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ['start 0.8', 'end 0.4'],
  });

  return (
    <section
      id="manifesto"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen flex items-center justify-center py-32 px-6 md:px-24 relative overflow-hidden"
    >
      <Watermark text="MANIFESTO" className="text-[14vw] md:text-[18vw]" />

      <div ref={textRef} className="max-w-3xl w-full mx-auto relative z-10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-sans font-light leading-relaxed text-center flex flex-wrap justify-center gap-x-2.5 gap-y-1.5 md:gap-x-3 md:gap-y-2">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = Math.min(1, start + 4 / words.length);

            return <Word key={i} word={word} progress={scrollYProgress} range={[start, end]} />;
          })}
        </h2>

        <p className="mt-10 text-center font-sans text-xs tracking-widest uppercase text-white/35">
          Achref Lajmi, on building SmartPilot at recash
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href="/cv/Achref_Lajmi_Backend.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 font-sans text-sm tracking-widest uppercase text-white hover:text-primary transition-colors group"
          >
            <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-primary">
              Download CV
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
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const cleaned = word.toLowerCase().replace(/[^a-z0-9.-]/g, '');

  const tone = RUN_WORDS.has(cleaned)
    ? 'text-primary'
    : GATE_WORDS.has(cleaned)
      ? 'text-gate'
      : 'text-foreground';

  return (
    <motion.span style={{ opacity }} className={tone}>
      {word}
    </motion.span>
  );
}
