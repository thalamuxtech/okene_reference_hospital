import Link from 'next/link';
import { SPECIALTIES } from '@/lib/seed-data';
import { SpecialtyCard } from '@/components/specialty-card';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { Sparkles } from 'lucide-react';

export const metadata = { title: 'Specialties' };

export default function SpecialtiesPage() {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 -z-10 h-[360px] gradient-hero" />

      <div className="container pt-14 lg:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> Medical specialties
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Full-spectrum care under{' '}
            <span className="text-gradient">one roof.</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 lg:text-lg">
            From preventive wellness to complex surgical care — every department staffed by
            board-certified specialists.
          </p>
        </div>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPECIALTIES.map((s) => (
            <StaggerItem key={s.id}>
              <SpecialtyCard specialty={s} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="my-20 rounded-3xl bg-gradient-to-br from-primary-500 to-navy-500 p-8 text-center text-white sm:p-14">
          <h2 className="text-2xl font-bold sm:text-3xl">Not sure which specialist to see?</h2>
          <p className="mt-3 text-primary-100">
            Our AI triage assistant can help — in under two minutes.
          </p>
          <Link
            href="/triage"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 text-base font-semibold text-primary-700 transition-transform hover:scale-105"
          >
            Start symptom check
          </Link>
        </div>
      </div>
    </div>
  );
}
