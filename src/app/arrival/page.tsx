'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Printer, ArrowRight, Ticket as TicketIcon, User, Phone, Sparkles, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { DEPARTMENTS_META, useTicketStore, type Ticket } from '@/lib/ticket-store';

export default function ArrivalPage() {
  const addTicket = useTicketStore((s) => s.addTicket);
  const waitingCounts = useTicketStore((s) =>
    DEPARTMENTS_META.reduce<Record<string, number>>((acc, d) => {
      acc[d.code] = s.tickets.filter((t) => t.deptCode === d.code && t.status === 'waiting').length;
      return acc;
    }, {})
  );

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dept, setDept] = useState<{ code: string; name: string } | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [priority, setPriority] = useState<0 | 1 | 2>(0);
  const [issued, setIssued] = useState<Ticket | null>(null);

  function submit() {
    if (!dept || !name.trim()) {
      toast.error('Please complete all fields');
      return;
    }
    const t = addTicket({
      department: dept.name,
      deptCode: dept.code,
      patientName: name.trim(),
      phone: phone.trim() || undefined,
      priority
    });
    setIssued(t);
    setStep(3);
    toast.success(`Ticket ${t.number} issued`);
  }

  function reset() {
    setStep(1);
    setDept(null);
    setName('');
    setPhone('');
    setPriority(0);
    setIssued(null);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(900px 500px at 80% 0%, rgba(0,139,139,0.35), transparent 60%), radial-gradient(800px 600px at 0% 100%, rgba(217,119,6,0.25), transparent 55%), linear-gradient(180deg,#0A1628,#0D1B30)'
          }}
        />
      </div>

      <div className="container py-10 lg:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary-200 backdrop-blur"
          >
            <TicketIcon className="h-3.5 w-3.5" /> Arrival kiosk
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl font-bold leading-tight sm:text-5xl"
          >
            Get your ticket and counter,{' '}
            <span className="bg-gradient-to-r from-primary-300 to-amber-200 bg-clip-text text-transparent">
              in 30 seconds.
            </span>
          </motion.h1>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-2xl sm:p-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-xl font-bold sm:text-2xl">Which department?</h2>
                  <p className="mt-1 text-sm text-slate-600">Tap the service you came for today.</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {DEPARTMENTS_META.map((d) => (
                      <motion.button
                        key={d.code}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setDept(d);
                          setStep(2);
                        }}
                        className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all hover:border-primary-500 hover:shadow-md"
                      >
                        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${d.color}`} />
                        <p className="font-mono text-3xl font-black text-slate-900">{d.code}</p>
                        <p className="mt-2 text-sm font-bold text-slate-900">{d.name}</p>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                          <Users className="h-3.5 w-3.5" />
                          <span>
                            <b className="text-slate-900">{waitingCounts[d.code] ?? 0}</b> waiting
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && dept && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button onClick={() => setStep(1)} className="mb-4 text-sm text-slate-500 hover:text-primary-600">
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold sm:text-2xl">Your details</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Department: <b>{dept.name}</b>
                  </p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="n">Full name</Label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input id="n" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Omeiza Yahaya" className="pl-10" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="p">Phone (optional, for SMS reminders)</Label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input id="p" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 803 000 0000" className="pl-10" />
                      </div>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 0, label: 'Normal', desc: '' },
                          { value: 1, label: 'Priority', desc: '65+, pregnant, disabled' },
                          { value: 2, label: 'Emergency', desc: 'Severe symptoms' }
                        ].map((p) => (
                          <button
                            key={p.value}
                            onClick={() => setPriority(p.value as 0 | 1 | 2)}
                            className={`rounded-xl border-2 p-3 text-left text-xs transition-colors ${
                              priority === p.value
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-slate-200 hover:border-primary-300'
                            }`}
                          >
                            <p className="text-sm font-bold">{p.label}</p>
                            {p.desc && <p className="mt-0.5 text-slate-500">{p.desc}</p>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button onClick={submit} size="lg">
                      Issue ticket
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && issued && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  >
                    <CheckCircle2 className="h-9 w-9" />
                  </motion.div>

                  <h2 className="mt-5 text-2xl font-bold">You&apos;re checked in.</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Please take a seat — you&apos;ll hear your number called.
                  </p>

                  {/* Ticket slip */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mx-auto mt-8 w-full max-w-sm overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-white to-slate-50"
                  >
                    <div className="border-b-2 border-dashed border-slate-300 bg-white p-5 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Okene Reference Hospital
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">Queue ticket</p>
                      <p className="mt-3 font-mono text-6xl font-black tracking-tight text-slate-900">
                        {issued.number}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-primary-600">{issued.department}</p>
                    </div>
                    <dl className="grid grid-cols-2 gap-3 p-5 text-left text-xs">
                      <div>
                        <dt className="uppercase tracking-wider text-slate-500">Patient</dt>
                        <dd className="mt-0.5 font-bold text-slate-900">{issued.patientName}</dd>
                      </div>
                      <div>
                        <dt className="uppercase tracking-wider text-slate-500">Issued</dt>
                        <dd className="mt-0.5 font-bold text-slate-900">
                          {new Date(issued.arrivedAt).toLocaleTimeString('en-NG', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </dd>
                      </div>
                      <div>
                        <dt className="uppercase tracking-wider text-slate-500">Priority</dt>
                        <dd className="mt-0.5 font-bold text-slate-900">
                          {issued.priority === 2 ? 'Emergency' : issued.priority === 1 ? 'Priority' : 'Normal'}
                        </dd>
                      </div>
                      <div>
                        <dt className="uppercase tracking-wider text-slate-500">Est. wait</dt>
                        <dd className="mt-0.5 font-bold text-slate-900">
                          ~{issued.estimatedWaitMin ?? 0} min
                        </dd>
                      </div>
                    </dl>
                    <div className="border-t-2 border-dashed border-slate-300 p-4 text-center text-[10px] text-slate-400">
                      Emergency · 112  ·  care@okenehospital.ng
                    </div>
                  </motion.div>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600"
                    >
                      <Printer className="h-4 w-4" /> Print slip
                    </button>
                    <Link href="/queue-display" className="btn-outline">
                      Open queue display
                    </Link>
                    <Button onClick={reset}>
                      <Sparkles className="h-4 w-4" />
                      Issue another
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Average wait: 14 min
            </span>
            <span>·</span>
            <Link href="/book" className="underline underline-offset-2 hover:text-white">
              Or book an appointment online
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
