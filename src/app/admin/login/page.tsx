'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Logo } from '@/components/layout/logo';
import { signInAdmin } from '@/lib/admin-auth';

export default function AdminLoginPage() {
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
    await new Promise((r) => setTimeout(r, 700));
    const ok = signInAdmin(email, password);
    setLoading(false);
    if (ok) {
      toast.success('Welcome, administrator');
      router.push('/admin');
    } else {
      setError('Invalid credentials. Please check and try again.');
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-navy-900 to-primary-900" />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary-500/30 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-violet-500/25 blur-3xl"
      />

      <div className="container flex min-h-[calc(100vh-5rem)] items-center py-12">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left side — brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden text-white lg:block"
          >
            <Logo variant="light" />
            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-100 backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" /> Staff portal · Restricted
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight lg:text-5xl lg:leading-[1.05]">
              Manage care,{' '}
              <span className="bg-gradient-to-r from-primary-300 to-violet-300 bg-clip-text text-transparent">
                end-to-end.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base text-primary-100/80">
              Full control of appointments, queues, doctor rosters, telehealth sessions, emergencies
              and analytics — all from a single, secure console.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-4">
              {[
                { v: '24/7', l: 'Emergency monitoring' },
                { v: 'RBAC', l: 'Role-based access' },
                { v: 'NDPR', l: 'Compliance grade' },
                { v: '99.9%', l: 'Uptime SLA' }
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wider text-primary-200">
                    {s.l}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Right side — form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <Logo />
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  <ShieldCheck className="h-3 w-3" />
                  Admin
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Staff sign in</h2>
              <p className="mt-1 text-sm text-slate-600">
                Authorised personnel only. Activity on this portal is logged.
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
                      placeholder="okene@referencehospital.com"
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
                  <ShieldCheck className="h-4 w-4" />
                  Sign in securely
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <Link href="/" className="hover:text-primary-600">
                  ← Back to website
                </Link>
                <span>v1.0 · Okene MMS</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
