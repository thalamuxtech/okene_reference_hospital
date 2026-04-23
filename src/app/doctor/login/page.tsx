'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { HospitalShield } from '@/components/layout/logo';
import { signInDoctor, DOCTOR_PASSWORD } from '@/lib/doctor-auth';
import { DOCTORS } from '@/lib/seed-data';

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const doc = signInDoctor(email, password);
    setLoading(false);
    if (doc) {
      toast.success(`Welcome, ${doc.title ?? 'Dr.'} ${doc.lastName}`);
      router.push('/doctor');
    } else {
      setError('Invalid email or password. Check the demo credentials below.');
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-primary-950 to-navy-900" />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -24, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full bg-primary-500/25 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -bottom-32 -right-32 h-[460px] w-[460px] rounded-full bg-amber-500/20 blur-3xl"
      />

      <div className="container flex min-h-[calc(100vh-5rem)] items-center py-12">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          {/* Brand side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden text-white lg:block"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-100 backdrop-blur">
              <Stethoscope className="h-3.5 w-3.5" /> Doctor portal
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight lg:text-5xl lg:leading-[1.05]">
              Your patients,{' '}
              <span className="bg-gradient-to-r from-primary-300 to-amber-200 bg-clip-text text-transparent">
                ready when you are.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base text-white/70">
              See your queue, call the next patient, view medical records and record consultation
              notes — all in one secure clinical console built for Okene Reference Hospital.
            </p>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
                Demo credentials
              </p>
              <p className="mt-2 text-sm text-white/80">
                Password for all doctors:{' '}
                <span className="font-mono font-bold text-amber-300">{DOCTOR_PASSWORD}</span>
              </p>
              <div className="mt-3 grid max-h-[220px] gap-1 overflow-y-auto pr-2 text-xs">
                {DOCTORS.slice(0, 6).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setEmail(
                        `${d.firstName}.${d.lastName}`.toLowerCase() + '@okenehospital.ng'
                      );
                      setPassword(DOCTOR_PASSWORD);
                    }}
                    className="rounded-lg bg-white/5 px-3 py-2 text-left font-mono text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    {d.firstName}.{d.lastName}@okenehospital.ng
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <HospitalShield size={52} className="h-13 w-13" />
                  <span className="text-sm font-bold text-slate-900">Okene Reference</span>
                </Link>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  <Stethoscope className="h-3 w-3" />
                  Doctor
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Doctor sign in</h2>
              <p className="mt-1 text-sm text-slate-600">
                Medical professionals only. Sessions are logged for audit.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="email">Work email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="omeiza.nuhu@okenehospital.ng"
                      className="pl-10"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={show ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-20"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-primary-600"
                    >
                      {show ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  <Shield className="h-4 w-4" />
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <Link href="/" className="hover:text-primary-600">
                  ← Back to website
                </Link>
                <Link href="/admin/login" className="hover:text-primary-600">
                  Admin portal →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
