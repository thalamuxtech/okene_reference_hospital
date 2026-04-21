import { Hero } from '@/components/home/hero';
import { Features } from '@/components/home/features';
import { SpecialtiesSection } from '@/components/home/specialties-section';
import { DoctorsSection } from '@/components/home/doctors-section';
import { HowItWorks } from '@/components/home/how-it-works';
import { Testimonials } from '@/components/home/testimonials';
import { CTA } from '@/components/home/cta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <SpecialtiesSection />
      <HowItWorks />
      <DoctorsSection />
      <Testimonials />
      <CTA />
    </>
  );
}
