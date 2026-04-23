'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Calendar, Pill, ChevronDown } from 'lucide-react';
import { DoctorShell } from '@/components/doctor/doctor-shell';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRecordsStore } from '@/lib/records-store';

export default function DoctorRecordsPage() {
  return (
    <DoctorShell title="Medical Records">
      {(doctor) => <RecordsBody doctorId={doctor.id} />}
    </DoctorShell>
  );
}

function RecordsBody({ doctorId }: { doctorId: string }) {
  const all = useRecordsStore((s) => s.records);
  const [q, setQ] = useState('');
  const [mineOnly, setMineOnly] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const records = useMemo(() => {
    let list = [...all];
    if (mineOnly) list = list.filter((r) => r.doctorId === doctorId);
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) =>
        `${r.patientName} ${r.diagnosis} ${r.chiefComplaint} ${r.department}`
          .toLowerCase()
          .includes(s)
      );
    }
    return list.sort((a, b) => b.date - a.date);
  }, [all, q, mineOnly, doctorId]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Medical records</h1>
          <p className="mt-1 text-sm text-slate-600">
            Full clinical history across the hospital. Click any record to expand.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-primary-500">
          <input
            type="checkbox"
            checked={mineOnly}
            onChange={(e) => setMineOnly(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
          />
          My records only
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by patient, diagnosis, complaint…"
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {records.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">No records match your search.</p>
          </div>
        )}

        {records.map((r) => (
          <motion.div
            key={r.id}
            layout
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
          >
            <button
              onClick={() => setOpenId(openId === r.id ? null : r.id)}
              className="flex w-full items-center gap-4 p-5 text-left hover:bg-slate-50"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">{r.patientName}</p>
                  <Badge variant="teal">{r.department}</Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-600">
                  {r.diagnosis || r.chiefComplaint}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(r.date).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">{r.doctorName}</p>
              </div>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform ${
                  openId === r.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {openId === r.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-4 border-t border-slate-100 p-5 sm:grid-cols-2">
                    <Field label="Chief complaint" value={r.chiefComplaint} />
                    <Field label="Diagnosis" value={r.diagnosis} />
                    <Field label="Treatment plan" value={r.treatmentPlan} />
                    <Field
                      label="Prescription"
                      value={r.prescription}
                      icon={<Pill className="h-3.5 w-3.5" />}
                    />
                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Vitals
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {r.vitals.bp && <Badge variant="outline">BP {r.vitals.bp}</Badge>}
                        {r.vitals.pulse && (
                          <Badge variant="outline">Pulse {r.vitals.pulse}</Badge>
                        )}
                        {r.vitals.temp && <Badge variant="outline">Temp {r.vitals.temp}°C</Badge>}
                        {r.vitals.weight && (
                          <Badge variant="outline">Weight {r.vitals.weight}</Badge>
                        )}
                      </div>
                    </div>
                    {r.followUpDate && <Field label="Follow-up" value={r.followUpDate} />}
                    {r.notes && <Field label="Notes" value={r.notes} />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm text-slate-800">{value || '—'}</p>
    </div>
  );
}
