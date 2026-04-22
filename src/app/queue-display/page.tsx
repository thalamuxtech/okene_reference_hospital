'use client';

import { useTicketStore } from '@/lib/ticket-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function QueueDisplayPage() {
  const tickets = useTicketStore((s) => s.tickets);
  const counters = useTicketStore((s) => s.counters);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const called = tickets.filter((t) => t.status === 'called' || t.status === 'in_consultation');
  const upcoming = tickets
    .filter((t) => t.status === 'waiting')
    .sort((a, b) =>
      b.priority - a.priority !== 0 ? b.priority - a.priority : a.arrivedAt - b.arrivedAt
    )
    .slice(0, 6);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1000px 600px at 50% -20%, rgba(0,139,139,0.35), transparent 60%), radial-gradient(800px 600px at 20% 120%, rgba(30,58,138,0.35), transparent 60%), linear-gradient(180deg,#0A1628,#0D1B30)'
        }}
      />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col p-6 lg:p-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-200">
              Okene Reference Hospital · Live queue
            </p>
            <h1 className="mt-1 text-3xl font-bold lg:text-4xl">Now serving</h1>
          </div>
          <div className="text-right">
            <p className="font-mono text-4xl font-black tabular-nums lg:text-5xl">
              {now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs uppercase tracking-widest text-white/50">
              {now.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        {/* Counters grid */}
        <div className="mt-10 grid flex-1 gap-5 lg:grid-cols-3">
          {counters.slice(0, 6).map((c) => {
            const current = c.currentTicketId ? tickets.find((t) => t.id === c.currentTicketId) : null;
            return (
              <motion.div
                key={c.counter}
                layout
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    Counter {c.counter}
                  </div>
                  <div className={`text-xs font-semibold ${c.available ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {c.available ? '● Open' : '◯ Paused'}
                  </div>
                </div>
                <div className="flex min-h-[180px] flex-col justify-center px-6 py-5 text-center">
                  <AnimatePresence mode="wait">
                    {current ? (
                      <motion.div
                        key={current.id}
                        initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      >
                        <p className="font-mono text-6xl font-black leading-none tracking-tight text-white lg:text-7xl">
                          {current.number}
                        </p>
                        <p className="mt-3 text-lg font-semibold text-white/90 lg:text-xl">
                          {current.patientName}
                        </p>
                        <p className="mt-0.5 text-xs uppercase tracking-widest text-primary-200">
                          {current.status === 'in_consultation' ? 'In consultation' : 'Please proceed'}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-white/40"
                      >
                        <p className="text-4xl font-black">—</p>
                        <p className="mt-3 text-sm">Awaiting next patient</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="border-t border-white/10 bg-white/[0.03] px-6 py-3 text-xs">
                  <p className="text-white/70">{c.department}</p>
                  <p className="text-white/50">{c.doctorName ?? 'Unassigned'}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Ticker of upcoming */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            <Clock className="h-3.5 w-3.5" /> Upcoming
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {upcoming.map((t) => (
              <motion.div
                key={t.id}
                layout
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm"
              >
                <span className="font-mono font-bold">{t.number}</span>
                <span className="text-white/60">·</span>
                <span className="text-white/80">{t.patientName}</span>
                <span className="text-white/40">· {t.department}</span>
              </motion.div>
            ))}
            {upcoming.length === 0 && (
              <p className="text-sm text-white/40">No patients in queue.</p>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-white/30">
          Display auto-updates · Emergency · 112 · care@okenehospital.ng
        </div>
      </div>
    </div>
  );
}
