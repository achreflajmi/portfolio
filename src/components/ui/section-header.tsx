import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 mb-16 md:mb-24 relative z-10 w-full text-center md:text-left items-center md:items-start',
        className,
      )}
    >
      {subtitle && (
        <h2 className="text-sm font-sans tracking-widest text-primary uppercase font-semibold max-w-2xl">
          {subtitle}
        </h2>
      )}
      <h3 className="text-4xl md:text-[2.75rem] lg:text-5xl font-sans font-light leading-tight text-white">
        {title}
      </h3>
    </div>
  );
}
