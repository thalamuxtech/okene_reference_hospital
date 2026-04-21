import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

export function Section({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section className={cn('py-20 lg:py-28', className)} {...props}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center'
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
}) {
  return (
    <div
      className={cn(
        'mx-auto mb-12 max-w-2xl',
        align === 'center' ? 'text-center' : 'mx-0 text-left'
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'mb-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700',
            align === 'center' ? '' : ''
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
        {title}
      </h2>
      {description && <p className="mt-4 text-base text-slate-600 lg:text-lg">{description}</p>}
    </div>
  );
}
