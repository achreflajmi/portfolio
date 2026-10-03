import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { coverWebp } from '@/lib/posts';

/**
 * An article cover that plays its animation.
 *
 * The poster is the video's own first frame, so nothing shifts when playback
 * starts. Playback is tied to visibility rather than autoplay: three looping
 * videos decoding off-screen is wasted battery on a phone, and nothing
 * downloads at all until a card comes into view.
 *
 * Under prefers-reduced-motion it renders the still instead — the animations
 * loop indefinitely, which is exactly what that setting asks us not to do.
 */
export function CoverMedia({
  poster,
  video,
  alt,
  className,
}: {
  poster: string;
  video: string;
  alt: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduce || failed) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects if the browser blocks it; the poster stays up.
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce, failed]);

  if (reduce || failed) {
    return (
      <picture>
        <source srcSet={coverWebp(poster)} type="image/webp" />
        <img
          src={poster}
          alt={alt}
          width={1200}
          height={675}
          loading="lazy"
          decoding="async"
          className={className}
        />
      </picture>
    );
  }

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      onError={() => setFailed(true)}
      role="img"
      aria-label={alt}
      className={className}
    >
      <source src={video} type="video/mp4" />
    </video>
  );
}
