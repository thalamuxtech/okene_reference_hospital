'use client';

import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Video,
  MessageSquare,
  Siren,
  Printer,
  BrainCircuit,
  Bell,
  Users
} from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { Stagger, StaggerItem } from '@/components/motion/stagger';

const features = [
  {
    icon: CalendarCheck,
    title: 'Smart appointment booking',
    desc: 'Online, kiosk, SMS or USSD — book in under a minute with live slot updates.',
    color: 'from-primary-500/15 to-primary-500/5',
    iconColor: 'text-primary-600'
  },
  {
    icon: Video,
    title: 'HD telehealth',
    desc: 'Encrypted video consultations with e-prescriptions and session recordings.',
    color: 'from-violet-500/15 to-violet-500/5',
    iconColor: 'text-violet-600'
  },
  {
    icon: BrainCircuit,
    title: 'AI triage',
    desc: 'Symptom triage in English, Hausa, Yoruba — instant urgency classification.',
    color: 'from-fuchsia-500/15 to-fuchsia-500/5',
    iconColor: 'text-fuchsia-600'
  },
  {
    icon: Siren,
    title: '24/7 emergency hotline',
    desc: 'One-tap SOS with GPS, ambulance dispatch and pre-alerted ER team.',
    color: 'from-red-500/15 to-red-500/5',
    iconColor: 'text-red-600'
  },
  {
    icon: Users,
    title: 'Smart queue',
    desc: 'Live queue display, mobile tracking and push alerts when you’re next.',
    color: 'from-amber-500/15 to-amber-500/5',
    iconColor: 'text-amber-600'
  },
  {
    icon: Printer,
    title: 'Thermal slip printer',
    desc: 'QR-coded appointment slips at reception for fast in-hospital lookup.',
    color: 'from-slate-500/15 to-slate-500/5',
    iconColor: 'text-slate-700'
  },
  {
    icon: MessageSquare,
    title: 'SMS & USSD for all',
    desc: 'Book, triage, check-in from a feature phone via Africa’s Talking.',
    color: 'from-emerald-500/15 to-emerald-500/5',
    iconColor: 'text-emerald-600'
  },
  {
    icon: Bell,
    title: 'Reliable reminders',
    desc: 'SMS, email and push reminders 24h and 2h before every visit.',
    color: 'from-sky-500/15 to-sky-500/5',
    iconColor: 'text-sky-600'
  }
];

export function Features() {
  return (
    <Section className="bg-white">
      <SectionHeader
        eyebrow="What we do"
        title="Care that meets you anywhere"
        description="Online, offline, at reception or on a feature phone — every pathway has been engineered to be fast, private and human."
      />

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <StaggerItem key={f.title}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="relative h-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 transition-all hover:shadow-lg"
            >
              <div className={`absolute inset-0 -z-0 bg-gradient-to-br ${f.color}`} />
              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60">
                  <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{f.desc}</p>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
