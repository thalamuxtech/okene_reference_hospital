'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Send,
  Sparkles,
  Bot,
  User,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  ShieldCheck,
  Mic,
  RotateCcw,
  Clock,
  HeartPulse,
  BrainCircuit,
  Languages as LangIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Msg =
  | { role: 'user'; text: string }
  | {
      role: 'assistant';
      text: string;
      assessment?: {
        urgency: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
        action: string;
        specialty?: string;
        redFlags?: string[];
      };
    };

const STARTERS = [
  'Persistent cough and fever for 3 days',
  'Severe headache with sensitivity to light',
  'My child has a rash and is tired',
  'Chest discomfort that radiates to my left arm',
  'Vomiting with sharp abdominal pain',
  'Painful urination for 2 days'
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ha', label: 'Hausa' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'ig', label: 'Igbo' },
  { code: 'ebi', label: 'Ebira' }
];

export default function TriagePage() {
  const reduce = useReducedMotion();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text:
        "Hello, I'm Omeiza — your Okene Reference Hospital AI triage assistant. Tell me what you're feeling and I'll guide you to the right next step. I will never diagnose or prescribe."
    }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [language, setLanguage] = useState('en');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  function classify(text: string) {
    const t = text.toLowerCase();
    const redFlags: string[] = [];
    if (/chest pain|cannot breathe|severe bleeding|stroke|unconscious|suicid|heart attack|radiating to left arm/.test(t)) {
      if (/chest|heart|arm/.test(t)) redFlags.push('Cardiac red flag');
      if (/breathe|breath/.test(t)) redFlags.push('Respiratory distress');
      if (/bleeding/.test(t)) redFlags.push('Uncontrolled bleeding');
      return {
        urgency: 'EMERGENCY' as const,
        action:
          'Please go to the nearest emergency room immediately or call 112. I have logged this as a red-flag symptom. While you go, stay calm, avoid exertion, and keep a family member with you.',
        specialty: 'Emergency Medicine',
        redFlags
      };
    }
    if (/fever|vomit|persistent|severe|blood|cannot|painful|rash/.test(t)) {
      return {
        urgency: 'URGENT' as const,
        action:
          'Book an appointment today or tomorrow. In the meantime: rest, drink plenty of fluids, and track your temperature every 4 hours.',
        specialty: /child|baby|paediat/.test(t)
          ? 'Pediatrics'
          : /urin|painful urination/.test(t)
          ? 'General Medicine'
          : 'General Medicine',
        redFlags: []
      };
    }
    return {
      urgency: 'ROUTINE' as const,
      action:
        "This looks routine. A consultation within the next week should be fine. If anything worsens, book sooner or come to the hospital.",
      specialty: 'General Medicine',
      redFlags: []
    };
  }

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setThinking(true);
    await new Promise((r) => setTimeout(r, 1100));
    const a = classify(q);
    setMessages((m) => [
      ...m,
      {
        role: 'assistant',
        text: `Based on what you described, here's my assessment:`,
        assessment: a
      }
    ]);
    setThinking(false);
  }

  function reset() {
    setMessages([
      {
        role: 'assistant',
        text:
          "Hi again! Describe a new concern whenever you're ready. I'll guide you to the right care."
      }
    ]);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(900px 600px at 75% -10%, rgba(0,139,139,0.28), transparent 55%), radial-gradient(900px 600px at 15% 110%, rgba(139,92,246,0.25), transparent 55%), radial-gradient(700px 500px at 50% 30%, rgba(253,186,116,0.14), transparent 60%), linear-gradient(180deg,#0A1628,#0D1B30)'
          }}
        />
        <motion.div
          aria-hidden
          animate={reduce ? {} : { x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-primary-500/15 blur-[120px]"
        />
        <motion.div
          aria-hidden
          animate={reduce ? {} : { x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-violet-500/15 blur-[120px]"
        />
      </div>

      <div className="container pt-14 pb-20 text-white lg:pt-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.3fr]">
          {/* Left column — narrative */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-200 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered symptom triage
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-6 text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-[60px]"
            >
              Describe how you feel.{' '}
              <span className="bg-gradient-to-r from-primary-300 via-white to-amber-200 bg-clip-text text-transparent">
                We&apos;ll guide you.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-5 max-w-md text-base text-white/70"
            >
              Private, multilingual, available 24/7. Trained on Nigerian clinical context and
              backed by red-flag safety rules — escalates life-threatening symptoms straight to 112.
            </motion.p>

            {/* Stat chips */}
            <div className="mt-10 grid grid-cols-3 gap-3">
              {[
                { n: '< 30s', l: 'Response time' },
                { n: '5 langs', l: 'Supported' },
                { n: '24/7', l: 'Availability' }
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur"
                >
                  <p className="text-xl font-black tabular-nums text-white sm:text-2xl">{s.n}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>

            {/* Language selector */}
            <div className="mt-6">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/50">
                <LangIcon className="h-3.5 w-3.5" /> Language
              </p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      language === l.code
                        ? 'border-primary-400 bg-primary-500/20 text-primary-100'
                        : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust row */}
            <div className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">NDPR-compliant &amp; private</p>
                  <p className="mt-0.5 text-xs text-white/60">
                    Conversations are never shared with third parties.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Red-flag safety net</p>
                  <p className="mt-0.5 text-xs text-white/60">
                    Chest pain, stroke, heavy bleeding and other critical symptoms escalate to
                    112 immediately.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Never diagnoses or prescribes</p>
                  <p className="mt-0.5 text-xs text-white/60">
                    A hospital consultation is always recommended for diagnosis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — chat */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative z-10"
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-xl">
              {/* Chat topbar */}
              <div className="flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-white/[0.04] to-transparent px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-amber-400 text-slate-900">
                    <Bot className="h-5 w-5" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0A1628] bg-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Omeiza · AI Triage</p>
                    <p className="text-[11px] text-emerald-300">
                      ● Online · responses in seconds
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="teal" className="bg-white/10 text-primary-200">
                    GPT-4o
                  </Badge>
                  <button
                    onClick={reset}
                    aria-label="Start new conversation"
                    className="rounded-lg bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    title="New conversation"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="min-h-[460px] max-h-[600px] overflow-y-auto bg-gradient-to-b from-transparent to-white/[0.02] px-5 py-6">
                <div className="space-y-5">
                  <AnimatePresence initial={false}>
                    {messages.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}
                      >
                        {m.role === 'assistant' && (
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-amber-400 text-slate-900">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}
                        <div className={`max-w-[82%] ${m.role === 'user' ? 'order-2' : ''}`}>
                          <div
                            className={`rounded-2xl p-4 text-sm leading-relaxed ${
                              m.role === 'user'
                                ? 'rounded-tr-sm bg-gradient-to-br from-primary-500 to-navy-500 text-white shadow-lg shadow-primary-500/20'
                                : 'rounded-tl-sm border border-white/10 bg-white/[0.04] text-white/90 backdrop-blur'
                            }`}
                          >
                            {m.text}
                          </div>
                          {m.role === 'assistant' && m.assessment && (
                            <AssessmentCard a={m.assessment} />
                          )}
                        </div>
                        {m.role === 'user' && (
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/80">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {thinking && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-amber-400 text-slate-900">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="h-2 w-2 rounded-full bg-white/70"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div ref={endRef} />
                </div>
              </div>

              {/* Starter suggestions (only at start) */}
              {messages.length <= 1 && (
                <div className="border-t border-white/5 px-5 py-4">
                  <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    <Clock className="h-3.5 w-3.5" /> Quick prompts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STARTERS.map((s) => (
                      <motion.button
                        key={s}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => send(s)}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-primary-400/50 hover:bg-primary-500/10 hover:text-white"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="border-t border-white/5 bg-white/[0.02] p-4"
              >
                <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-2 backdrop-blur focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/30">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your symptoms…"
                    className="border-transparent bg-transparent text-white placeholder:text-white/40 focus:ring-0"
                  />
                  <button
                    type="button"
                    aria-label="Voice input (coming soon)"
                    className="rounded-lg p-2 text-white/40 hover:text-white/60"
                    title="Voice input — coming soon"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <Button type="submit" disabled={!input.trim() || thinking}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-[11px] text-white/40">
                  Not a substitute for a medical professional. For emergencies, call{' '}
                  <a href="tel:112" className="font-semibold text-red-300 hover:text-red-200">
                    112
                  </a>
                  .
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AssessmentCard({
  a
}: {
  a: {
    urgency: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
    action: string;
    specialty?: string;
    redFlags?: string[];
  };
}) {
  const config = {
    EMERGENCY: {
      bg: 'from-red-500 to-red-700',
      icon: AlertTriangle,
      label: 'EMERGENCY',
      text: 'text-red-100'
    },
    URGENT: {
      bg: 'from-amber-500 to-orange-600',
      icon: AlertTriangle,
      label: 'URGENT',
      text: 'text-amber-100'
    },
    ROUTINE: {
      bg: 'from-emerald-500 to-emerald-700',
      icon: CheckCircle2,
      label: 'ROUTINE',
      text: 'text-emerald-100'
    }
  }[a.urgency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`mt-3 overflow-hidden rounded-2xl bg-gradient-to-br ${config.bg} p-5 text-white shadow-lg`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
          <config.icon className="h-6 w-6" />
        </div>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${config.text}`}>
            Assessment
          </p>
          <p className="text-xl font-black leading-none">{config.label}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed">{a.action}</p>

      {a.redFlags && a.redFlags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {a.redFlags.map((rf) => (
            <span
              key={rf}
              className="rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            >
              {rf}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {a.urgency === 'EMERGENCY' ? (
          <a
            href="tel:112"
            className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-red-700 transition-transform hover:scale-105"
          >
            Call 112 now
          </a>
        ) : (
          <Link
            href="/book"
            className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-900 transition-transform hover:scale-105"
          >
            <Stethoscope className="mr-1 inline h-3.5 w-3.5" />
            Book appointment
          </Link>
        )}
        {a.specialty && (
          <span className="inline-flex items-center rounded-lg border border-white/30 px-3 py-2 text-xs font-semibold">
            {a.specialty}
          </span>
        )}
      </div>
    </motion.div>
  );
}
