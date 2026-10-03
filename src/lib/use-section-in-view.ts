import { useEffect, useRef } from 'react';
import { useSection } from '@/lib/section-context';

/**
 * Marks a section active once its body crosses the upper-middle of the viewport.
 * Cheap scroll listener rather than an observer, so pinned sections that stay
 * mounted for several screens keep reporting the right index.
 */
export function useSectionInView(index: number) {
  const ref = useRef<HTMLElement>(null);
  const { setActiveIndex } = useSection();

  useEffect(() => {
    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const middleThreshold = viewportHeight * 0.45;

      if (rect.top <= middleThreshold && rect.bottom > middleThreshold) {
        setActiveIndex(index);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [index, setActiveIndex]);

  return ref;
}
