import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useSectionInView } from '@/lib/use-section-in-view';
import { SectionHeader } from '@/components/ui/section-header';
import { Watermark } from '@/components/ui/watermark';
import { POSTS, type Post } from '@/lib/posts';
import { cn } from '@/lib/utils';

export function WritingSection() {
  const ref = useSectionInView(5);

  return (
    <section
      id="writing"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen py-32 px-6 md:px-12 lg:px-24 bg-background relative overflow-hidden"
    >
      <Watermark text="WRITING" className="text-[15vw] md:text-[20vw]" />

      <div className="max-w-[90rem] mx-auto w-full relative z-10">
        <SectionHeader
          subtitle="Write-ups on the systems behind the projects — architecture decisions, trade-offs, and what held up in production."
          title={
            <span>
              Notes from <br />
              <span className="text-primary">the build</span>
            </span>
          }
        />

        <div className="flex flex-col gap-32 md:gap-48 mt-12 md:mt-0">
          {POSTS.map((post, i) => (
            <PostItem key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PostItem({ post, index }: { post: Post; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['-10%', '10%'],
  );
  const textY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [40, -40]);

  const isEven = index % 2 === 0;
  const href = `/writing/${post.slug}`;

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col gap-12 lg:gap-24 group items-center',
        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse',
      )}
    >
      {/* Cover */}
      <a
        href={href}
        className="w-full lg:w-3/5 aspect-[16/10] md:aspect-[16/9] max-h-[400px] rounded-2xl overflow-hidden relative border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-neutral-950/80 p-2 md:p-3 block"
      >
        <div className="w-full h-full relative rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_100%)] pointer-events-none z-10" />

          <motion.div style={{ y: imageY }} className="w-full h-full flex items-center justify-center">
            <img
              src={post.cover}
              alt={post.coverAlt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </motion.div>
        </div>

        <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </a>

      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className="w-full lg:w-1/2 flex flex-col justify-center relative z-10"
      >
        {/* Decorative giant numeral */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 text-[15rem] md:text-[20rem] font-sans font-light text-white/[0.03] select-none pointer-events-none tracking-tighter hidden lg:block"
          aria-hidden="true"
        >
          {post.num}
        </div>

        <div className="flex flex-col gap-6 relative">
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <span className="text-primary font-sans font-light text-4xl leading-none">{post.num}</span>
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-sans tracking-widest text-primary/80 font-medium uppercase">
              {post.date}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <a href={href}>
              <h3 className="text-3xl md:text-4xl font-sans font-light leading-tight text-white group-hover:text-primary transition-colors duration-500">
                {post.cardTitle}
              </h3>
            </a>
            <div className="text-xs font-sans tracking-widest text-white/60 uppercase mt-2">
              {post.category}
            </div>
          </div>

          <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed mt-2">
            {post.excerpt}
          </p>

          <div className="mt-6">
            <a
              href={href}
              className="inline-flex items-center gap-4 font-sans text-xs tracking-widest uppercase text-white/60 hover:text-primary transition-colors"
            >
              Read the write-up
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/20 text-white/50 group-hover:bg-primary group-hover:border-primary group-hover:text-background transition-all duration-300">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M1 13L13 1M13 1H4M13 1V10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
