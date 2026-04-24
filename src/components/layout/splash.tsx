'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const SPLASH_DURATION = 1600; // ms on first load

export function Splash() {
  const reduce = useReducedMotion();
  // Show once per browser session (so it doesn't flash on every client-side nav).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem('orh-splash-seen');
    if (seen) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('orh-splash-seen', '1');
    }, SPLASH_DURATION);
    return () => clearTimeout(t);
  }, []);

  // Optional short 'beep' tone synced with the pulse.
  useEffect(() => {
    if (!visible || reduce) return;
    let ctx: AudioContext | null = null;
    let cancelled = false;
    const start = () => {
      try {
        // @ts-ignore
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        ctx = new Ctx();
        const make = (when: number) => {
          if (!ctx) return;
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.value = 880;
          g.gain.setValueAtTime(0, ctx.currentTime + when);
          g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + when + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + 0.28);
          o.connect(g).connect(ctx.destination);
          o.start(ctx.currentTime + when);
          o.stop(ctx.currentTime + when + 0.3);
        };
        make(0);
        make(0.35);
      } catch {
        /* silent */
      }
    };
    // Browsers require a user gesture for audio — try, but fail silently.
    start();
    return () => {
      cancelled = true;
      ctx?.close().catch(() => {});
    };
  }, [visible, reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(900px 700px at 50% 40%, rgba(0,139,139,0.35), transparent 60%), radial-gradient(700px 500px at 50% 90%, rgba(30,58,138,0.45), transparent 60%), linear-gradient(180deg,#071424,#0A1628)'
          }}
        >
          {/* Subtle grid */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
          >
            <defs>
              <pattern id="splash-mesh" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#splash-mesh)" />
          </svg>

          {/* Beeping rings */}
          <div className="relative flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: [0.85, 1.55], opacity: [0.55, 0] }}
                transition={{
                  duration: 1.4,
                  delay: i * 0.35,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
                className="absolute h-52 w-52 rounded-full border-2 border-primary-400/70"
              />
            ))}

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={
                reduce
                  ? { scale: 1, opacity: 1 }
                  : { scale: [0.6, 1.08, 1], opacity: [0, 1, 1] }
              }
              transition={{
                duration: 0.85,
                times: [0, 0.55, 1],
                ease: [0, 0, 0.2, 1]
              }}
              className="relative z-10"
            >
              {/* Soft halo behind logo */}
              <motion.span
                animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 -m-8 rounded-full bg-gradient-to-br from-primary-500/40 to-navy-500/40 blur-2xl"
              />
              <Image
                src="/custechth-logo.png"
                alt="CUSTECH Teaching Hospital, Okene"
                width={220}
                height={220}
                className="relative h-48 w-48 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:h-56 sm:w-56"
                priority
                unoptimized
              />
            </motion.div>
          </div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-16 left-0 right-0 text-center"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-primary-200">
              CUSTECH Teaching Hospital · Okene
            </p>
            <p className="mt-1 text-[11px] text-white/50">Trusted. Professional. Accessible.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
