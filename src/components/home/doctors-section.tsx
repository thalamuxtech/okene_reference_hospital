import Link from 'next/link';
import { DOCTORS } from '@/lib/seed-data';
import { Section, SectionHeader } from '@/components/ui/section';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { DoctorCard } from '@/components/doctor-card';
import { ArrowRight } from 'lucide-react';

export function DoctorsSection() {
  return (
    <Section className="bg-white">
      <SectionHeader
        eyebrow="Meet the team"
        title="Specialists you can trust"
        description="Board-certified doctors, rigorous credentialing and decades of clinical experience serving the Kogi Central community."
      />

      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DOCTORS.slice(0, 6).map((doc) => (
          <StaggerItem key={doc.id}>
            <DoctorCard doctor={doc} />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-10 flex justify-center">
        <Link href="/doctors" className="btn-outline">
          View all doctors
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}
