import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface WatermarkProps {
  text?: string;
  children?: ReactNode;
  className?: string;
}

export function Watermark({ text, children, className }: WatermarkProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
      <div
        className={cn(
          'text-[18vw] font-sans font-light text-white/[0.03] leading-[0.8] tracking-tighter whitespace-nowrap flex items-center justify-center',
          className,
        )}
      >
        {text || children}
      </div>
    </div>
  );
}
