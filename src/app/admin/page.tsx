'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  CalendarDays,
  Siren,
  Clock,
  Activity,
  CheckCircle2,
  Video,
  ArrowUpRight,
  DollarSign
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DOCTORS } from '@/lib/seed-data';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

const kpis = [
  { label: "Today's appointments", value: '47', delta: '+12%', trend: 'up', icon: CalendarDays, color: 'from-primary-500 to-teal-600' },
  { label: 'Patients registered', value: '2,148', delta: '+8.4%', trend: 'up', icon: Users, color: 'from-violet-500 to-purple-600' },
  { label: 'Active emergencies', value: '2', delta: 'stable', trend: 'flat', icon: Siren, color: 'from-red-500 to-rose-600' },
  { label: 'Revenue this week', value: formatCurrency(3_420_000), delta: '+14%', trend: 'up', icon: DollarSign, color: 'from-emerald-500 to-green-600' }
];

const liveAppointments = [
  { time: '10:30', patient: 'Ozavize A.', doctor: 'Dr. Nuhu', department: 'Cardiology', status: 'in_progress' },
  { time: '10:45', patient: 'Onyeche I.', doctor: 'Dr. Ohiare', department: 'Pediatrics', status: 'checked_in' },
  { time: '11:00', patient: 'Ohunene O.', doctor: 'Dr. Attah', department: 'Orthopedics', status: 'scheduled' },
  { time: '11:15', patient: 'Halima A.', doctor: 'Dr. Yusuf', department: 'Neurology', status: 'scheduled' },
  { time: '11:30', patient: 'Eneojo O.', doctor: 'Dr. Ozigi', department: 'General', status: 'telehealth' }
];

export default function AdminHome() {
  const hours = Array.from({ length: 12 }, (_, i) => 8 + i);
  const heights = [20, 45, 72, 88, 65, 40, 55, 78, 92, 70, 50, 30];

  return (
    <AdminShell title="Dashboard">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Good afternoon, Administrator</h1>
          <p className="mt-1 text-sm text-slate-600">Here&apos;s what&apos;s happening across CUSTECH-TH Okene today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            All systems operational
          </span>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
          >
            <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br ${k.color} opacity-10`} />
            <div className="relative">
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${k.color} text-white shadow-md`}>
                <k.icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-600">{k.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{k.value}</p>
              <div className="mt-2 flex items-center gap-1 text-xs font-semibold">
                {k.trend === 'up' ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                ) : k.trend === 'down' ? (
                  <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                ) : (
                  <Activity className="h-3.5 w-3.5 text-slate-400" />
                )}
                <span className={k.trend === 'up' ? 'text-emerald-600' : k.trend === 'down' ? 'text-red-600' : 'text-slate-500'}>
                  {k.delta}
                </span>
                <span className="text-slate-400">vs last week</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Appointments today</h2>
              <p className="text-xs text-slate-500">Hourly distribution · 8 AM → 7 PM</p>
            </div>
            <Badge variant="teal">Live</Badge>
          </div>
          <div className="flex h-48 items-end gap-2">
            {heights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.04, ease: [0, 0, 0.2, 1] }}
                className="group relative flex-1 rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500"
              >
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {h}%
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
            {hours.map((h) => (
              <span key={h} className="flex-1 text-center">
                {h}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Top doctors */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Top doctors</h2>
            <Link href="/admin/doctors" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {DOCTORS.slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <Image src={d.photoURL} alt={d.firstName} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {d.title ?? 'Dr.'} {d.firstName} {d.lastName}
                  </p>
                  <p className="truncate text-xs text-slate-500">{d.specialization[0]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{d.totalPatientsSeen.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">patients</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Live appointments feed */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Live appointments</h2>
            <p className="text-xs text-slate-500">Auto-refreshing every 15 seconds</p>
          </div>
          <Link href="/admin/appointments" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700">
            Open queue <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {liveAppointments.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-12 w-16 flex-col items-center justify-center rounded-lg bg-primary-50">
                <Clock className="h-3 w-3 text-primary-600" />
                <p className="text-xs font-bold text-primary-700">{a.time}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{a.patient}</p>
                <p className="text-xs text-slate-500">
                  {a.doctor} · {a.department}
                </p>
              </div>
              <StatusChip status={a.status} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </AdminShell>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: any; icon?: any }> = {
    in_progress: { label: 'In progress', variant: 'info', icon: Activity },
    checked_in: { label: 'Checked in', variant: 'success', icon: CheckCircle2 },
    scheduled: { label: 'Scheduled', variant: 'default' },
    telehealth: { label: 'Telehealth', variant: 'purple', icon: Video }
  };
  const s = map[status] || map.scheduled;
  return (
    <Badge variant={s.variant}>
      {s.icon && <s.icon className="h-3 w-3" />}
      {s.label}
    </Badge>
  );
}
