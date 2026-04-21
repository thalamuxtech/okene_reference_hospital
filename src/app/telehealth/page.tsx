'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Video, Calendar, ShieldCheck, Wifi, MessageSquare, Pill } from 'lucide-react';
import { DOCTORS } from '@/lib/seed-data';
import { Section, SectionHeader } from '@/components/ui/section';
import { DoctorCard } from '@/components/doctor-card';
import { Stagger, StaggerItem } from '@/components/motion/stagger';

const telehealthDoctors = DOCTORS.filter((d) => d.telehealthAvailable);

const perks = [
  {
    icon: Video,
    title: 'HD video consultations',
    desc: 'Encrypted, studio-quality video and audio with your specialist.'
  },
  {
    icon: ShieldCheck,
    title: 'NDPR compliant',
    desc: 'End-to-end encrypted sessions. You own your data.'
  },
  {
    icon: MessageSquare,
    title: 'Chat & file sharing',
    desc: 'Share images, lab results and notes directly in the session.'
  },
  {
    icon: Pill,
    title: 'E-prescriptions',
    desc: 'Receive prescriptions instantly and pick up at any pharmacy.'
  },
  {
    icon: Wifi,
    title: 'Low-bandwidth fallback',
    desc: 'Drop to voice-only or SMS consultation on poor networks.'
  },
  {
    icon: Calendar,
    title: 'Same-day slots',
    desc: 'Many of our telehealth doctors offer same-day availability.'
  }
];

export default function TelehealthPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-900 via-navy-900 to-primary-900" />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-primary-500/30 blur-3xl"
        />

        <div className="container relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm"
            >
              <Video className="h-3.5 w-3.5" /> Telehealth
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.05]"
            >
              See a specialist{' '}
              <span className="bg-gradient-to-r from-violet-300 to-primary-300 bg-clip-text text-transparent">
                without leaving home.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-base text-white/80 lg:text-lg"
            >
              HD video consultations with real Okene Reference Hospital specialists — plus SMS
              fallback for areas with poor connectivity.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <Link href="/book?type=telehealth" className="btn-primary h-12 px-6 text-base">
                <Calendar className="h-5 w-5" /> Book telehealth
              </Link>
              <Link
                href="/telehealth/demo"
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Video className="h-5 w-5" /> See demo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeader
          eyebrow="Why telehealth"
          title="Premium care, anywhere"
          description="Every telehealth session uses the same clinical standards and specialists as an in-hospital visit."
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((p) => (
            <StaggerItem key={p.title}>
              <motion.div
                whileHover={{ y: -3 }}
                className="h-full rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-primary-500 text-white">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{p.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section className="bg-slate-50">
        <SectionHeader
          eyebrow="Online specialists"
          title="Book a video consultation"
          description="Our most-loved doctors are available for telehealth."
        />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {telehealthDoctors.map((d) => (
            <StaggerItem key={d.id}>
              <DoctorCard doctor={d} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </div>
  );
}
