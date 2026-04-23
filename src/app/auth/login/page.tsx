'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Logo } from '@/components/layout/logo';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [stage, setStage] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    if (!/^(\+234|0)[0-9]{10}$/.test(phone)) {
      toast.error('Enter a valid Nigerian phone number');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setStage('otp');
    toast.success('OTP sent via SMS', { description: 'Check your messages for the 6-digit code.' });
  }

  async function verify() {
    if (otp.some((c) => !c)) {
      toast.error('Enter the 6-digit code');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    toast.success('Welcome back!', { description: 'Signing you in…' });
    setTimeout(() => (window.location.href = '/dashboard'), 600);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <Logo size={48} />
        <Link href="/auth/register" className="text-xs font-semibold text-primary-600 hover:underline">
          New here?
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Sign in with your phone number to access your care.
      </p>

      <AnimatePresence mode="wait">
        {stage === 'phone' && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-6 space-y-4"
          >
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 803 000 0000"
                  className="pl-10"
                  inputMode="tel"
                />
              </div>
            </div>

            <Button loading={loading} onClick={sendOtp} className="w-full" size="lg">
              Send OTP
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="relative flex items-center gap-3 py-2">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs uppercase tracking-wider text-slate-400">or</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary-500 hover:text-primary-600">
              <Lock className="h-4 w-4" />
              Sign in with email
            </button>
          </motion.div>
        )}

        {stage === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-6 space-y-4"
          >
            <div>
              <Label>Verification code</Label>
              <p className="mb-3 text-xs text-slate-500">
                Sent to <span className="font-semibold">{phone}</span> ·{' '}
                <button onClick={() => setStage('phone')} className="text-primary-600 hover:underline">
                  change
                </button>
              </p>
              <div className="flex gap-2">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={(e) => {
                      const next = [...otp];
                      next[i] = e.target.value.replace(/\D/g, '').slice(0, 1);
                      setOtp(next);
                      if (next[i] && i < 5) {
                        document.getElementById(`otp-${i + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    className={cn(
                      'h-14 w-full rounded-lg border-2 border-slate-200 bg-white text-center text-xl font-bold text-slate-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10'
                    )}
                  />
                ))}
              </div>
            </div>

            <Button loading={loading} onClick={verify} className="w-full" size="lg">
              <ShieldCheck className="h-4 w-4" />
              Verify & sign in
            </Button>

            <p className="text-center text-xs text-slate-500">
              Didn&apos;t receive it?{' '}
              <button className="font-semibold text-primary-600 hover:underline">Resend</button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-center text-xs text-slate-500">
        By continuing, you agree to our{' '}
        <Link href="/terms" className="text-slate-700 hover:underline">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-slate-700 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </motion.div>
  );
}
