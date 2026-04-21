'use client';

import { Section, SectionHeader } from '@/components/ui/section';
import { motion } from 'framer-motion';
import { Search, CalendarClock, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Choose specialty',
    desc: 'Browse 15+ specialties or let our AI triage recommend the right doctor for your symptoms.'
  },
  {
    icon: CalendarClock,
    title: 'Pick a time',
    desc: 'See live availability across doctors and select the slot that fits your day.'
  },
  {
    icon: CheckCircle2,
    title: 'Get care',
    desc: 'Walk in, telehealth or SMS consultation — we guide you every step of the way.'
  }
];

export function HowItWorks() {
  return (
    <Section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-0 bg-gradient-to-br from-primary-50/50 via-white to-navy-50/30" />
      <div className="relative">
        <SectionHeader
          eyebrow="Getting started"
          title="Care in three simple steps"
          description="Built to be frictionless — whether you're online in Okene, remote in a village, or walking up to reception."
        />

        <div className="relative grid gap-6 lg:grid-cols-3">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-16 hidden h-[2px] bg-gradient-to-r from-transparent via-primary-300 to-transparent lg:block"
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0, 0, 0.2, 1], delay: i * 0.12 }}
              className="relative rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-navy-500 text-white shadow-md">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="font-mono text-4xl font-bold text-primary-100">0{i + 1}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
