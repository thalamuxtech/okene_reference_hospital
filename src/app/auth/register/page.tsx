'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { User, Phone, MapPin, Heart, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Logo } from '@/components/layout/logo';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, label: 'Identity', icon: User },
  { id: 2, label: 'Contact', icon: MapPin },
  { id: 3, label: 'Health', icon: Heart }
];

type State = {
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | '';
  phone: string;
  email: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
  bloodGroup: string;
  allergies: string;
  consentData: boolean;
  consentSMS: boolean;
};

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [s, setS] = useState<State>({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    emergencyName: '',
    emergencyPhone: '',
    bloodGroup: '',
    allergies: '',
    consentData: false,
    consentSMS: true
  });

  function canContinue(): boolean {
    if (step === 1)
      return (
        s.firstName.trim().length >= 2 &&
        s.lastName.trim().length >= 2 &&
        !!s.dob &&
        !!s.gender &&
        /^(\+234|0)[0-9]{10}$/.test(s.phone)
      );
    if (step === 2)
      return s.address.trim().length >= 5 && /^(\+234|0)[0-9]{10}$/.test(s.emergencyPhone);
    if (step === 3) return s.consentData;
    return true;
  }

  async function submit() {
    if (!canContinue()) {
      toast.error('Please complete the required fields');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    const id = 'ORH-2026-' + Math.floor(10000 + Math.random() * 89999);
    setPatientId(id);
    setDone(true);
    setSubmitting(false);
  }

  if (done) return <RegisterSuccess id={patientId} name={`${s.firstName} ${s.lastName}`} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <Logo size={60} wordmarkSize="lg" />
        <Link href="/auth/login" className="text-xs font-semibold text-primary-600 hover:underline">
          Have an account?
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Takes about 2 minutes — and you can save and continue later.
      </p>

      {/* Stepper */}
      <LayoutGroup>
        <div className="mt-6 flex items-center justify-between">
          {STEPS.map((st, i) => {
            const state = st.id < step ? 'done' : st.id === step ? 'active' : 'todo';
            return (
              <div key={st.id} className="flex flex-1 items-center">
                <div
                  className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors',
                    state === 'done' && 'border-primary-500 bg-primary-500 text-white',
                    state === 'active' && 'border-primary-500 bg-white text-primary-600 shadow-glow-teal',
                    state === 'todo' && 'border-slate-300 bg-white text-slate-400'
                  )}
                >
                  {state === 'done' ? <Check className="h-4 w-4" /> : st.id}
                </div>
                <span
                  className={cn(
                    'ml-2 hidden text-xs font-semibold sm:inline',
                    state !== 'todo' ? 'text-slate-900' : 'text-slate-400'
                  )}
                >
                  {st.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="mx-2 h-[2px] flex-1 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      className="h-full bg-primary-500"
                      animate={{ width: st.id < step ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </LayoutGroup>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fn">First name</Label>
                  <Input
                    id="fn"
                    value={s.firstName}
                    onChange={(e) => setS({ ...s, firstName: e.target.value })}
                    placeholder="Ibrahim"
                  />
                </div>
                <div>
                  <Label htmlFor="ln">Last name</Label>
                  <Input
                    id="ln"
                    value={s.lastName}
                    onChange={(e) => setS({ ...s, lastName: e.target.value })}
                    placeholder="Musa"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="dob">Date of birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={s.dob}
                    onChange={(e) => setS({ ...s, dob: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <div className="flex gap-2">
                    {(['MALE', 'FEMALE'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setS({ ...s, gender: g })}
                        className={cn(
                          'flex-1 rounded-lg border-2 py-2.5 text-sm font-semibold transition-colors',
                          s.gender === g
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 text-slate-700 hover:border-primary-300'
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone number</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="phone"
                    value={s.phone}
                    onChange={(e) => setS({ ...s, phone: e.target.value })}
                    placeholder="+234 803 000 0000"
                    className="pl-10"
                    inputMode="tel"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={s.email}
                  onChange={(e) => setS({ ...s, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  rows={2}
                  value={s.address}
                  onChange={(e) => setS({ ...s, address: e.target.value })}
                  placeholder="Street, area, Okene"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="en">Emergency contact name</Label>
                  <Input
                    id="en"
                    value={s.emergencyName}
                    onChange={(e) => setS({ ...s, emergencyName: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor="ep">Emergency contact phone</Label>
                  <Input
                    id="ep"
                    value={s.emergencyPhone}
                    onChange={(e) => setS({ ...s, emergencyPhone: e.target.value })}
                    placeholder="+234 803 000 0000"
                    inputMode="tel"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Blood group (optional)</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setS({ ...s, bloodGroup: b })}
                      className={cn(
                        'rounded-lg border-2 py-2 text-sm font-semibold transition-colors',
                        s.bloodGroup === b
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-slate-200 text-slate-700 hover:border-primary-300'
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="allergies">Allergies (optional)</Label>
                <Textarea
                  id="allergies"
                  rows={2}
                  value={s.allergies}
                  onChange={(e) => setS({ ...s, allergies: e.target.value })}
                  placeholder="Penicillin, peanuts, …"
                />
              </div>

              <div className="space-y-2 rounded-xl bg-slate-50 p-4">
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={s.consentData}
                    onChange={(e) => setS({ ...s, consentData: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-slate-700">
                    I consent to the processing of my medical data in accordance with Okene
                    Reference Hospital&apos;s privacy policy and NDPR.
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={s.consentSMS}
                    onChange={(e) => setS({ ...s, consentSMS: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-slate-700">
                    Send me SMS appointment reminders (recommended).
                  </span>
                </label>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((x) => Math.max(1, x - 1))}
          disabled={step === 1}
          className="text-slate-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {step < 3 ? (
          <Button onClick={() => canContinue() ? setStep(step + 1) : toast.error('Fill required fields')} size="lg">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} loading={submitting} size="lg">
            <Check className="h-4 w-4" />
            Create account
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function RegisterSuccess({ id, name }: { id: string; name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-slate-200/70 bg-white p-6 text-center shadow-xl sm:p-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
      >
        <motion.svg
          viewBox="0 0 52 52"
          className="h-12 w-12"
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
            transition={{ duration: 0.7, delay: 0.2 }}
          />
        </motion.svg>
      </motion.div>

      <h1 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl">Welcome, {name}!</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your CUSTECH Teaching Hospital account is ready.
      </p>

      <div className="mx-auto mt-6 max-w-xs rounded-xl bg-primary-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
          Your patient ID
        </p>
        <p className="mt-1 font-mono text-lg font-bold text-primary-900">{id}</p>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link href="/book" className="btn-primary">
          Book your first appointment
        </Link>
        <Link href="/dashboard" className="btn-outline">
          Go to dashboard
        </Link>
      </div>
    </motion.div>
  );
}
