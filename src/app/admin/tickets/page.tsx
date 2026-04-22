'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { useTicketStore, type Ticket, type CounterStatus } from '@/lib/ticket-store';
import { DOCTORS } from '@/lib/seed-data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SkipForward,
  CheckCircle2,
  Play,
  Clock,
  UserPlus,
  Ticket as TicketIcon,
  AlertTriangle,
  PauseCircle,
  Users,
  Video,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AdminTicketsPage() {
  const tickets = useTicketStore((s) => s.tickets);
  const counters = useTicketStore((s) => s.counters);
  const callNext = useTicketStore((s) => s.callNext);
  const startConsultation = useTicketStore((s) => s.startConsultation);
  const completeConsultation = useTicketStore((s) => s.completeConsultation);
  const skipTicket = useTicketStore((s) => s.skipTicket);
  const setCounterAvailability = useTicketStore((s) => s.setCounterAvailability);
  const assignDoctorToCounter = useTicketStore((s) => s.assignDoctorToCounter);
  const resetAll = useTicketStore((s) => s.resetAll);

  const waiting = tickets.filter((t) => t.status === 'waiting');
  const completed = tickets.filter((t) => t.status === 'completed');
  const inConsult = tickets.filter((t) => t.status === 'in_consultation').length;
  const skipped = tickets.filter((t) => t.status === 'skipped').length;

  return (
    <AdminShell title="Tickets & Consultations">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Consultation management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Live ticket queue · counter assignment · available-doctor panel · call-next with countdown.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/queue-display" target="_blank" rel="noreferrer" className="btn-outline h-10">
            <Volume2 className="h-4 w-4" /> Open TV display
          </a>
          <Button variant="outline" onClick={() => resetAll()}>
            <RotateCcw className="h-4 w-4" /> Reset demo
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Waiting" value={waiting.length} icon={TicketIcon} color="bg-amber-100 text-amber-700" />
        <Stat label="In consultation" value={inConsult} icon={Video} color="bg-emerald-100 text-emerald-700" />
        <Stat label="Completed today" value={completed.length} icon={CheckCircle2} color="bg-primary-100 text-primary-700" />
        <Stat label="Skipped / no-show" value={skipped} icon={AlertTriangle} color="bg-red-100 text-red-700" />
      </div>

      {/* Counters grid */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Counters</h2>
          <p className="text-xs text-slate-500">Assigned doctors · real-time state</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {counters.map((c) => {
            const current = c.currentTicketId ? tickets.find((t) => t.id === c.currentTicketId) : null;
            return (
              <CounterCard
                key={c.counter}
                counter={c}
                current={current ?? null}
                waiting={tickets.filter((t) => t.status === 'waiting' && t.department === c.department)}
                onCallNext={() => {
                  const t = callNext(c.counter);
                  if (!t) return;
                }}
                onStart={() => current && startConsultation(current.id)}
                onComplete={() => completeConsultation(c.counter)}
                onSkip={() => current && skipTicket(current.id)}
                onToggleAvailable={() => setCounterAvailability(c.counter, !c.available)}
                onAssignDoctor={(doctorId, name, department) =>
                  assignDoctorToCounter(c.counter, doctorId, name, department)
                }
              />
            );
          })}
        </div>
      </div>

      {/* Waiting queue */}
      <WaitingQueue tickets={tickets} />
    </AdminShell>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  color
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
    >
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </motion.div>
  );
}

function CounterCard({
  counter,
  current,
  waiting,
  onCallNext,
  onStart,
  onComplete,
  onSkip,
  onToggleAvailable,
  onAssignDoctor
}: {
  counter: CounterStatus;
  current: Ticket | null;
  waiting: Ticket[];
  onCallNext: () => void;
  onStart: () => void;
  onComplete: () => void;
  onSkip: () => void;
  onToggleAvailable: () => void;
  onAssignDoctor: (doctorId: string | null, name: string | null, department?: string) => void;
}) {
  const [assignOpen, setAssignOpen] = useState(false);

  return (
    <motion.div
      layout
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-white shadow-xs transition-all',
        current?.status === 'called' ? 'border-primary-400 ring-2 ring-primary-400/30' : 'border-slate-200'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between px-5 py-3 text-white',
          counter.available
            ? 'bg-gradient-to-br from-primary-600 to-navy-700'
            : 'bg-gradient-to-br from-slate-500 to-slate-700'
        )}
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">Counter</p>
          <p className="text-2xl font-black leading-none">#{counter.counter}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
            {counter.department}
          </p>
          <p className="text-xs font-semibold">{counter.doctorName ?? 'Unassigned'}</p>
        </div>
      </div>

      <div className="p-5">
        {!counter.available ? (
          <div className="flex flex-col items-start gap-3">
            <Badge variant="warning">
              <PauseCircle className="h-3 w-3" />
              Unavailable
            </Badge>
            <p className="text-xs text-slate-600">
              This counter is paused. Patients will not be called here until re-opened.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={onToggleAvailable}>
                <Play className="h-3.5 w-3.5" />
                Re-open counter
              </Button>
              <Button size="sm" variant="outline" onClick={() => setAssignOpen((v) => !v)}>
                <UserPlus className="h-3.5 w-3.5" /> Assign doctor
              </Button>
            </div>
          </div>
        ) : current ? (
          <CurrentTicketPanel
            current={current}
            onStart={onStart}
            onComplete={onComplete}
            onSkip={onSkip}
          />
        ) : (
          <div className="flex flex-col items-start gap-3">
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" />
              Ready
            </Badge>
            <p className="text-xs text-slate-600">
              <b>{waiting.length}</b> patient{waiting.length === 1 ? '' : 's'} waiting in {counter.department}.
            </p>
            {waiting.length > 0 && (
              <p className="font-mono text-xs text-slate-500">
                Next up:{' '}
                <span className="font-bold text-slate-900">{waiting[0]?.number}</span> ·{' '}
                {waiting[0]?.patientName}
              </p>
            )}
            <div className="flex gap-2">
              <Button size="sm" onClick={onCallNext} disabled={waiting.length === 0}>
                <SkipForward className="h-3.5 w-3.5" />
                Call next
              </Button>
              <Button size="sm" variant="ghost" onClick={onToggleAvailable}>
                <PauseCircle className="h-3.5 w-3.5" />
                Pause
              </Button>
            </div>
          </div>
        )}

        <AnimatePresence>
          {assignOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Available doctors
              </p>
              <div className="grid grid-cols-1 gap-2">
                {DOCTORS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onAssignDoctor(
                        d.id,
                        `${d.title ?? 'Dr.'} ${d.firstName} ${d.lastName}`,
                        d.department
                      );
                      setAssignOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-lg border border-transparent bg-white p-2 text-left hover:border-primary-300"
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d.photoURL} alt={d.firstName} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-900">
                        {d.title ?? 'Dr.'} {d.firstName} {d.lastName}
                      </p>
                      <p className="truncate text-[10px] text-slate-500">{d.department}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CurrentTicketPanel({
  current,
  onStart,
  onComplete,
  onSkip
}: {
  current: Ticket;
  onStart: () => void;
  onComplete: () => void;
  onSkip: () => void;
}) {
  // Live countdown for the "please come to counter" 2-min window once called
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsedConsultSec =
    current.status === 'in_consultation' && current.consultStartAt
      ? Math.max(0, Math.floor((now - current.consultStartAt) / 1000))
      : 0;

  const callCountdownMs = current.calledExpiresAt ? Math.max(0, current.calledExpiresAt - now) : 0;
  const callCountdownPct = current.calledExpiresAt
    ? 1 - callCountdownMs / 120_000
    : 0;

  return (
    <div>
      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
        <div className="text-center">
          <p className="font-mono text-3xl font-black text-slate-900">{current.number}</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Ticket
          </p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900">{current.patientName}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Arrived{' '}
            {new Date(current.arrivedAt).toLocaleTimeString('en-NG', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {current.priority === 2 && <Badge variant="danger">Emergency</Badge>}
            {current.priority === 1 && <Badge variant="warning">Priority</Badge>}
            {current.status === 'called' && <Badge variant="info">Called</Badge>}
            {current.status === 'in_consultation' && <Badge variant="success">In consultation</Badge>}
          </div>
        </div>
      </div>

      {/* Called countdown */}
      {current.status === 'called' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Awaiting patient at counter
            </span>
            <span className="font-mono">
              {String(Math.floor(callCountdownMs / 60000)).padStart(2, '0')}:
              {String(Math.floor((callCountdownMs / 1000) % 60)).padStart(2, '0')}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-200">
            <motion.div
              className="h-full bg-amber-500"
              animate={{ width: `${Math.min(100, callCountdownPct * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Consult elapsed */}
      {current.status === 'in_consultation' && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold">
              <Video className="h-3.5 w-3.5" /> Consultation in progress
            </span>
            <span className="font-mono font-bold">
              {String(Math.floor(elapsedConsultSec / 60)).padStart(2, '0')}:
              {String(elapsedConsultSec % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        {current.status === 'called' && (
          <Button size="sm" onClick={onStart}>
            <Play className="h-3.5 w-3.5" />
            Start consultation
          </Button>
        )}
        {current.status === 'in_consultation' && (
          <Button size="sm" onClick={onComplete}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Complete
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onSkip}>
          <SkipForward className="h-3.5 w-3.5" />
          Skip / No-show
        </Button>
      </div>
    </div>
  );
}

function WaitingQueue({ tickets }: { tickets: Ticket[] }) {
  const waiting = useMemo(
    () =>
      tickets
        .filter((t) => t.status === 'waiting')
        .sort((a, b) =>
          b.priority - a.priority !== 0 ? b.priority - a.priority : a.arrivedAt - b.arrivedAt
        ),
    [tickets]
  );

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Waiting queue ({waiting.length})</h2>
        <p className="text-xs text-slate-500">Sorted by priority, then arrival time</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {waiting.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-500">No patients waiting. 👌</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {waiting.map((t, i) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50"
                >
                  <div className="w-16 text-center">
                    <p className="font-mono text-lg font-black text-slate-900">{t.number}</p>
                    <p className="text-[10px] font-semibold uppercase text-slate-500">#{i + 1}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{t.patientName}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{t.department}</span>
                      <span>·</span>
                      <span>
                        arrived{' '}
                        {new Date(t.arrivedAt).toLocaleTimeString('en-NG', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {t.estimatedWaitMin != null && (
                        <>
                          <span>·</span>
                          <span>~{t.estimatedWaitMin} min</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.priority === 2 && <Badge variant="danger">Emergency</Badge>}
                    {t.priority === 1 && <Badge variant="warning">Priority</Badge>}
                    {t.priority === 0 && <Badge variant="default">Normal</Badge>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
