'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, Phone } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0, 0, 0.2, 1] }}
          className="relative overflow-hidden rounded-3xl p-8 shadow-2xl sm:p-14 lg:p-20"
        >
          <div className="absolute inset-0 gradient-brand" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.14), transparent 40%)'
            }}
          />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -14, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">
                Ready when you are
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
                Your care journey starts in under a minute.
              </h2>
              <p className="mt-4 max-w-lg text-base text-primary-50/90 lg:text-lg">
                Register once, book anytime — on web, SMS, USSD or the reception kiosk. Multilingual,
                always-on, and NDPR compliant.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/auth/register"
                className="group flex items-center justify-between rounded-xl bg-white p-5 shadow-lg transition-all hover:shadow-xl"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                    Patients
                  </p>
                  <p className="text-lg font-bold text-slate-900">Create your account</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                  <Calendar className="h-5 w-5" />
                </div>
              </Link>

              <Link
                href="/triage"
                className="group flex items-center justify-between rounded-xl bg-white/10 p-5 backdrop-blur-sm transition-all hover:bg-white/15"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-100">
                    Not sure where to start?
                  </p>
                  <p className="text-lg font-bold text-white">Try AI symptom checker</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </Link>

              <a
                href="tel:112"
                className="group flex items-center justify-between rounded-xl border border-white/20 bg-red-600/90 p-5 text-white shadow-lg transition-all hover:bg-red-600"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-100">
                    Emergency
                  </p>
                  <p className="text-lg font-bold">Call 112 · 24/7</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 animate-pulse-ring">
                  <Phone className="h-5 w-5" />
                </div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
