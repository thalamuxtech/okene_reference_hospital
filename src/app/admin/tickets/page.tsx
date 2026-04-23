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
  Video,
  RotateCcw,
  Volume2,
  X
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
  const isDoctorBusy = useTicketStore((s) => s.isDoctorBusy);
  const addCounter = useTicketStore((s) => s.addCounter);
  const removeCounter = useTicketStore((s) => s.removeCounter);
  const [showAddCounter, setShowAddCounter] = useState(false);

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
          <div>
            <h2 className="text-lg font-bold text-slate-900">Counters</h2>
            <p className="text-xs text-slate-500">Assigned doctors · real-time state</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowAddCounter((v) => !v)}>
            <UserPlus className="h-3.5 w-3.5" />
            Add counter
          </Button>
        </div>
        <AnimatePresence>
          {showAddCounter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <NewCounterForm
                existing={counters.map((c) => c.counter)}
                onAdd={(n) => {
                  addCounter({
                    counter: n.counter,
                    department: n.department,
                    doctorId: null,
                    doctorName: null,
                    available: false
                  });
                  setShowAddCounter(false);
                }}
                onCancel={() => setShowAddCounter(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {counters.map((c) => {
            const current = c.currentTicketId ? tickets.find((t) => t.id === c.currentTicketId) : null;
            return (
              <CounterCard
                key={c.counter}
                counter={c}
                current={current ?? null}
                waiting={tickets.filter((t) => t.status === 'waiting' && t.department === c.department)}
                doctorBusyElsewhere={
                  c.doctorId != null && !c.currentTicketId && isDoctorBusy(c.doctorId)
                }
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
                onRemove={() => removeCounter(c.counter)}
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
  doctorBusyElsewhere,
  onCallNext,
  onStart,
  onComplete,
  onSkip,
  onToggleAvailable,
  onAssignDoctor,
  onRemove
}: {
  counter: CounterStatus;
  current: Ticket | null;
  waiting: Ticket[];
  doctorBusyElsewhere: boolean;
  onCallNext: () => void;
  onStart: () => void;
  onComplete: () => void;
  onSkip: () => void;
  onToggleAvailable: () => void;
  onAssignDoctor: (doctorId: string | null, name: string | null, department?: string) => void;
  onRemove: () => void;
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
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
              {counter.department}
            </p>
            <p className="text-xs font-semibold">{counter.doctorName ?? 'Unassigned'}</p>
          </div>
          <button
            onClick={() => {
              if (confirm(`Remove counter #${counter.counter}?`)) onRemove();
            }}
            className="rounded-lg bg-white/15 p-1.5 text-white transition-colors hover:bg-white/25"
            aria-label="Remove counter"
            title="Remove counter"
          >
            <X className="h-3.5 w-3.5" />
          </button>
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
            {doctorBusyElsewhere ? (
              <Badge variant="warning">
                <AlertTriangle className="h-3 w-3" />
                Doctor busy elsewhere
              </Badge>
            ) : (
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3" />
                Ready
              </Badge>
            )}
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
              <Button
                size="sm"
                onClick={onCallNext}
                disabled={waiting.length === 0 || doctorBusyElsewhere}
              >
                <SkipForward className="h-3.5 w-3.5" />
                Call next
              </Button>
              <Button size="sm" variant="ghost" onClick={onToggleAvailable}>
                <PauseCircle className="h-3.5 w-3.5" />
                Pause
              </Button>
              <Button size="sm" variant="outline" onClick={() => setAssignOpen((v) => !v)}>
                <UserPlus className="h-3.5 w-3.5" />
                {counter.doctorName ? 'Reassign' : 'Assign doctor'}
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


import { Input, Label } from "@/components/ui/input";
import { DEPARTMENTS_META } from "@/lib/ticket-store";

function NewCounterForm({
  existing,
  onAdd,
  onCancel
}: {
  existing: number[];
  onAdd: (data: { counter: number; department: string }) => void;
  onCancel: () => void;
}) {
  const nextCounter = Math.max(0, ...existing) + 1;
  const [counter, setCounter] = useState(String(nextCounter));
  const [department, setDepartment] = useState(DEPARTMENTS_META[0].name);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <p className="mb-3 text-sm font-bold text-slate-900">Add a new counter</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label>Counter number</Label>
          <Input
            type="number"
            min={1}
            value={counter}
            onChange={(e) => setCounter(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Department</Label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm focus:border-primary-500 focus:outline-none"
          >
            {DEPARTMENTS_META.map((d) => (
              <option key={d.code} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => {
            const n = Number(counter);
            if (!n || existing.includes(n)) {
              alert("Counter number must be unique and positive.");
              return;
            }
            onAdd({ counter: n, department });
          }}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add counter
        </Button>
      </div>
    </div>
  );
}
