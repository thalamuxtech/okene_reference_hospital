'use client';

import { useTicketStore, type Ticket } from '@/lib/ticket-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function QueueDisplayPage() {
  const tickets = useTicketStore((s) => s.tickets);
  const counters = useTicketStore((s) => s.counters);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const [isFs, setIsFs] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  function toggleFs() {
    if (!document.fullscreenElement) {
      rootRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  const [voiceOn, setVoiceOn] = useState(true);
  const lastAnnounced = useRef<Set<string>>(new Set());

  const speakTicket = useCallback(
    (t: Ticket, counterNumber?: number) => {
      if (!voiceOn || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const say = (text: string) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-NG';
        u.rate = 0.9;
        u.pitch = 1;
        window.speechSynthesis.speak(u);
      };
      // Spell out the ticket number letter by letter for clarity
      const spelled = t.number
        .split('')
        .map((c) => (c === '-' ? '' : c))
        .join(' ');
      const counterTxt = counterNumber ? `to counter ${counterNumber}` : '';
      say(`Ticket ${spelled}, ${t.patientName}, please proceed ${counterTxt}.`);
    },
    [voiceOn]
  );

  // Auto-announce when a new ticket is called
  useEffect(() => {
    const calledIds = new Set<string>();
    tickets
      .filter((t) => t.status === 'called')
      .forEach((t) => {
        calledIds.add(t.id);
        if (!lastAnnounced.current.has(t.id)) {
          lastAnnounced.current.add(t.id);
          speakTicket(t, t.counter);
        }
      });
    // Clean up old ids (prevents re-announce if same id is re-used later)
    lastAnnounced.current.forEach((id) => {
      if (!calledIds.has(id)) lastAnnounced.current.delete(id);
    });
  }, [tickets, speakTicket]);

  function announceNext() {
    // Find the next waiting ticket (priority desc, arrival asc)
    const next = [...tickets]
      .filter((t) => t.status === 'waiting')
      .sort((a, b) =>
        b.priority - a.priority !== 0 ? b.priority - a.priority : a.arrivedAt - b.arrivedAt
      )[0];
    if (!next) {
      if (voiceOn && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance('No patients currently in the queue.');
        u.lang = 'en-NG';
        window.speechSynthesis.speak(u);
      }
      return;
    }
    speakTicket(next);
  }

  const called = tickets.filter((t) => t.status === 'called' || t.status === 'in_consultation');
  const upcoming = tickets
    .filter((t) => t.status === 'waiting')
    .sort((a, b) =>
      b.priority - a.priority !== 0 ? b.priority - a.priority : a.arrivedAt - b.arrivedAt
    )
    .slice(0, 6);

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-slate-950 text-white"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 700px at 50% -20%, rgba(0,139,139,0.35), transparent 60%), radial-gradient(900px 700px at 20% 120%, rgba(30,58,138,0.35), transparent 60%), radial-gradient(800px 500px at 90% 80%, rgba(253,186,116,0.15), transparent 60%), linear-gradient(180deg,#0A1628,#0D1B30)'
        }}
      />

      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col p-6 lg:p-10">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-200">
              Okene Reference Hospital · Live queue
            </p>
            <h1 className="mt-1 text-3xl font-bold lg:text-5xl">Now serving</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Animated clock with seconds */}
            <LiveClock date={now} />

            <button
              onClick={announceNext}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/10"
              aria-label="Announce next queue number"
            >
              <Volume2 className="h-4 w-4" />
              Announce next
            </button>
            <button
              onClick={() => setVoiceOn((v) => !v)}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-md transition-colors hover:bg-white/10"
              aria-label={voiceOn ? 'Mute voice announcements' : 'Enable voice announcements'}
              title={voiceOn ? 'Mute voice announcements' : 'Enable voice announcements'}
            >
              {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleFs}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-md transition-colors hover:bg-white/10"
              aria-label={isFs ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFs ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Counters grid */}
        <div className="mt-8 grid flex-1 gap-5 lg:grid-cols-3">
          {counters.slice(0, 6).map((c) => {
            const current = c.currentTicketId
              ? tickets.find((t) => t.id === c.currentTicketId)
              : null;
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
                  <div
                    className={`text-xs font-semibold ${
                      c.available ? 'text-emerald-300' : 'text-amber-300'
                    }`}
                  >
                    {c.available ? '● Open' : '◯ Paused'}
                  </div>
                </div>
                <div className="flex min-h-[200px] flex-col justify-center px-6 py-5 text-center">
                  <AnimatePresence mode="wait">
                    {current ? (
                      <motion.div
                        key={current.id}
                        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      >
                        <p className="font-mono text-7xl font-black leading-none tracking-tight text-white lg:text-8xl">
                          {current.number}
                        </p>
                        <p className="mt-4 text-xl font-semibold text-white/90 lg:text-2xl">
                          {current.patientName}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-widest text-primary-200">
                          {current.status === 'in_consultation'
                            ? 'In consultation'
                            : 'Please proceed'}
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
                        <p className="text-5xl font-black">—</p>
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

        {/* Ticker */}
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
          Emergency · 112 · care@okenehospital.ng
        </div>
      </div>
    </div>
  );
}

/** Animated digital clock with pulsing separators and seconds. */
function LiveClock({ date }: { date: Date }) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md">
      <div className="flex items-end gap-1 font-mono text-4xl font-black tabular-nums text-white lg:text-5xl">
        <DigitPair value={h} />
        <motion.span
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="text-primary-300"
        >
          :
        </motion.span>
        <DigitPair value={m} />
        <motion.span
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="text-primary-300"
        >
          :
        </motion.span>
        <motion.span
          key={s}
          initial={{ opacity: 0, y: -8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
          className="text-amber-300"
        >
          {s}
        </motion.span>
      </div>
      <p className="mt-1 text-right text-[10px] uppercase tracking-[0.22em] text-white/50">
        {date.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' })}
      </p>
    </div>
  );
}

function DigitPair({ value }: { value: string }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}
