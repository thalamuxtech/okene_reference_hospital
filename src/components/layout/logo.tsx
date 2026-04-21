import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, variant = 'default' }: { className?: string; variant?: 'default' | 'light' }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2.5 group', className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-navy-500 shadow-md transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="h-6 w-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 4v24M4 16h24"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 rounded-xl ring-2 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all" />
      </div>
      <div className="flex flex-col leading-none">
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
            'text-[11px] font-medium uppercase tracking-widest',
            variant === 'light' ? 'text-primary-100' : 'text-primary-600'
          )}
        >
          Hospital
        </span>
      </div>
    </Link>
  );
}
