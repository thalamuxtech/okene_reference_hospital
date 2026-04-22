'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock,
  Stethoscope,
  FileText,
  ShieldCheck,
  Sparkles,
  Star
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { DOCTORS, SPECIALTIES, generateTimeSlots, type Doctor } from '@/lib/seed-data';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

const STEPS = [
  { id: 1, label: 'Specialty', icon: Stethoscope },
  { id: 2, label: 'Doctor', icon: Stethoscope },
  { id: 3, label: 'Date & Time', icon: CalendarIcon },
  { id: 4, label: 'Details', icon: FileText },
  { id: 5, label: 'Confirm', icon: ShieldCheck }
] as const;

type State = {
  specialtyId?: string;
  doctorId?: string;
  date?: string;
  time?: string;
  appointmentType: 'consultation' | 'follow_up' | 'telehealth';
  reason: string;
  symptoms: string;
  name: string;
  phone: string;
};

export default function BookPage() {
  return (
    <Suspense fallback={<div className="container py-20">Loading…</div>}>
      <BookWizard />
    </Suspense>
  );
}

function BookWizard() {
  const params = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [confirmation, setConfirmation] = useState<string>('');

  const [state, setState] = useState<State>({
    specialtyId: params.get('specialty') ?? undefined,
    doctorId: params.get('doctor') ?? undefined,
    date: undefined,
    time: params.get('time') ?? undefined,
    appointmentType: (params.get('type') as any) === 'telehealth' ? 'telehealth' : 'consultation',
    reason: '',
    symptoms: '',
    name: '',
    phone: ''
  });

  // If doctor was pre-selected, derive specialty
  useEffect(() => {
    if (state.doctorId && !state.specialtyId) {
      const d = DOCTORS.find((x) => x.id === state.doctorId);
      if (d) setState((s) => ({ ...s, specialtyId: d.specialtyId }));
    }
  }, [state.doctorId, state.specialtyId]);

  // Jump start step if preselected
  useEffect(() => {
    if (state.doctorId && state.time) setStep(4);
    else if (state.doctorId) setStep(3);
    else if (state.specialtyId) setStep(2);
  }, []); // eslint-disable-line

  const doctors = useMemo(
    () => DOCTORS.filter((d) => !state.specialtyId || d.specialtyId === state.specialtyId),
    [state.specialtyId]
  );

  const doctor = useMemo(() => DOCTORS.find((d) => d.id === state.doctorId), [state.doctorId]);

  const slots = useMemo(() => {
    if (!doctor) return [];
    return generateTimeSlots(doctor.workingHours.start, doctor.workingHours.end);
  }, [doctor]);

  const canContinue = useMemo(() => {
    if (step === 1) return !!state.specialtyId;
    if (step === 2) return !!state.doctorId;
    if (step === 3) return !!state.date && !!state.time;
    if (step === 4) return state.reason.trim().length >= 5 && state.name.trim().length >= 2 && /^(\+234|0)[0-9]{10}$/.test(state.phone);
    return true;
  }, [step, state]);

  function next() {
    if (!canContinue) {
      toast.error('Please complete the required fields');
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function submit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    const num = 'APT-2026-' + Math.floor(10000 + Math.random() * 89999);
    setConfirmation(num);
    setDone(true);
    setSubmitting(false);
    toast.success('Appointment booked!', { description: `Confirmation ${num} sent to your phone.` });
  }

  if (done) return <BookingSuccess number={confirmation} state={state} doctor={doctor} />;

  return (
    <div className="relative min-h-screen pb-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[360px] gradient-hero" />

      <div className="container pt-10 lg:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> Appointment booking
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
            Book your visit in 5 quick steps
          </h1>
          <p className="mt-3 text-sm text-slate-600 lg:text-base">
            Real-time availability · Instant SMS confirmation · Free to reschedule.
          </p>
        </div>

        {/* Stepper */}
        <div className="mx-auto mt-10 max-w-3xl">
          <LayoutGroup>
            <div className="relative flex items-center justify-between">
              <div aria-hidden className="absolute inset-x-6 top-5 h-[2px] bg-slate-200" />
              <motion.div
                aria-hidden
                className="absolute left-6 top-5 h-[2px] origin-left bg-primary-500"
                animate={{ scaleX: (step - 1) / (STEPS.length - 1) }}
                style={{ width: 'calc(100% - 48px)' }}
                transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
              />
              {STEPS.map((s) => {
                const state = s.id < step ? 'done' : s.id === step ? 'active' : 'todo';
                return (
                  <div key={s.id} className="relative flex flex-col items-center gap-2">
                    <motion.div
                      layout
                      className={cn(
                        'relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors',
                        state === 'done' && 'border-primary-500 bg-primary-500 text-white',
                        state === 'active' && 'border-primary-500 bg-white text-primary-600 shadow-glow-teal',
                        state === 'todo' && 'border-slate-300 bg-white text-slate-400'
                      )}
                    >
                      {state === 'done' ? <Check className="h-5 w-5" /> : s.id}
                    </motion.div>
                    <span
                      className={cn(
                        'hidden text-xs font-semibold sm:block',
                        state !== 'todo' ? 'text-slate-900' : 'text-slate-400'
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        {/* Step body */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-lg sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
              >
                {step === 1 && (
                  <StepSpecialty
                    value={state.specialtyId}
                    onChange={(id) => setState((s) => ({ ...s, specialtyId: id, doctorId: undefined }))}
                  />
                )}
                {step === 2 && (
                  <StepDoctor
                    doctors={doctors}
                    value={state.doctorId}
                    onChange={(id) => setState((s) => ({ ...s, doctorId: id }))}
                  />
                )}
                {step === 3 && (
                  <StepDateTime
                    slots={slots}
                    date={state.date}
                    time={state.time}
                    onDate={(d) => setState((s) => ({ ...s, date: d }))}
                    onTime={(t) => setState((s) => ({ ...s, time: t }))}
                  />
                )}
                {step === 4 && (
                  <StepDetails
                    state={state}
                    onChange={(patch) => setState((s) => ({ ...s, ...patch }))}
                    telehealthAvailable={!!doctor?.telehealthAvailable}
                  />
                )}
                {step === 5 && <StepConfirm state={state} doctor={doctor!} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="md"
              onClick={back}
              disabled={step === 1}
              className="text-slate-600"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            {step < 5 ? (
              <Button onClick={next} disabled={!canContinue} size="lg">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit} loading={submitting} size="lg">
                <Check className="h-4 w-4" />
                Confirm booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepSpecialty({ value, onChange }: { value?: string; onChange: (id: string) => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">Which specialty do you need?</h2>
      <p className="mt-1 text-sm text-slate-600">Pick the area of care closest to your concern.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SPECIALTIES.map((s) => {
          const active = value === s.id;
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all',
                active
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-primary-300'
              )}
            >
              <div className={cn('absolute inset-0 -z-0 bg-gradient-to-br opacity-40', s.gradient)} />
              <div className="relative">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl ring-1 ring-slate-200">
                  {s.icon}
                </div>
                <p className="text-sm font-bold text-slate-900">{s.name}</p>
                <p className="mt-0.5 text-xs text-slate-600">{s.description}</p>
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white shadow"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function StepDoctor({
  doctors,
  value,
  onChange
}: {
  doctors: Doctor[];
  value?: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">Choose your doctor</h2>
      <p className="mt-1 text-sm text-slate-600">
        {doctors.length} {doctors.length === 1 ? 'doctor' : 'doctors'} available.
      </p>

      <div className="mt-6 space-y-3">
        {doctors.map((d) => {
          const active = value === d.id;
          return (
            <motion.button
              key={d.id}
              type="button"
              onClick={() => onChange(d.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition-all',
                active
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-primary-300'
              )}
            >
              <Image
                src={d.photoURL}
                alt={`${d.firstName} ${d.lastName}`}
                width={64}
                height={64}
                className="h-16 w-16 flex-shrink-0 rounded-full object-cover ring-2 ring-white"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {d.title ?? 'Dr.'} {d.firstName} {d.lastName}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {d.averageRating.toFixed(2)} ({d.totalReviews})
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-primary-600">{d.qualification.join(', ')}</p>
                <p className="mt-0.5 text-xs text-slate-600">
                  {d.yearsOfExperience}y · {d.languages.slice(0, 2).join(', ')}
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {formatCurrency(d.consultationFee)}
                </p>
              </div>
              {active && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-white"
                >
                  <Check className="h-3.5 w-3.5" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function StepDateTime({
  slots,
  date,
  time,
  onDate,
  onTime
}: {
  slots: { time: string; available: boolean }[];
  date?: string;
  time?: string;
  onDate: (d: string) => void;
  onTime: (t: string) => void;
}) {
  // Next 14 days
  const days = useMemo(() => {
    const arr: { key: string; label: string; sub: string; disabled: boolean }[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      arr.push({
        key,
        label: d.toLocaleDateString('en-NG', { weekday: 'short' }),
        sub: d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }),
        disabled: d.getDay() === 0
      });
    }
    return arr;
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">Pick a date & time</h2>
      <p className="mt-1 text-sm text-slate-600">Live availability updates every few seconds.</p>

      <div className="mt-6">
        <Label>Date</Label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {days.map((d) => {
            const active = date === d.key;
            return (
              <button
                key={d.key}
                disabled={d.disabled}
                onClick={() => onDate(d.key)}
                className={cn(
                  'flex-shrink-0 rounded-xl border-2 px-4 py-3 text-center transition-all',
                  active && 'border-primary-500 bg-primary-50',
                  !active &&
                    !d.disabled &&
                    'border-slate-200 bg-white hover:border-primary-300',
                  d.disabled && 'border-slate-100 bg-slate-50 text-slate-400'
                )}
              >
                <p className={cn('text-xs font-semibold uppercase', active ? 'text-primary-700' : 'text-slate-500')}>
                  {d.label}
                </p>
                <p className={cn('mt-0.5 text-sm font-bold', active ? 'text-primary-700' : 'text-slate-900')}>
                  {d.sub}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <Label>Time</Label>
        {!date ? (
          <p className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">
            Select a date to see available times
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {slots.map((s) => (
              <motion.button
                key={s.time}
                disabled={!s.available}
                onClick={() => onTime(s.time)}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  'rounded-lg border-2 px-3 py-2.5 text-sm font-semibold transition-all',
                  time === s.time && 'border-primary-500 bg-primary-500 text-white',
                  time !== s.time && s.available && 'border-slate-200 text-slate-700 hover:border-primary-300',
                  !s.available && 'border-slate-100 bg-slate-50 text-slate-400 line-through'
                )}
              >
                <Clock className="mr-1 inline h-3 w-3 opacity-60" />
                {s.time}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StepDetails({
  state,
  onChange,
  telehealthAvailable
}: {
  state: State;
  onChange: (p: Partial<State>) => void;
  telehealthAvailable: boolean;
}) {
  const types = [
    { id: 'consultation', label: 'First consultation', desc: 'Initial visit for diagnosis' },
    { id: 'follow_up', label: 'Follow-up', desc: 'Continuing care or check-up' },
    ...(telehealthAvailable
      ? [{ id: 'telehealth', label: 'Telehealth (video)', desc: 'See the doctor from home' }]
      : [])
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Tell us more</h2>
        <p className="mt-1 text-sm text-slate-600">Help the doctor prepare for your visit.</p>
      </div>

      <div>
        <Label>Appointment type</Label>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((t) => {
            const active = state.appointmentType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onChange({ appointmentType: t.id as State['appointmentType'] })}
                className={cn(
                  'rounded-xl border-2 p-4 text-left transition-all',
                  active ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-white hover:border-primary-300'
                )}
              >
                <p className="text-sm font-bold text-slate-900">{t.label}</p>
                <p className="mt-0.5 text-xs text-slate-600">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Patient name</Label>
          <Input
            id="name"
            value={state.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Full name"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone (for SMS confirmation)</Label>
          <Input
            id="phone"
            value={state.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+234 803 000 0000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="reason">Reason for visit</Label>
        <Textarea
          id="reason"
          rows={3}
          value={state.reason}
          onChange={(e) => onChange({ reason: e.target.value })}
          placeholder="Briefly describe why you need this appointment…"
        />
      </div>

      <div>
        <Label htmlFor="symptoms">Current symptoms (optional)</Label>
        <Textarea
          id="symptoms"
          rows={3}
          value={state.symptoms}
          onChange={(e) => onChange({ symptoms: e.target.value })}
          placeholder="List any symptoms you are experiencing…"
        />
      </div>
    </div>
  );
}

function StepConfirm({ state, doctor }: { state: State; doctor: Doctor }) {
  const specialty = SPECIALTIES.find((s) => s.id === state.specialtyId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Review & confirm</h2>
        <p className="mt-1 text-sm text-slate-600">Check the details then confirm your booking.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white">
        <div className="flex items-center gap-4 border-b border-primary-200/60 p-5">
          <Image
            src={doctor.photoURL}
            alt={doctor.firstName}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-white"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
              {specialty?.name}
            </p>
            <p className="text-base font-bold text-slate-900">
              {doctor.title ?? 'Dr.'} {doctor.firstName} {doctor.lastName}
            </p>
            <p className="text-xs text-slate-600">{doctor.qualification.join(', ')}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-4 p-5 text-sm">
          <Row label="Date" value={state.date ? formatDate(state.date) : '—'} />
          <Row label="Time" value={state.time ?? '—'} />
          <Row label="Type" value={state.appointmentType.replace('_', ' ')} className="capitalize" />
          <Row label="Patient" value={state.name || '—'} />
          <Row label="Phone" value={state.phone || '—'} />
          <Row label="Fee" value={formatCurrency(doctor.consultationFee)} bold />
        </dl>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
        <div>
          <p className="font-semibold">Reminders & confirmation</p>
          <p className="mt-0.5 text-blue-800/90">
            You’ll receive an instant SMS confirmation, plus reminders 24 hours and 2 hours before
            your appointment.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  className
}: {
  label: string;
  value: string;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className={cn('mt-0.5 text-slate-900', bold ? 'text-lg font-bold' : 'font-medium', className)}>
        {value}
      </dd>
    </div>
  );
}

function BookingSuccess({
  number,
  state,
  doctor
}: {
  number: string;
  state: State;
  doctor?: Doctor;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-hero" />
      <div className="container flex min-h-screen flex-col items-center justify-center py-20">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-2xl shadow-emerald-500/30"
        >
          <motion.svg
            viewBox="0 0 52 52"
            className="h-14 w-14 text-white"
          >
            <motion.path
              d="M14 27 L23 36 L40 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeInOut' }}
            />
          </motion.svg>
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-emerald-300"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-3xl font-bold text-slate-900 sm:text-4xl"
        >
          You’re all set!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-2 max-w-lg text-center text-slate-600"
        >
          Your appointment has been confirmed. A copy has been sent to {state.phone || 'your phone'}.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        >
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            {doctor && (
              <Image
                src={doctor.photoURL}
                alt={doctor.firstName}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Confirmation
              </p>
              <p className="font-mono text-lg font-bold text-slate-900">{number}</p>
            </div>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Doctor</dt>
              <dd className="font-semibold text-slate-900">
                {doctor?.title ?? 'Dr.'} {doctor?.firstName} {doctor?.lastName}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Date</dt>
              <dd className="font-semibold text-slate-900">
                {state.date ? formatDate(state.date) : '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Time</dt>
              <dd className="font-semibold text-slate-900">{state.time}</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-6 flex gap-3"
        >
          <Button variant="outline" onClick={() => (window.location.href = '/dashboard')}>
            View dashboard
          </Button>
          <Button onClick={() => (window.location.href = '/')}>Back to home</Button>
        </motion.div>
      </div>
    </div>
  );
}
