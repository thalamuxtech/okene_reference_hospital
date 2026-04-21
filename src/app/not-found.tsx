import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-hero" />
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="container text-center">
        <p className="font-mono text-7xl font-black text-gradient lg:text-9xl">404</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          This page isn&apos;t in our records.
        </h1>
        <p className="mt-3 max-w-md mx-auto text-slate-600">
          The link may be broken or the page may have moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link href="/doctors" className="btn-outline">
            Browse doctors
          </Link>
        </div>
      </div>
    </div>
  );
}
