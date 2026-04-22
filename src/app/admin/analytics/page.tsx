'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Video, MessageSquare, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const appts = [45, 52, 60, 58, 72, 48, 20];
  const telehealth = [12, 18, 20, 22, 28, 14, 6];

  const channels = [
    { name: 'Web / Mobile', value: 68, color: 'bg-primary-500' },
    { name: 'SMS / USSD', value: 18, color: 'bg-violet-500' },
    { name: 'Reception', value: 10, color: 'bg-amber-500' },
    { name: 'Phone', value: 4, color: 'bg-slate-500' }
  ];

  return (
    <AdminShell title="Analytics">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-slate-600">
          Operational, clinical, financial and channel performance metrics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: 'Unique patients (30d)', value: '1,284', delta: '+9%' },
          { icon: Activity, label: 'Avg wait time', value: '14 min', delta: '-32%' },
          { icon: Video, label: 'Telehealth CSAT', value: '4.7 / 5', delta: '+0.3' },
          { icon: MessageSquare, label: 'Revenue (wk)', value: formatCurrency(3_420_000), delta: '+14%' }
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
          >
            <k.icon className="h-5 w-5 text-primary-600" />
            <p className="mt-3 text-xs text-slate-500">{k.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{k.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              {k.delta}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Weekly bars */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Appointments vs telehealth</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary-500" /> In-person
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-500" /> Telehealth
              </span>
            </div>
          </div>
          <div className="flex h-56 items-end gap-3">
            {days.map((d, i) => {
              const pct = (appts[i] / 80) * 100;
              const tpct = (telehealth[i] / 80) * 100;
              return (
                <div key={d} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full gap-1.5">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct * 1.6}px` }}
                      transition={{ duration: 0.7, delay: 0.2 + i * 0.05, ease: [0, 0, 0.2, 1] }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-primary-500 to-primary-400"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${tpct * 1.6}px` }}
                      transition={{ duration: 0.7, delay: 0.25 + i * 0.05, ease: [0, 0, 0.2, 1] }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-violet-500 to-violet-400"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">{d}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Channel mix */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
        >
          <h2 className="mb-6 text-lg font-bold text-slate-900">Booking channels</h2>
          <div className="space-y-4">
            {channels.map((c, i) => (
              <div key={c.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{c.name}</span>
                  <span className="font-bold text-slate-900">{c.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.value}%` }}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: [0, 0, 0.2, 1] }}
                    className={`h-full rounded-full ${c.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
      >
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900">Department performance (this week)</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { dept: 'Cardiology', visits: 132, rev: 1_980_000, change: '+12%' },
            { dept: 'Pediatrics', visits: 188, rev: 1_880_000, change: '+8%' },
            { dept: 'Orthopedics', visits: 96, rev: 1_152_000, change: '+5%' },
            { dept: 'General Medicine', visits: 310, rev: 2_170_000, change: '+15%' },
            { dept: 'Obstetrics & Gynaecology', visits: 144, rev: 1_872_000, change: '+10%' }
          ].map((r) => (
            <div key={r.dept} className="grid grid-cols-4 items-center gap-4 p-4 hover:bg-slate-50">
              <p className="font-semibold text-slate-900">{r.dept}</p>
              <p className="text-sm text-slate-700">
                <span className="font-bold">{r.visits}</span> visits
              </p>
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(r.rev)}</p>
              <p className="text-right text-sm font-semibold text-emerald-600">{r.change}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </AdminShell>
  );
}
