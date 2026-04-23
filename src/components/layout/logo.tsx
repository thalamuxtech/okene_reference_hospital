import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Official Okene Reference Hospital logo.
 * Uses the hospital's circular blue badge (public/orh-logo.png).
 * Exported as HospitalShield for backwards-compatibility with the sidebars.
 */
export function HospitalShield({
  className
}: {
  className?: string;
  tone?: 'brand' | 'light';
}) {
  return (
    <Image
      src="/orh-logo.png"
      alt="Okene Reference Hospital"
      width={96}
      height={96}
      className={cn('drop-shadow-sm', className)}
      priority
      unoptimized
    />
  );
}

export function Logo({
  className,
  variant = 'default'
}: {
  className?: string;
  variant?: 'default' | 'light';
}) {
  return (
    <Link href="/" className={cn('group flex items-center gap-3', className)}>
      <span className="relative block h-10 w-10 transition-transform group-hover:scale-105">
        <HospitalShield className="h-10 w-10" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-[15px] font-bold tracking-tight',
            variant === 'light' ? 'text-white' : 'text-slate-900'
          )}
        >
          Okene Reference
        </span>
        <span
          className={cn(
            'mt-1 text-[11px] font-semibold uppercase tracking-[0.2em]',
            variant === 'light' ? 'text-primary-200' : 'text-primary-600'
          )}
        >
          Hospital
        </span>
      </span>
    </Link>
  );
}
