import Link from 'next/link';
import { SPECIALTIES } from '@/lib/seed-data';
import { Section, SectionHeader } from '@/components/ui/section';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { SpecialtyCard } from '@/components/specialty-card';
import { ArrowRight } from 'lucide-react';

export function SpecialtiesSection() {
  return (
    <Section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div className="relative">
        <SectionHeader
          eyebrow="Specialties"
          title="World-class care across disciplines"
          description="From cardiology to paediatrics, our specialists bring decades of combined experience backed by modern clinical technology."
        />

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPECIALTIES.map((s) => (
            <StaggerItem key={s.id}>
              <SpecialtyCard specialty={s} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 flex justify-center">
          <Link
            href="/specialties"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-600"
          >
            View all specialties
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
