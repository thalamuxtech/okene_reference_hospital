import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export function ComingSoon({
  title,
  description,
  backHref = '/dashboard',
  backLabel = 'Back to dashboard'
}: {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="container min-h-[60vh] py-16 lg:py-24">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
          <Sparkles className="h-3.5 w-3.5" />
          Coming soon
        </div>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-slate-600">{description}</p>
        <Link
          href={backHref}
          className="mt-8 inline-flex items-center gap-2 rounded-lg border-2 border-primary-500 bg-white px-5 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
