'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Ambulance, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function EmergencyPage() {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  function startHold() {
    setHolding(true);
    const start = Date.now();
    const interval = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / 2500);
      setProgress(p);
      if (p >= 1) {
        clearInterval(interval);
        setHolding(false);
        setProgress(0);
        toast.success('Emergency team alerted', {
          description: 'Your location has been shared. Stay on the line — a responder will call.'
        });
        setTimeout(() => (window.location.href = 'tel:112'), 600);
      }
    }, 50);

    const onUp = () => {
      clearInterval(interval);
      setHolding(false);
      setProgress(0);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchend', onUp);
    };
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-red-900 via-red-800 to-slate-900" />
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-red-500/40 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/30 blur-3xl"
      />

      <div className="container py-20 text-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-100 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" /> 24/7 Emergency response
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Help is seconds away.
          </h1>
          <p className="mt-4 text-base text-red-100/90 lg:text-lg">
            Press and hold the SOS button — we&apos;ll share your location with emergency responders
            and pre-alert the ER team. Or call 112 directly.
          </p>
        </motion.div>

        {/* SOS button */}
        <div className="mt-16 flex flex-col items-center">
          <motion.button
            onMouseDown={startHold}
            onTouchStart={startHold}
            whileTap={{ scale: 0.96 }}
            className="relative flex h-48 w-48 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/40 transition-all hover:bg-red-500 sm:h-60 sm:w-60"
          >
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-red-500/40"
            />
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-red-400/40"
            />

            {/* Hold progress ring */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="none" />
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                stroke="white"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={(1 - progress) * 2 * Math.PI * 46}
                animate={{ strokeDashoffset: (1 - progress) * 2 * Math.PI * 46 }}
                transition={{ duration: 0.05 }}
              />
            </svg>

            <div className="relative flex flex-col items-center">
              <Phone className="h-12 w-12" />
              <p className="mt-2 text-3xl font-black tracking-widest">SOS</p>
              <p className="mt-1 text-xs font-semibold opacity-80">
                {holding ? 'Hold to confirm…' : 'Press & hold'}
              </p>
            </div>
          </motion.button>

          <a
            href="tel:112"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <Phone className="h-5 w-5" /> Or dial 112
          </a>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { icon: MapPin, title: 'GPS assist', desc: 'Your location is shared securely.' },
            { icon: Ambulance, title: 'Ambulance dispatch', desc: 'Nearest unit routed to you.' },
            { icon: ShieldCheck, title: 'ER pre-alert', desc: 'Team prepped before you arrive.' }
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <f.icon className="h-6 w-6 text-red-300" />
              <p className="mt-3 text-sm font-bold">{f.title}</p>
              <p className="mt-1 text-xs text-red-100/80">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
