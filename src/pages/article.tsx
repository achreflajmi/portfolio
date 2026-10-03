import { useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getPost, POSTS } from '@/lib/posts';
import { CoverMedia } from '@/components/ui/cover-media';
import NotFound from '@/pages/not-found';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug ?? '');

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) document.title = `${post.title} — Achref Lajmi`;
    return () => {
      document.title = 'Achref Lajmi';
    };
  }, [post]);

  if (!post) return <NotFound />;

  const others = POSTS.filter((p) => p.slug !== post.slug);

  return (
    <div className="bg-background min-h-screen text-foreground font-sans">
      {/* Reading progress — the same run line, applied to the page */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-50 shadow-[0_0_10px_rgba(94,216,240,0.7)]"
        aria-hidden="true"
      />

      <header className="relative z-30 w-full px-6 md:px-12 py-6 flex items-center justify-between gap-4 border-b border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg tracking-widest text-white uppercase hover:text-primary transition-colors"
        >
          <img
            src="/img/avatar-96.png"
            alt=""
            width={96}
            height={96}
            className="w-7 h-7 rounded-full shrink-0 ring-1 ring-primary/30"
          />
          Achref Lajmi
        </Link>

        <Link
          href="/#writing"
          className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-white/60 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          All writing
        </Link>
      </header>

      <main className="relative">
        {/* Masthead */}
        <div className="relative overflow-hidden border-b border-white/5">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_0%,rgba(94,216,240,0.10),transparent_65%)] pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-28 relative z-10">
            <p className="font-sans text-[11px] tracking-widest uppercase text-primary mb-6">
              {post.num} · {post.category}
            </p>
            <h1 className="text-3xl md:text-5xl font-sans font-light leading-[1.12] text-white mb-7">
              {post.title}
            </h1>
            <p className="font-sans text-sm text-white/40 tracking-widest uppercase">
              {post.date} · Achref Lajmi
            </p>
          </div>
        </div>

        {/* Cover */}
        <div className="max-w-4xl mx-auto px-6 md:px-12 -mt-2 pt-14">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-neutral-950/80 p-2 md:p-3">
<CoverMedia
              poster={post.cover}
              video={post.coverVideo}
              alt={post.coverAlt}
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>

        {/* Body */}
        <article className="max-w-2xl mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col gap-7">
          <p className="font-sans text-lg md:text-xl leading-relaxed text-white/80 border-l-2 border-primary/50 pl-6">
            {post.excerpt}
          </p>

          {post.blocks.map((block, i) => {
            if (block.kind === 'h') {
              return (
                <h2
                  key={i}
                  className="text-xl md:text-2xl font-sans font-light text-white mt-8 pb-3 border-b border-white/10"
                >
                  {block.text}
                </h2>
              );
            }

            if (block.kind === 'p') {
              return (
                <p key={i} className="font-sans text-base leading-[1.75] text-white/65">
                  {block.text}
                </p>
              );
            }

            return (
              <ul key={i} className="flex flex-col gap-3">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 font-sans text-base leading-[1.7] text-white/65"
                  >
                    <span className="text-primary/60 shrink-0 mt-[0.45rem] w-1.5 h-1.5 rounded-full bg-primary/60" aria-hidden="true" />
                    <span>
                      {item.lead && <b className="text-white/90 font-medium">{item.lead}: </b>}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            );
          })}

          {/* Stack */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="font-sans text-[10px] tracking-widest uppercase text-white/30 mb-3">
              Tech stack
            </p>
            <p className="font-mono text-sm text-primary/80 leading-relaxed">{post.stack}</p>
          </div>
        </article>

        {/* Keep reading */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 pb-28">
          <p className="font-sans text-[10px] tracking-widest uppercase text-white/30 mb-7">
            Keep reading
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/writing/${other.slug}`}
                className="group flex flex-col gap-3 p-7 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.06] transition-all duration-300"
              >
                <span className="font-sans text-[10px] tracking-widest uppercase text-primary">
                  {other.date}
                </span>
                <span className="font-sans font-light text-xl text-white group-hover:text-primary transition-colors">
                  {other.cardTitle}
                </span>
                <span className="font-sans text-sm text-white/50 leading-relaxed">
                  {other.excerpt}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-10 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 font-sans text-xs tracking-widest uppercase text-white/40">
          <p>© {new Date().getFullYear()} Achref Lajmi. All rights reserved.</p>
          <a href="mailto:achreflajmi1@gmail.com" className="hover:text-primary transition-colors">
            achreflajmi1@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
