import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Custom hospital shield — teal → navy gradient with an inset medical cross,
 * a subtle inner ring and a heart accent at the base. Entirely SVG so it
 * scales crisply and can be reused as the favicon.
 */
export function HospitalShield({
  className,
  tone = 'brand'
}: {
  className?: string;
  tone?: 'brand' | 'light';
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn('drop-shadow-sm', className)}
    >
      <defs>
        <linearGradient id="orh-shield-body" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0E7E7E" />
          <stop offset=".55" stopColor="#006E6E" />
          <stop offset="1" stopColor="#12266B" />
        </linearGradient>
        <linearGradient id="orh-shield-gloss" x1="8" y1="4" x2="40" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity=".35" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="orh-shield-cross" x1="18" y1="16" x2="30" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E6FFFD" />
        </linearGradient>
      </defs>

      {/* Shield silhouette */}
      <path
        d="M24 3.2c-5.2 1.9-10.4 3-15.6 3.2-.8 0-1.4.6-1.4 1.4v13.8c0 9.8 6.1 18.5 15.3 22l.9.4c.5.2 1 .2 1.5 0l.9-.4c9.2-3.5 15.3-12.2 15.3-22V7.8c0-.8-.6-1.4-1.4-1.4C34.4 6.2 29.2 5.1 24 3.2z"
        fill="url(#orh-shield-body)"
      />

      {/* Glossy highlight */}
      <path
        d="M24 3.2c-5.2 1.9-10.4 3-15.6 3.2-.8 0-1.4.6-1.4 1.4v13.8c0 4.6 1.3 8.9 3.6 12.6C10.3 23 14.9 13.4 24 6.8c9.1 6.6 13.7 16.2 13.4 27.4 2.3-3.7 3.6-8 3.6-12.6V7.8c0-.8-.6-1.4-1.4-1.4C34.4 6.2 29.2 5.1 24 3.2z"
        fill="url(#orh-shield-gloss)"
        opacity=".65"
      />

      {/* Inner ring */}
      <path
        d="M24 6.8c-4.8 1.7-9.6 2.7-14.5 2.9v12c0 8.7 5.4 16.4 13.5 19.4l.5.2c.3.1.6.1.9 0l.5-.2c8.1-3 13.5-10.7 13.5-19.4v-12c-4.9-.2-9.7-1.2-14.5-2.9z"
        fill="none"
        stroke={tone === 'light' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.35)'}
        strokeWidth="0.9"
      />

      {/* Medical cross */}
      <rect x="21" y="14" width="6" height="20" rx="1.4" fill="url(#orh-shield-cross)" />
      <rect x="14" y="21" width="20" height="6" rx="1.4" fill="url(#orh-shield-cross)" />

      {/* Heart accent under cross */}
      <path
        d="M24 39.5c-1.8-1.4-3.4-2.8-3.4-4.5 0-1.2 1-2.2 2.2-2.2.5 0 1 .2 1.2.5.2-.3.7-.5 1.2-.5 1.2 0 2.2 1 2.2 2.2 0 1.7-1.6 3.1-3.4 4.5z"
        fill="#FDBA74"
        opacity=".9"
      />
    </svg>
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
        <HospitalShield className="h-10 w-10" tone={variant === 'light' ? 'light' : 'brand'} />
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
