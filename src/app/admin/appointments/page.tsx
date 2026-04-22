'use client';

import { useMemo, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, CheckCircle2, X, Video, Clock, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { DOCTORS } from '@/lib/seed-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, cn } from '@/lib/utils';

type Status = 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

const APPOINTMENTS = Array.from({ length: 18 }).map((_, i) => {
  const d = DOCTORS[i % DOCTORS.length];
  const statuses: Status[] = ['scheduled', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'];
  const names = ['Ibrahim Musa', 'Fatima Kabir', 'Samuel Okoro', 'Grace Ayodele', 'Aisha Bello', 'Musa Idris', 'Chiamaka Eze', 'Tunde Adewale'];
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00'];
  return {
    id: `APT-2026-${(10000 + i).toString()}`,
    time: times[i % times.length],
    patient: names[i % names.length],
    phone: '+234 803 000 00' + String(i).padStart(2, '0'),
    doctor: d,
    type: i % 5 === 0 ? 'telehealth' : 'in-person',
    fee: d.consultationFee,
    status: statuses[i % statuses.length]
  };
});

export default function AdminAppointmentsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [selected, setSelected] = useState<string[]>([]);

  const list = useMemo(() => {
    return APPOINTMENTS.filter((a) => {
      if (status !== 'all' && a.status !== status) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(a.patient + a.id + a.phone).toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [query, status]);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <AdminShell title="Appointments">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Appointments</h1>
          <p className="mt-1 text-sm text-slate-600">
            Track, update and manage every appointment across departments.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New appointment
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {[
          { label: 'All', value: APPOINTMENTS.length, color: 'bg-slate-100 text-slate-700' },
          { label: 'Scheduled', value: APPOINTMENTS.filter((a) => a.status === 'scheduled').length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Checked in', value: APPOINTMENTS.filter((a) => a.status === 'checked_in').length, color: 'bg-emerald-100 text-emerald-700' },
          { label: 'In progress', value: APPOINTMENTS.filter((a) => a.status === 'in_progress').length, color: 'bg-amber-100 text-amber-700' },
          { label: 'Completed', value: APPOINTMENTS.filter((a) => a.status === 'completed').length, color: 'bg-teal-100 text-teal-700' },
          { label: 'No-show', value: APPOINTMENTS.filter((a) => a.status === 'no_show').length, color: 'bg-red-100 text-red-700' }
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setStatus(s.label === 'All' ? 'all' : (s.label.toLowerCase().replace(' ', '_') as Status))}
            className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${s.color}`}>{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{s.value}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search by patient, number or phone…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="w-10 px-4 py-3"></th>
                <th className="px-4 py-3">Appointment</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {list.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={cn('transition-colors hover:bg-slate-50', selected.includes(a.id) && 'bg-primary-50/40')}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(a.id)}
                        onChange={() => toggle(a.id)}
                        className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-semibold text-slate-700">{a.id}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" /> Today · {a.time}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{a.patient}</p>
                      <p className="text-xs text-slate-500">{a.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Image src={a.doctor.photoURL} alt={a.doctor.firstName} width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            Dr. {a.doctor.firstName} {a.doctor.lastName}
                          </p>
                          <p className="text-[11px] text-slate-500">{a.doctor.specialization[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(a.fee)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} type={a.type} />
                    </td>
                    <td className="px-4 py-3">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {list.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500">No appointments match these filters.</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-3">
          <p className="text-xs text-slate-500">
            Showing <b className="text-slate-900">{list.length}</b> of {APPOINTMENTS.length}
            {selected.length > 0 && (
              <span className="ml-2 font-semibold text-primary-600">· {selected.length} selected</span>
            )}
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Prev
            </button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function StatusBadge({ status, type }: { status: Status; type: string }) {
  const variants: Record<Status, any> = {
    scheduled: 'info',
    checked_in: 'success',
    in_progress: 'warning',
    completed: 'teal',
    cancelled: 'danger',
    no_show: 'default'
  };
  const labels: Record<Status, string> = {
    scheduled: 'Scheduled',
    checked_in: 'Checked in',
    in_progress: 'In progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No-show'
  };
  return (
    <div className="flex items-center gap-1">
      <Badge variant={variants[status]}>{labels[status]}</Badge>
      {type === 'telehealth' && (
        <Badge variant="purple">
          <Video className="h-3 w-3" />
        </Badge>
      )}
    </div>
  );
}
