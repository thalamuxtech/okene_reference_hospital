'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Section, SectionHeader } from '@/components/ui/section';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Aisha Bello',
    role: 'Mother of two, Okene',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 5,
    quote:
      'Booking was two minutes on my phone. The doctor was kind, thorough, and the SMS reminders meant I never missed a follow-up.'
  },
  {
    name: 'Musa Ibrahim',
    role: 'Retired teacher, Adavi',
    photo: 'https://randomuser.me/api/portraits/men/75.jpg',
    rating: 5,
    quote:
      'I live far from the hospital, so the telehealth option has been a lifesaver — literally. My heart medications are always on time now.'
  },
  {
    name: 'Grace Okoh',
    role: 'Student, Kogi State University',
    photo: 'https://randomuser.me/api/portraits/women/33.jpg',
    rating: 5,
    quote:
      'The AI triage told me my symptoms needed urgent care and got me a slot the same day. I had never experienced healthcare this smooth.'
  }
];

export function Testimonials() {
  return (
    <Section className="bg-slate-900 text-white">
      <div className="absolute inset-x-0 top-0 -z-0">
        <div className="mx-auto h-64 max-w-3xl bg-gradient-to-b from-primary-500/20 to-transparent blur-3xl" />
      </div>

      <div className="relative">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-300">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-400" /> Patient stories
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
            Loved by the people we serve
          </h2>
          <p className="mt-4 text-base text-slate-300 lg:text-lg">
            Real stories from patients across Kogi Central who now rely on Okene Reference Hospital
            as their home for care.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0, 0, 0.2, 1], delay: i * 0.1 }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:bg-white/[0.07]"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-primary-400/30" />

              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="mt-4 text-sm leading-relaxed text-slate-200">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                <Image
                  src={t.photo}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-400/40"
                />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </Section>
  );
}
