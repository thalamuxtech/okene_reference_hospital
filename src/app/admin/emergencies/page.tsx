'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { motion } from 'framer-motion';
import { Siren, Phone, MapPin, Ambulance, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EMERGENCIES = [
  {
    id: 'EMG-2026-00188',
    caller: 'Unknown',
    phone: '+234 803 551 2201',
    type: 'Medical',
    severity: 'CRITICAL',
    location: 'Adavi Road, Okene',
    status: 'en_route',
    ambulance: 'AMB-02',
    eta: 4,
    started: '2 min ago'
  },
  {
    id: 'EMG-2026-00187',
    caller: 'Aisha Bello',
    phone: '+234 810 449 1182',
    type: 'Obstetric',
    severity: 'HIGH',
    location: 'Lokoja Road, Okene',
    status: 'dispatched',
    ambulance: 'AMB-01',
    eta: 11,
    started: '7 min ago'
  },
  {
    id: 'EMG-2026-00186',
    caller: 'Ibrahim Musa',
    phone: '+234 903 220 4409',
    type: 'Accident',
    severity: 'MODERATE',
    location: 'Obehira Junction',
    status: 'resolved',
    ambulance: 'AMB-03',
    eta: 0,
    started: '34 min ago'
  }
];

export default function AdminEmergenciesPage() {
  const active = EMERGENCIES.filter((e) => e.status !== 'resolved');

  return (
    <AdminShell title="Emergencies">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Emergency operations</h1>
          <p className="mt-1 text-sm text-slate-600">Live hotline feed · Ambulance dispatch · ER pre-alerts.</p>
        </div>
        <Button variant="outline">
          <Phone className="h-4 w-4" />
          Open hotline console
        </Button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <StatCard label="Active" value={String(active.length)} color="bg-red-100 text-red-700" />
        <StatCard label="Dispatched today" value="11" color="bg-amber-100 text-amber-700" />
        <StatCard label="Avg response" value="8m" color="bg-primary-100 text-primary-700" />
        <StatCard label="Ambulances online" value="3 / 4" color="bg-emerald-100 text-emerald-700" />
      </div>

      <div className="space-y-4">
        {EMERGENCIES.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-xs transition-all hover:shadow-md ${
              e.severity === 'CRITICAL' ? 'border-red-200' : 'border-slate-200'
            }`}
          >
            {e.severity === 'CRITICAL' && e.status !== 'resolved' && (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-red-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            <div className="flex flex-wrap items-start gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-md ${
                e.severity === 'CRITICAL' ? 'bg-red-600' : e.severity === 'HIGH' ? 'bg-amber-600' : 'bg-slate-600'
              }`}>
                <Siren className="h-7 w-7" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-sm font-bold text-slate-900">{e.id}</p>
                  <Badge variant={e.severity === 'CRITICAL' ? 'danger' : e.severity === 'HIGH' ? 'warning' : 'default'}>
                    {e.severity}
                  </Badge>
                  <Badge variant="outline">{e.type}</Badge>
                  <StatusBadge status={e.status} />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{e.caller}</p>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {e.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {e.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {e.started}
                  </span>
                </div>
              </div>

              {e.status !== 'resolved' && (
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Ambulance className="h-4 w-4" />
                    {e.ambulance}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    ETA <span className="font-bold text-slate-900">{e.eta} min</span>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {e.status === 'resolved' ? (
                  <Badge variant="success">
                    <CheckCircle2 className="h-3 w-3" />
                    Resolved
                  </Badge>
                ) : (
                  <>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                    <Button size="sm" variant="danger" className="bg-red-600 text-white hover:bg-red-700">
                      Alert ER
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${color}`}>{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: any }> = {
    reported: { label: 'Reported', variant: 'info' },
    dispatched: { label: 'Dispatched', variant: 'warning' },
    en_route: { label: 'En route', variant: 'warning' },
    arrived: { label: 'Arrived', variant: 'teal' },
    resolved: { label: 'Resolved', variant: 'success' }
  };
  const s = map[status] || map.reported;
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
