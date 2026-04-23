'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SkipForward,
  Play,
  CheckCircle2,
  Clock,
  Save,
  FileText,
  Activity,
  AlertTriangle,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { DoctorShell } from '@/components/doctor/doctor-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Label, Textarea } from '@/components/ui/input';
import {
  useTicketStore,
  type Ticket,
  type ConsultationNote
} from '@/lib/ticket-store';
import { useRecordsStore } from '@/lib/records-store';

export default function DoctorQueuePage() {
  return (
    <DoctorShell title="My Queue">
      {(doctor) => <QueueBody doctorId={doctor.id} doctorFullName={`${doctor.title ?? 'Dr.'} ${doctor.firstName} ${doctor.lastName}`} department={doctor.department} />}
    </DoctorShell>
  );
}

function QueueBody({
  doctorId,
  doctorFullName,
  department
}: {
  doctorId: string;
  doctorFullName: string;
  department: string;
}) {
  const tickets = useTicketStore((s) => s.tickets);
  const counters = useTicketStore((s) => s.counters);
  const callNext = useTicketStore((s) => s.callNext);
  const startConsultation = useTicketStore((s) => s.startConsultation);
  const completeConsultation = useTicketStore((s) => s.completeConsultation);
  const skipTicket = useTicketStore((s) => s.skipTicket);
  const updateNote = useTicketStore((s) => s.updateConsultationNote);
  const setAvail = useTicketStore((s) => s.setCounterAvailability);
  const isDoctorBusy = useTicketStore((s) => s.isDoctorBusy);
  const addRecord = useRecordsStore((s) => s.addRecord);

  const myCounter = counters.find((c) => c.doctorId === doctorId);
  const current = useMemo(
    () =>
      tickets.find(
        (t) =>
          t.doctorId === doctorId &&
          (t.status === 'called' || t.status === 'in_consultation')
      ) ?? null,
    [tickets, doctorId]
  );

  const waiting = useMemo(
    () =>
      tickets
        .filter(
          (t) =>
            t.status === 'waiting' &&
            (!myCounter || t.department === myCounter.department)
        )
        .sort((a, b) =>
          b.priority - a.priority !== 0 ? b.priority - a.priority : a.arrivedAt - b.arrivedAt
        ),
    [tickets, myCounter]
  );

  if (!myCounter) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-10 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-600" />
        <h2 className="mt-3 text-lg font-bold text-amber-900">No counter assigned</h2>
        <p className="mt-1 text-sm text-amber-800">
          You do not currently have a counter in the hospital. Ask administration to assign you
          one so you can start calling patients.
        </p>
      </div>
    );
  }

  const busyElsewhere = current && current.counter !== myCounter.counter;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My consultation queue</h1>
          <p className="mt-1 text-sm text-slate-600">
            Counter <b>#{myCounter.counter}</b> · {myCounter.department} · You can see one patient
            at a time.
          </p>
        </div>
        <Button
          variant={myCounter.available ? 'outline' : 'primary'}
          onClick={() => setAvail(myCounter.counter, !myCounter.available)}
        >
          {myCounter.available ? (
            <>
              <PauseCircle className="h-4 w-4" />
              Pause counter
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4" />
              Re-open counter
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Current consultation */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {current ? (
              <ConsultationPanel
                key={current.id}
                ticket={current}
                doctorId={doctorId}
                doctorFullName={doctorFullName}
                department={department}
                onStart={() => startConsultation(current.id)}
                onComplete={(note) => {
                  // Save record + mark complete
                  updateNote(current.id, note);
                  addRecord({
                    patientName: current.patientName,
                    patientPhone: current.phone,
                    date: Date.now(),
                    doctorId,
                    doctorName: doctorFullName,
                    department,
                    chiefComplaint: note.chiefComplaint ?? '',
                    diagnosis: note.diagnosis ?? '',
                    treatmentPlan: note.treatmentPlan ?? '',
                    prescription: note.prescription ?? '',
                    vitals: note.vitals ?? {},
                    followUpDate: note.followUpDate,
                    notes: note.notes
                  });
                  completeConsultation(myCounter.counter);
                  toast.success('Consultation completed · Record saved');
                }}
                onSkip={() => {
                  skipTicket(current.id);
                  toast.message(`Ticket ${current.number} marked as no-show`);
                }}
                onSaveDraft={(note) => {
                  updateNote(current.id, note);
                  toast.success('Consultation note saved');
                }}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <FileText className="h-7 w-7 text-slate-500" />
                </div>
                <p className="mt-4 text-base font-semibold text-slate-900">
                  No patient in your consultation room.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Use <b>Call next</b> on the right to bring in the next waiting patient.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Waiting queue */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Waiting ({waiting.length})
                </h2>
                <p className="text-[11px] text-slate-500">
                  Sorted by priority · earliest arrival
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (isDoctorBusy(doctorId)) {
                    toast.error(
                      'You already have a patient. Complete the current consultation first.'
                    );
                    return;
                  }
                  const t = callNext(myCounter.counter);
                  if (!t) {
                    toast.error('No patient to call.');
                  } else {
                    toast.success(`Called ${t.number} · ${t.patientName}`);
                  }
                }}
                disabled={Boolean(busyElsewhere) || !myCounter.available || !!current}
              >
                <SkipForward className="h-3.5 w-3.5" />
                Call next
              </Button>
            </div>

            {waiting.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No patients waiting in {myCounter.department}.
              </div>
            ) : (
              <div className="max-h-[520px] divide-y divide-slate-100 overflow-y-auto">
                <AnimatePresence initial={false}>
                  {waiting.map((t, i) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50"
                    >
                      <div className="w-12 text-center">
                        <p className="font-mono text-sm font-black text-slate-900">{t.number}</p>
                        <p className="text-[9px] font-semibold uppercase text-slate-500">
                          #{i + 1}
                        </p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {t.patientName}
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="h-3 w-3" />
                          {new Date(t.arrivedAt).toLocaleTimeString('en-NG', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {t.priority === 2 && <Badge variant="danger">Emergency</Badge>}
                      {t.priority === 1 && <Badge variant="warning">Priority</Badge>}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsultationPanel({
  ticket,
  onStart,
  onComplete,
  onSkip,
  onSaveDraft
}: {
  ticket: Ticket;
  doctorId: string;
  doctorFullName: string;
  department: string;
  onStart: () => void;
  onComplete: (note: ConsultationNote) => void;
  onSkip: () => void;
  onSaveDraft: (note: ConsultationNote) => void;
}) {
  const [note, setNote] = useState<ConsultationNote>(ticket.consultationNote ?? {});
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Re-load note if ticket id changes (new patient).
  useEffect(() => {
    setNote(ticket.consultationNote ?? {});
  }, [ticket.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const elapsedSec =
    ticket.status === 'in_consultation' && ticket.consultStartAt
      ? Math.max(0, Math.floor((now - ticket.consultStartAt) / 1000))
      : 0;

  const callCountdownMs = ticket.calledExpiresAt
    ? Math.max(0, ticket.calledExpiresAt - now)
    : 0;
  const callPct = ticket.calledExpiresAt ? 1 - callCountdownMs / 120_000 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-primary-50/60 to-white p-5">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-mono text-4xl font-black leading-none text-slate-900">
                {ticket.number}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Ticket
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{ticket.patientName}</h2>
              <p className="text-xs text-slate-500">
                {ticket.department} ·{' '}
                {ticket.phone ? (
                  <a href={`tel:${ticket.phone}`} className="hover:text-primary-600">
                    {ticket.phone}
                  </a>
                ) : (
                  'Walk-in'
                )}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ticket.priority === 2 && <Badge variant="danger">Emergency</Badge>}
                {ticket.priority === 1 && <Badge variant="warning">Priority</Badge>}
                {ticket.status === 'called' && <Badge variant="info">Called</Badge>}
                {ticket.status === 'in_consultation' && (
                  <Badge variant="success">
                    <Activity className="h-3 w-3" />
                    In consultation
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {ticket.status === 'called' && (
              <Button size="md" onClick={onStart}>
                <Play className="h-4 w-4" />
                Start consultation
              </Button>
            )}
            <Button size="md" variant="ghost" onClick={onSkip}>
              <SkipForward className="h-4 w-4" />
              No-show
            </Button>
          </div>
        </div>

        {/* Called countdown */}
        {ticket.status === 'called' && (
          <div className="border-b border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Waiting for patient at counter
              </span>
              <span className="font-mono">
                {String(Math.floor(callCountdownMs / 60000)).padStart(2, '0')}:
                {String(Math.floor((callCountdownMs / 1000) % 60)).padStart(2, '0')}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-200">
              <motion.div
                className="h-full bg-amber-500"
                animate={{ width: `${Math.min(100, callPct * 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
        {ticket.status === 'in_consultation' && (
          <div className="border-b border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Consultation in progress
              </span>
              <span className="font-mono font-bold">
                {String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:
                {String(elapsedSec % 60).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Consultation note form */}
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-900">Consultation note</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            All fields save to the patient&apos;s medical record when you complete the
            consultation.
          </p>
        </div>

        <div>
          <Label htmlFor="cc">Chief complaint</Label>
          <Textarea
            id="cc"
            rows={2}
            value={note.chiefComplaint ?? ''}
            onChange={(e) => setNote({ ...note, chiefComplaint: e.target.value })}
            placeholder="e.g. Fever, headache for 3 days"
          />
        </div>

        <div>
          <Label>Vitals</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Input
              placeholder="BP e.g. 120/80"
              value={note.vitals?.bp ?? ''}
              onChange={(e) =>
                setNote({ ...note, vitals: { ...note.vitals, bp: e.target.value } })
              }
            />
            <Input
              placeholder="Pulse"
              value={note.vitals?.pulse ?? ''}
              onChange={(e) =>
                setNote({ ...note, vitals: { ...note.vitals, pulse: e.target.value } })
              }
            />
            <Input
              placeholder="Temp °C"
              value={note.vitals?.temp ?? ''}
              onChange={(e) =>
                setNote({ ...note, vitals: { ...note.vitals, temp: e.target.value } })
              }
            />
            <Input
              placeholder="Weight kg"
              value={note.vitals?.weight ?? ''}
              onChange={(e) =>
                setNote({ ...note, vitals: { ...note.vitals, weight: e.target.value } })
              }
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="diag">Diagnosis</Label>
            <Textarea
              id="diag"
              rows={3}
              value={note.diagnosis ?? ''}
              onChange={(e) => setNote({ ...note, diagnosis: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="tp">Treatment plan</Label>
            <Textarea
              id="tp"
              rows={3}
              value={note.treatmentPlan ?? ''}
              onChange={(e) => setNote({ ...note, treatmentPlan: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="rx">Prescription</Label>
          <Textarea
            id="rx"
            rows={3}
            value={note.prescription ?? ''}
            onChange={(e) => setNote({ ...note, prescription: e.target.value })}
            placeholder="Drug · dose · frequency · duration"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="fu">Follow-up date</Label>
            <Input
              id="fu"
              type="date"
              value={note.followUpDate ?? ''}
              onChange={(e) => setNote({ ...note, followUpDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="n">Notes</Label>
            <Input
              id="n"
              value={note.notes ?? ''}
              onChange={(e) => setNote({ ...note, notes: e.target.value })}
              placeholder="Additional notes"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
          <Button variant="outline" onClick={() => onSaveDraft(note)}>
            <Save className="h-4 w-4" />
            Save draft
          </Button>
          <Button
            onClick={() => onComplete(note)}
            disabled={ticket.status !== 'in_consultation'}
          >
            <CheckCircle2 className="h-4 w-4" />
            Complete consultation
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
