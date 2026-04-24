'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight,
  Calendar,
  Stethoscope,
  Sparkles,
  Star,
  Video,
  ShieldCheck,
  Heart,
  Play,
  Quote,
  Users
} from 'lucide-react';
import { StatCounter } from '@/components/stat-counter';

/**
 * Premium, magazine-quality hero:
 * - Dark, warm gradient rooted in Ebira cultural palette (deep indigo → terracotta glow)
 * - Refined serif/sans type pairing, hand-drawn SVG underline
 * - Parallax editorial portrait (doctor) with ECG + floating credential cards
 * - Social proof strip, live telehealth badge, trust row (regulators)
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const o = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-[#0A1628] text-white"
    >
      {/* Layered ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(1100px 700px at 80% -10%, rgba(0, 139, 139, 0.45), transparent 55%), radial-gradient(900px 600px at -10% 110%, rgba(217, 119, 6, 0.28), transparent 55%), radial-gradient(1200px 500px at 50% 120%, rgba(30, 58, 138, 0.4), transparent 60%), linear-gradient(180deg, #0A1628 0%, #0D1B30 100%)'
          }}
        />
        {/* Subtle mesh grid */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="mesh" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mesh)" />
        </svg>

        {/* Floating light blobs */}
        <motion.div
          animate={reduce ? {} : { x: [0, 40, 0], y: [0, -24, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 left-1/4 h-[520px] w-[520px] rounded-full bg-primary-500/25 blur-[120px]"
        />
        <motion.div
          animate={reduce ? {} : { x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 right-[12%] h-[600px] w-[600px] rounded-full bg-amber-500/18 blur-[140px]"
        />
      </div>

      {/* Top glass announcement bar */}
      <div className="relative z-10 border-b border-white/5">
        <div className="container flex h-10 items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/60">
          <span className="hidden sm:inline">CUSTECH-TH · Okene, Kogi · Est. 2024</span>
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              9 consultants online
            </span>
            <span className="hidden md:inline">English · Ebira · Hausa · Yoruba · Igala</span>
          </span>
        </div>
      </div>

      <motion.div
        style={{ opacity: o, y: y2 }}
        className="container relative grid items-center gap-12 pb-28 pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-36 lg:pt-24"
      >
        {/* Copy column */}
        <div className="relative z-10 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-200 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ebira land&apos;s premier medical destination</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0, 0, 0.2, 1] }}
            className="mt-6 text-[44px] font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[76px]"
            style={{ fontFeatureSettings: "'ss01', 'cv11'" }}
          >
            World-class care,
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary-300 via-white to-amber-200 bg-clip-text text-transparent">
                rooted in Okene.
              </span>
              <motion.svg
                viewBox="0 0 420 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="absolute -bottom-2 left-0 h-4 w-full"
              >
                <motion.path
                  d="M4 12C80 4 200 4 416 10"
                  stroke="url(#heroUnderline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.6, delay: 0.9, ease: 'easeInOut' }}
                />
                <defs>
                  <linearGradient id="heroUnderline" x1="0" y1="0" x2="420" y2="0">
                    <stop stopColor="#67E8E8" />
                    <stop offset="1" stopColor="#FDBA74" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            Book Nigeria&apos;s most trusted specialists, consult from anywhere via telehealth or
            SMS, and receive 24/7 emergency support built for the Ebira people — and every
            neighbour from Adavi to Ihima, Okehi to Ajaokuta.
          </motion.p>

          {/* Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/book"
              className="group relative inline-flex h-14 items-center gap-2 overflow-hidden rounded-full bg-white pl-6 pr-3 text-base font-semibold text-slate-900 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.35)] transition-transform hover:scale-[1.02]"
            >
              <Calendar className="h-5 w-5" />
              Book appointment
              <span className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-navy-500 text-white transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              href="/triage"
              className="inline-flex h-14 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <Stethoscope className="h-5 w-5" />
              Try AI symptom check
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
                <Play className="h-3.5 w-3.5 fill-current" />
              </span>
              Watch 60-sec tour
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-12 border-t border-white/10 pt-6"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Accredited by
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-white/55">
              <span>MDCN</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>HEFAMAA</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>NHIA partner</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>ISO 9001:2015</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>NDPR compliant</span>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4"
          >
            {[
              { value: 27, suffix: '+', label: 'Years serving Kogi' },
              { value: 50, suffix: '+', label: 'Specialists' },
              { value: 100000, suffix: '+', label: 'Patients' },
              { value: 15, suffix: '+', label: 'Specialties' }
            ].map((s) => (
              <div key={s.label}>
                <dt className="text-xs uppercase tracking-wider text-white/40">{s.label}</dt>
                <dd className="mt-0.5 text-2xl font-bold tabular-nums text-white">
                  <StatCounter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Visual column */}
        <div className="relative z-10 lg:col-span-5">
          <HeroPortrait y={y1} />
        </div>
      </motion.div>

      {/* Wave bottom */}
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden
        className="relative -mb-[1px] block h-24 w-full text-white"
      >
        <path d="M0 100H1440V30C1200 90 720 0 0 50V100Z" fill="currentColor" />
      </svg>
    </section>
  );
}

function HeroPortrait({ y }: { y: any }) {
  return (
    <motion.div style={{ y }} className="relative mx-auto w-full max-w-md">
      {/* Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0, 0, 0.2, 1] }}
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-2 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)] backdrop-blur-md"
      >
        <div className="relative overflow-hidden rounded-[26px]">
          {/* Portrait — custom SVG medical illustration */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-primary-600 via-navy-700 to-slate-900">
            <HeroMedicalArt />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

            {/* Doctor card overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3 backdrop-blur-xl"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-amber-400 text-slate-900">
                <Heart className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-200">
                  Featured consultant
                </p>
                <p className="truncate text-sm font-bold text-white">Prof. Solomon Avidime · CMD</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-amber-300">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                4.95
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating: live telehealth card */}
      <motion.div
        initial={{ opacity: 0, x: -24, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-6 top-10 w-60 rounded-2xl border border-white/10 bg-gradient-to-br from-white to-slate-50 p-4 text-slate-900 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-primary-500 text-white">
              <Video className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Telehealth · LIVE
              </p>
              <p className="text-sm font-bold">Dr. Omeiza Nuhu</p>
            </div>
          </div>
          {/* ECG trace */}
          <div className="mt-3 h-10 overflow-hidden rounded-lg bg-slate-950/90 p-1.5">
            <svg viewBox="0 0 200 40" className="h-full w-full">
              <motion.path
                d="M0 20 L30 20 L35 10 L40 30 L45 5 L50 35 L55 20 L200 20"
                fill="none"
                stroke="#34D399"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>HR 72 bpm</span>
            <span className="text-emerald-600">● Stable</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating: appointment card */}
      <motion.div
        initial={{ opacity: 0, x: 24, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.15, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -right-4 bottom-8 w-56 rounded-2xl border border-white/10 bg-slate-900/90 p-4 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:-right-8"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary-300" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-300">
              Next available
            </p>
          </div>
          <p className="mt-2 text-sm font-bold">Prof. Solomon Avidime</p>
          <p className="text-[11px] text-white/60">Obstetrics · Consultant</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[10px]">
            {['09:30', '10:30', '14:00'].map((t, i) => (
              <div
                key={t}
                className={`rounded-md py-1.5 font-semibold ${
                  i === 1 ? 'bg-primary-500 text-white' : 'bg-white/5 text-white/70'
                }`}
              >
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating credentials chip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, type: 'spring', stiffness: 220, damping: 18 }}
        className="absolute -left-2 bottom-0 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-xl sm:-left-6"
      >
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        End-to-end encrypted
      </motion.div>

      {/* Social proof quote card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute -bottom-12 left-1/2 hidden w-[82%] -translate-x-1/2 rounded-2xl border border-white/10 bg-white p-4 text-slate-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] sm:block"
      >
        <div className="flex items-start gap-3">
          <Quote className="h-5 w-5 flex-shrink-0 text-primary-500" />
          <div>
            <p className="text-xs leading-relaxed text-slate-700">
              &ldquo;From my shop in Okene main market I booked in two minutes. Dr. Nuhu treated me
              like family.&rdquo;
            </p>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
              <Users className="h-3 w-3" />
              <span className="font-semibold text-slate-900">Ohunene Oseni</span>
              <span>·</span>
              <span>Trader, Okene</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Custom premium medical illustration used in the hero.
 * Pure SVG — always loads, no external dependency, perfectly on-brand.
 * Features: stylised doctor silhouette in teal/navy, stethoscope curl,
 * soft radial halos and a large medical cross monogram.
 */
function HeroMedicalArt() {
  return (
    <div className="absolute inset-0">
      {/* Decorative radial halo */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(253, 186, 116, 0.22), transparent 55%), radial-gradient(circle at 30% 80%, rgba(56, 197, 197, 0.28), transparent 55%)'
        }}
      />

      <svg
        viewBox="0 0 400 500"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="coat" x1="80" y1="200" x2="320" y2="500" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E6FFFD" />
          </linearGradient>
          <linearGradient id="skin" x1="140" y1="110" x2="260" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#6B4226" />
            <stop offset="1" stopColor="#4A2E1C" />
          </linearGradient>
          <linearGradient id="bg-glow" x1="0" y1="0" x2="400" y2="500" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0E7E7E" stopOpacity=".35" />
            <stop offset="1" stopColor="#12266B" stopOpacity=".1" />
          </linearGradient>
          <radialGradient id="crossGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity=".28" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow disc */}
        <circle cx="200" cy="250" r="220" fill="url(#bg-glow)" />
        <circle cx="200" cy="230" r="180" fill="url(#crossGlow)" />

        {/* Large watermark medical cross */}
        <g opacity=".08">
          <rect x="180" y="60" width="40" height="380" rx="8" fill="#FFFFFF" />
          <rect x="40" y="200" width="320" height="40" rx="8" fill="#FFFFFF" />
        </g>

        {/* Body / coat */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
        >
          {/* Shoulders / torso */}
          <path
            d="M120 470 Q110 340 155 300 L165 260 Q180 246 200 246 Q220 246 235 260 L245 300 Q290 340 280 470 Z"
            fill="url(#coat)"
          />
          {/* Collar V */}
          <path d="M175 260 L200 310 L225 260 L235 275 L200 335 L165 275 Z" fill="#0E7E7E" />
          {/* Stethoscope */}
          <path
            d="M195 295 C180 330 175 370 205 385 Q240 400 245 370"
            fill="none"
            stroke="#0A1628"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="246" cy="366" r="8" fill="#0A1628" />
          <circle cx="246" cy="366" r="3" fill="#38C5C5" />

          {/* Neck */}
          <rect x="188" y="224" width="24" height="36" rx="6" fill="url(#skin)" />
          {/* Head */}
          <circle cx="200" cy="188" r="42" fill="url(#skin)" />
          {/* Hair — close-cropped */}
          <path
            d="M160 180 Q165 148 200 146 Q235 148 240 180 Q232 164 200 164 Q168 164 160 180 Z"
            fill="#0A1628"
          />
          {/* ID badge */}
          <g>
            <rect x="155" y="335" width="34" height="46" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
            <rect x="160" y="340" width="24" height="14" rx="2" fill="#0E7E7E" />
            <line x1="160" y1="360" x2="184" y2="360" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="160" y1="366" x2="178" y2="366" stroke="#E2E8F0" strokeWidth="1.5" />
            <line x1="160" y1="372" x2="180" y2="372" stroke="#E2E8F0" strokeWidth="1.5" />
          </g>
        </motion.g>

        {/* Floating icons — vitals */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {/* Pulse line */}
          <rect x="50" y="90" width="100" height="36" rx="10" fill="#0A1628" opacity=".65" />
          <motion.path
            d="M60 108 L75 108 L80 96 L86 122 L92 90 L98 122 L104 108 L140 108"
            fill="none"
            stroke="#34D399"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          />

          {/* Syringe-like chip */}
          <g transform="translate(300 120)">
            <rect width="56" height="36" rx="10" fill="#FDBA74" opacity=".9" />
            <circle cx="16" cy="18" r="6" fill="#0A1628" />
            <rect x="26" y="16" width="24" height="4" rx="2" fill="#0A1628" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
}
