'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Play, Pause, SkipForward, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Entry = { id: string; number: string; patient: string; priority: 0 | 1 | 2; waitMin: number };

const DEPARTMENTS = [
  { code: 'A', name: 'Cardiology', now: 'A-124', doctor: 'Dr. Omeiza Nuhu', color: 'from-rose-500 to-red-600' },
  { code: 'B', name: 'Pediatrics', now: 'B-087', doctor: 'Dr. Ohiare', color: 'from-sky-500 to-cyan-600' },
  { code: 'C', name: 'Orthopedics', now: 'C-042', doctor: 'Dr. Attah', color: 'from-amber-500 to-orange-600' },
  { code: 'D', name: 'General', now: 'D-211', doctor: 'Dr. Ozigi', color: 'from-primary-500 to-teal-600' }
];

const INITIAL: Record<string, Entry[]> = {
  A: [
    { id: 'A-125', number: 'A-125', patient: 'Ozavize A.', priority: 0, waitMin: 6 },
    { id: 'A-126', number: 'A-126', patient: 'Onyeche I.', priority: 1, waitMin: 14 },
    { id: 'A-127', number: 'A-127', patient: 'Yakubu O.', priority: 0, waitMin: 22 }
  ],
  B: [
    { id: 'B-088', number: 'B-088', patient: 'Halima A.', priority: 0, waitMin: 4 },
    { id: 'B-089', number: 'B-089', patient: 'Ohunene O.', priority: 0, waitMin: 10 }
  ],
  C: [
    { id: 'C-043', number: 'C-043', patient: 'Eneojo O.', priority: 2, waitMin: 0 },
    { id: 'C-044', number: 'C-044', patient: 'Sekinat I.', priority: 0, waitMin: 18 }
  ],
  D: [
    { id: 'D-212', number: 'D-212', patient: 'Zeinab A.', priority: 0, waitMin: 3 },
    { id: 'D-213', number: 'D-213', patient: 'Omeiza Y.', priority: 0, waitMin: 12 },
    { id: 'D-214', number: 'D-214', patient: 'Aisha S.', priority: 1, waitMin: 24 }
  ]
};

export default function AdminQueuePage() {
  const [queues, setQueues] = useState(INITIAL);
  const [paused, setPaused] = useState(false);

  function callNext(code: string) {
    setQueues((q) => ({ ...q, [code]: q[code].slice(1) }));
  }

  return (
    <AdminShell title="Queue management">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Live queue</h1>
          <p className="mt-1 text-sm text-slate-600">Real-time queue across all departments · TV display synced.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPaused((v) => !v)}>
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {paused ? 'Resume' : 'Pause'}
          </Button>
          <Button>
            <Bell className="h-4 w-4" />
            Announce
          </Button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {DEPARTMENTS.map((d) => (
          <motion.div
            key={d.code}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
          >
            <div className={`relative flex items-center justify-between bg-gradient-to-br ${d.color} p-5 text-white`}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90">{d.name}</p>
                <p className="mt-1 text-xs opacity-80">{d.doctor}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase opacity-80">Now serving</p>
                <motion.p
                  key={d.now}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-mono text-4xl font-black tracking-tight"
                >
                  {d.now}
                </motion.p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {queues[d.code].length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-500">No patients waiting.</p>
                  </div>
                ) : (
                  queues[d.code].map((e, i) => (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                      className="flex items-center gap-4 p-4"
                    >
                      <div className="w-16 text-center">
                        <p className="font-mono text-xl font-bold text-slate-900">{e.number}</p>
                        <p className="text-[10px] font-semibold uppercase text-slate-500">#{i + 1}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{e.patient}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <span>Waiting {e.waitMin} min</span>
                          {e.priority === 2 && <Badge variant="danger">Emergency</Badge>}
                          {e.priority === 1 && <Badge variant="warning">Priority</Badge>}
                        </div>
                      </div>
                      {i === 0 && (
                        <Button size="sm" onClick={() => callNext(d.code)}>
                          <SkipForward className="h-3.5 w-3.5" />
                          Call
                        </Button>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminShell>
  );
}
