import Link from 'next/link';
import { Section, SectionHeader } from '@/components/ui/section';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { Reveal } from '@/components/motion/reveal';
import { Award, Users, Sparkles, Heart, Target, ShieldCheck } from 'lucide-react';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero pb-20 pt-16 lg:pt-24">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="container">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" /> About us
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[64px] lg:leading-[1.05]">
                Healthcare rooted in{' '}
                <span className="text-gradient">Ebira land.</span> Built for the world.
              </h1>
              <p className="mt-6 text-base text-slate-600 lg:text-lg">
                Confluence University of Science and Technology Teaching Hospital, Okene
                (CUSTECH-TH) is the heart of advanced healthcare for Okene and the surrounding Ebira
                communities. We combine deep clinical experience
                with a modern, patient-first digital platform — so quality care is never more than
                a tap, a text, or a call away, whether you are in Okene, Adavi, Okehi, Ihima,
                Ajaokuta or anywhere else in Kogi State.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <Section className="bg-white">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
                Our mission
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Quality healthcare, accessible to every person in Kogi Central.
              </h2>
              <p className="mt-4 text-base text-slate-600">
                We believe world-class care should not depend on your postcode, income or
                connectivity. That&apos;s why every pathway we build — from SMS triage to HD
                telehealth — is engineered for inclusion.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Heart, label: 'Compassion', desc: 'Every patient matters.' },
                  { icon: Target, label: 'Excellence', desc: 'Clinical and service standards.' },
                  { icon: ShieldCheck, label: 'Trust', desc: 'Privacy and safety first.' },
                  { icon: Users, label: 'Community', desc: 'Serving Ebira land and beyond.' }
                ].map((v) => (
                  <div key={v.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <v.icon className="h-5 w-5 text-primary-600" />
                    <p className="mt-2 text-sm font-bold text-slate-900">{v.label}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary-100 to-navy-100 blur-xl" />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: '27+', l: 'Years serving Okene' },
                  { v: '50+', l: 'Specialists' },
                  { v: '100k+', l: 'Patients treated' },
                  { v: '15+', l: 'Specialties' }
                ].map((s, i) => (
                  <div
                    key={s.l}
                    className={`rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm ${
                      i % 2 ? 'mt-8' : ''
                    }`}
                  >
                    <p className="text-3xl font-bold text-slate-900 lg:text-4xl">{s.v}</p>
                    <p className="mt-1 text-sm text-slate-600">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Awards strip */}
      <Section className="bg-slate-50">
        <SectionHeader
          eyebrow="Recognition"
          title="Trusted by institutions and patients alike"
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'MDCN accredited', icon: Award },
            { title: 'NDPR compliant', icon: ShieldCheck },
            { title: 'ISO 9001 standards', icon: Award },
            { title: 'Best Hospital · Kogi 2025', icon: Sparkles }
          ].map((a) => (
            <StaggerItem key={a.title}>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <a.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{a.title}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section>
        <div className="rounded-3xl bg-gradient-to-br from-primary-500 to-navy-500 p-10 text-center text-white shadow-2xl sm:p-16">
          <h2 className="text-3xl font-bold sm:text-4xl">Become part of the Okene story.</h2>
          <p className="mt-3 max-w-xl mx-auto text-primary-100">
            Register in under two minutes and experience healthcare that finally feels like it was
            built for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/auth/register" className="btn-primary h-12 bg-white text-primary-700 hover:bg-primary-50">
              Create account
            </Link>
            <Link href="/doctors" className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
              Meet our doctors
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
