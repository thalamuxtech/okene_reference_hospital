import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-hero" />
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="absolute left-1/2 top-16 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary-300/30 blur-3xl" />
      <div className="container grid min-h-[calc(100vh-5rem)] items-center py-12 lg:grid-cols-2 lg:gap-10 lg:py-20">
        <div className="hidden lg:block">
          <AuthIllustration />
        </div>
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

function AuthIllustration() {
  return (
    <div className="relative">
      <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-32 gradient-brand" />
        <div className="relative space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path
                  d="M12 2v20M2 12h20"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                Your health, secured
              </p>
              <p className="text-sm font-semibold">NDPR · HIPAA-aligned</p>
            </div>
          </div>

          <div className="mt-16 space-y-3">
            {[
              { label: 'Phone OTP sign-in', color: 'bg-primary-50 text-primary-700' },
              { label: 'Biometric unlock', color: 'bg-violet-50 text-violet-700' },
              { label: 'End-to-end encryption', color: 'bg-emerald-50 text-emerald-700' },
              { label: 'SMS fallback for rural access', color: 'bg-amber-50 text-amber-700' }
            ].map((i) => (
              <div
                key={i.label}
                className={`flex items-center gap-3 rounded-xl ${i.color} p-3`}
              >
                <div className="h-2 w-2 rounded-full bg-current opacity-80" />
                <p className="text-sm font-semibold">{i.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
