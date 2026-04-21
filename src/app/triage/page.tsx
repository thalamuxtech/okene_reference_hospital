'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, AlertTriangle, CheckCircle2, Stethoscope } from 'lucide-react';
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
      };
    };

const STARTERS = [
  'I have a persistent cough and fever for 3 days',
  'Severe headache with sensitivity to light',
  'My child has a rash and is tired',
  'Chest discomfort after exercise'
];

export default function TriagePage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text: "Hello, I'm your AI triage assistant. Describe your symptoms in your own words — I'll suggest the right next step. I won't diagnose or prescribe."
    }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  function classify(text: string) {
    const t = text.toLowerCase();
    if (
      /(chest pain|cannot breathe|severe bleeding|stroke|unconscious|suicid|heart attack)/.test(t)
    ) {
      return {
        urgency: 'EMERGENCY' as const,
        action:
          'Go to the nearest emergency room immediately or call 112. I have logged this as a red-flag symptom.',
        specialty: 'Emergency Medicine'
      };
    }
    if (/(fever|vomit|persistent|severe|blood|cannot)/.test(t)) {
      return {
        urgency: 'URGENT' as const,
        action: 'Book an appointment today or tomorrow. Stay hydrated and rest.',
        specialty: 'General Medicine'
      };
    }
    return {
      urgency: 'ROUTINE' as const,
      action:
        "This can usually be seen during a routine visit. Book an appointment within the next week.",
      specialty: 'General Medicine'
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

  return (
    <div className="relative min-h-screen pb-20">
      <div className="absolute inset-x-0 top-0 -z-10 h-[260px] gradient-hero" />

      <div className="container pt-10 lg:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered triage
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[52px] lg:leading-[1.05]">
            Describe how you feel.
            <br />
            <span className="text-gradient">We&apos;ll guide you.</span>
          </h1>
          <p className="mt-4 text-sm text-slate-600 lg:text-base">
            Private, multilingual, available 24/7 — also works over SMS and USSD.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-navy-500">
                  <Bot className="h-5 w-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Okene AI Triage</p>
                  <p className="text-xs text-emerald-600">Online · Responses in seconds</p>
                </div>
              </div>
              <Badge variant="teal">GPT-4o</Badge>
            </div>

            <div className="min-h-[400px] max-h-[520px] overflow-y-auto p-5">
              <div className="space-y-4">
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
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div className={`max-w-[80%] ${m.role === 'user' ? 'order-2' : ''}`}>
                        <div
                          className={`rounded-2xl p-4 text-sm ${
                            m.role === 'user'
                              ? 'rounded-tr-sm bg-gradient-to-br from-primary-500 to-navy-500 text-white'
                              : 'rounded-tl-sm bg-slate-100 text-slate-800'
                          }`}
                        >
                          {m.text}
                        </div>
                        {m.role === 'assistant' && m.assessment && (
                          <AssessmentCard a={m.assessment} />
                        )}
                      </div>
                      {m.role === 'user' && (
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-slate-400"
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

            {messages.length <= 1 && (
              <div className="border-t border-slate-100 p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Try one of these
                </p>
                <div className="flex flex-wrap gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-primary-500 hover:text-primary-600"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="border-t border-slate-100 bg-white p-4"
            >
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your symptoms…"
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || thinking}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Not a substitute for a medical professional. For emergencies, call 112.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssessmentCard({
  a
}: {
  a: { urgency: 'EMERGENCY' | 'URGENT' | 'ROUTINE'; action: string; specialty?: string };
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
      className={`mt-2 overflow-hidden rounded-2xl bg-gradient-to-br ${config.bg} p-5 text-white shadow-md`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
          <config.icon className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${config.text}`}>
            Assessment
          </p>
          <p className="text-lg font-bold">{config.label}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed">{a.action}</p>
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
          <span className="rounded-lg border border-white/30 px-3 py-2 text-xs font-semibold">
            {a.specialty}
          </span>
        )}
      </div>
    </motion.div>
  );
}
