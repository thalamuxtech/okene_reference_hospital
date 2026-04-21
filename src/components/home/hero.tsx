'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight,
  Calendar,
  Video,
  Stethoscope,
  ShieldCheck,
  Sparkles,
  Star
} from 'lucide-react';
import { StatCounter } from '@/components/stat-counter';

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden gradient-hero">
      <motion.div style={{ y: bgY }} className="absolute inset-0 grid-bg" />

      {/* Floating orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary-300/25 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-navy-300/20 blur-3xl"
      />

      <motion.div style={{ opacity, y: fgY }} className="container relative pb-24 pt-16 lg:pb-32 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0, 0, 0.2, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-primary-700 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Now offering 24/7 telehealth · AI triage · SMS booking
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay: 0.1 }}
              className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[64px] lg:leading-[1.05]"
            >
              Premium healthcare,{' '}
              <span className="relative inline-block">
                <span className="text-gradient">built for Kogi.</span>
                <motion.svg
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 1, ease: 'easeInOut' }}
                  className="absolute -bottom-2 left-0 h-3 w-full"
                >
                  <motion.path
                    d="M2 9C70 2 150 2 298 7"
                    stroke="url(#underline)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="underline" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#008B8B" />
                      <stop offset="1" stopColor="#1E3A8A" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay: 0.2 }}
              className="mt-6 max-w-xl text-base text-slate-600 sm:text-lg"
            >
              Book trusted specialists, consult online or by SMS, and get 24/7 emergency support —
              all from a premium platform designed for the Kogi Central community.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/book" className="btn-primary h-12 px-6 text-base">
                <Calendar className="h-5 w-5" />
                Book Appointment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/triage"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-6 text-base font-semibold text-slate-700 transition-all hover:border-primary-500 hover:text-primary-600"
              >
                <Stethoscope className="h-5 w-5" />
                AI Symptom Check
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay: 0.5 }}
              className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {[
                { value: 50, suffix: '+', label: 'Doctors' },
                { value: 10000, suffix: '+', label: 'Patients' },
                { value: 24, suffix: '/7', label: 'Emergency' },
                { value: 15, suffix: '+', label: 'Specialties' }
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-200/70 bg-white/70 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-slate-900">
                    <StatCounter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative lg:col-span-5">
            <HeroVisual />
          </div>
        </div>
      </motion.div>

      {/* Bottom wave */}
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        preserveAspectRatio="none"
        className="relative -mb-[1px] h-16 w-full text-white"
      >
        <path d="M0 80H1440V30C1200 70 720 0 0 40V80Z" fill="currentColor" />
      </svg>
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0, 0, 0.2, 1] }}
      className="relative mx-auto w-full max-w-md"
    >
      {/* Main card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white p-6 shadow-[0_20px_80px_-20px_rgba(30,58,138,0.35)]">
        <div className="absolute inset-x-0 top-0 h-28 gradient-brand" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur">
              <Video className="h-6 w-6" />
            </div>
            <div className="text-white">
              <p className="text-xs font-medium uppercase tracking-wider opacity-90">Telehealth</p>
              <p className="text-sm font-semibold">Dr. Amina Hassan</p>
            </div>
          </div>

          <div className="mt-16 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-navy-500" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">Next appointment</p>
                <p className="text-xs text-slate-500">Today · 10:30 AM · Cardiology</p>
              </div>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Queue', value: '#4', color: 'bg-amber-50 text-amber-700' },
              { label: 'Wait', value: '18m', color: 'bg-blue-50 text-blue-700' },
              { label: 'Room', value: '204', color: 'bg-emerald-50 text-emerald-700' }
            ].map((i) => (
              <div key={i.label} className={`rounded-lg p-2.5 ${i.color}`}>
                <p className="text-[10px] font-medium uppercase tracking-wider opacity-75">
                  {i.label}
                </p>
                <p className="text-sm font-bold">{i.value}</p>
              </div>
            ))}
          </div>

          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-700"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live queue updates
          </motion.div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-6 top-8 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              HIPAA-aligned
            </p>
            <p className="text-xs font-bold text-slate-900">Encrypted records</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-4 -right-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg sm:-right-6"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50">
            <Sparkles className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              AI Triage
            </p>
            <p className="text-xs font-bold text-slate-900">24/7 · SMS & USSD</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
