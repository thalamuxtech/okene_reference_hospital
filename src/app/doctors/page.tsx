'use client';

import { useMemo, useState } from 'react';
import { Search, Sparkles, Filter, X } from 'lucide-react';
import { DOCTORS, SPECIALTIES } from '@/lib/seed-data';
import { DoctorCard } from '@/components/doctor-card';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export default function DoctorsPage() {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState<string>('all');
  const [telehealth, setTelehealth] = useState(false);

  const results = useMemo(() => {
    return DOCTORS.filter((d) => {
      if (specialty !== 'all' && d.specialtyId !== specialty) return false;
      if (telehealth && !d.telehealthAvailable) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${d.firstName} ${d.lastName} ${d.specialization.join(' ')} ${d.languages.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, specialty, telehealth]);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] gradient-hero" />

      <div className="container pt-10 lg:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> Find your doctor
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            {DOCTORS.length}+ specialists,{' '}
            <span className="text-gradient">one tap away.</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 lg:text-lg">
            Filter by specialty, language, telehealth availability and patient ratings.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-lg lg:p-6"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctor, specialty or language…"
                className="pl-10"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary-500">
                <input
                  type="checkbox"
                  checked={telehealth}
                  onChange={(e) => setTelehealth(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                Telehealth
              </label>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="h-4 w-4 flex-shrink-0 text-slate-400" />
            <button
              onClick={() => setSpecialty('all')}
              className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                specialty === 'all'
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'
              }`}
            >
              All
            </button>
            {SPECIALTIES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSpecialty(s.id)}
                className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  specialty === s.id
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'
                }`}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-6 mb-2 flex items-center justify-between text-sm text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-900">{results.length}</span> doctors
          </div>
          {(specialty !== 'all' || telehealth || query) && (
            <button
              onClick={() => {
                setSpecialty('all');
                setTelehealth(false);
                setQuery('');
              }}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Clear filters
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-10 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-6 w-6 text-slate-500" />
              </div>
              <p className="mt-4 font-semibold text-slate-900">No doctors match your filters</p>
              <p className="mt-1 text-sm text-slate-600">Try a different specialty or clear the filters.</p>
            </motion.div>
          ) : (
            <Stagger key="results" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((doc) => (
                <StaggerItem key={doc.id}>
                  <DoctorCard doctor={doc} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
