import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Official Okene Reference Hospital logo (public/orh-logo.png).
 * The mark scale is controlled by `size` (px) so callers can render an
 * oversized "hanging" logo in the header hero and a smaller one when
 * scrolled. Exported also as HospitalShield for backwards-compatibility.
 */
export function HospitalShield({
  className,
  size = 40
}: {
  className?: string;
  size?: number;
  tone?: 'brand' | 'light';
}) {
  return (
    <Image
      src="/orh-logo.png"
      alt="Okene Reference Hospital"
      width={size * 2}
      height={size * 2}
      className={cn('drop-shadow-sm', className)}
      style={{ width: size, height: size }}
      priority
      unoptimized
    />
  );
}

export function Logo({
  className,
  variant = 'default',
  size = 40,
  showWordmark = true,
  wordmarkSize = 'md'
}: {
  className?: string;
  variant?: 'default' | 'light';
  size?: number;
  showWordmark?: boolean;
  wordmarkSize?: 'sm' | 'md' | 'lg';
}) {
  const wm = {
    sm: { title: 'text-[13px]', sub: 'text-[10px]' },
    md: { title: 'text-[15px]', sub: 'text-[11px]' },
    lg: { title: 'text-lg', sub: 'text-xs' }
  }[wordmarkSize];

  return (
    <Link href="/" className={cn('group flex items-center gap-3', className)}>
      <span className="relative block transition-transform group-hover:scale-105">
        <HospitalShield size={size} />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-bold tracking-tight',
              wm.title,
              variant === 'light' ? 'text-white' : 'text-slate-900'
            )}
          >
            Okene Reference
          </span>
          <span
            className={cn(
              'mt-1 font-semibold uppercase tracking-[0.2em]',
              wm.sub,
              variant === 'light' ? 'text-primary-200' : 'text-primary-600'
            )}
          >
            Hospital
          </span>
        </span>
      )}
    </Link>
  );
}
