'use client';

import { useMemo, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Siren,
  Phone,
  MapPin,
  Ambulance,
  CheckCircle2,
  Clock,
  Plus,
  X,
  Save,
  Trash2,
  BellRing,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Label, Textarea } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  useEmergenciesStore,
  EMERGENCIES_CHANNEL,
  type Emergency,
  type EmergencySeverity,
  type EmergencyStatus,
  type EmergencyType
} from '@/lib/emergencies-store';
import { useStoreSync } from '@/lib/use-store-sync';

type FormState = Omit<Emergency, 'id' | 'createdAt' | 'log' | 'erAlerted'>;

const EMPTY_FORM: FormState = {
  caller: '',
  phone: '',
  type: 'Medical',
  severity: 'HIGH',
  location: '',
  status: 'reported',
  ambulance: 'AMB-01',
  eta: 10,
  notes: ''
};

export default function AdminEmergenciesPage() {
  const emergencies = useEmergenciesStore((s) => s.emergencies);
  const add = useEmergenciesStore((s) => s.add);
  const setStatus = useEmergenciesStore((s) => s.setStatus);
  const alertER = useEmergenciesStore((s) => s.alertER);
  const resolve = useEmergenciesStore((s) => s.resolve);
  const remove = useEmergenciesStore((s) => s.remove);

  useStoreSync(EMERGENCIES_CHANNEL, () => useEmergenciesStore.persist.rehydrate());

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [selected, setSelected] = useState<Emergency | null>(null);

  const active = useMemo(
    () => emergencies.filter((e) => e.status !== 'resolved'),
    [emergencies]
  );

  function save() {
    if (!form.location.trim()) {
      toast.error('Location is required');
      return;
    }
    const created = add(form);
    toast.success(`Emergency ${created.id} logged`);
    setOpen(false);
    setForm(EMPTY_FORM);
  }

  function del(id: string) {
    if (!confirm('Delete this emergency record?')) return;
    remove(id);
    toast.message('Deleted');
  }

  return (
    <AdminShell title="Emergencies">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Emergency operations</h1>
          <p className="mt-1 text-sm text-slate-600">
            Live hotline feed · Ambulance dispatch · ER pre-alerts.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Log emergency
        </Button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <StatCard label="Active" value={String(active.length)} color="bg-red-100 text-red-700" />
        <StatCard
          label="Critical"
          value={String(emergencies.filter((e) => e.severity === 'CRITICAL' && e.status !== 'resolved').length)}
          color="bg-rose-100 text-rose-700"
        />
        <StatCard
          label="ER alerted"
          value={String(emergencies.filter((e) => e.erAlerted && e.status !== 'resolved').length)}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          label="Resolved today"
          value={String(
            emergencies.filter(
              (e) =>
                e.resolvedAt &&
                Date.now() - e.resolvedAt < 24 * 3_600_000
            ).length
          )}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {emergencies.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-xs transition-all hover:shadow-md ${
                e.severity === 'CRITICAL' && e.status !== 'resolved'
                  ? 'border-red-200'
                  : 'border-slate-200'
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
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-md ${
                    e.severity === 'CRITICAL'
                      ? 'bg-red-600'
                      : e.severity === 'HIGH'
                      ? 'bg-amber-600'
                      : 'bg-slate-600'
                  }`}
                >
                  <Siren className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-sm font-bold text-slate-900">{e.id}</p>
                    <Badge
                      variant={
                        e.severity === 'CRITICAL'
                          ? 'danger'
                          : e.severity === 'HIGH'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {e.severity}
                    </Badge>
                    <Badge variant="outline">{e.type}</Badge>
                    <StatusBadge status={e.status} />
                    {e.erAlerted && (
                      <Badge variant="purple">
                        <BellRing className="h-3 w-3" /> ER alerted
                      </Badge>
                    )}
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
                      {timeAgo(e.createdAt)}
                    </span>
                  </div>
                  {e.notes && (
                    <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-700">
                      {e.notes}
                    </p>
                  )}
                </div>

                {e.status !== 'resolved' && (
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Ambulance className="h-4 w-4" />
                      {e.ambulance ?? '—'}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      ETA <span className="font-bold text-slate-900">{e.eta ?? '—'} min</span>
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {e.status === 'resolved' ? (
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3" />
                      Resolved
                    </Badge>
                  ) : (
                    <>
                      <select
                        value={e.status}
                        onChange={(ev) =>
                          setStatus(e.id, ev.target.value as EmergencyStatus)
                        }
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 focus:border-primary-500 focus:outline-none"
                      >
                        <option value="reported">Reported</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="en_route">En route</option>
                        <option value="arrived">Arrived</option>
                      </select>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelected(e)}>
                          Details
                        </Button>
                        {!e.erAlerted && (
                          <Button
                            size="sm"
                            variant="danger"
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => {
                              alertER(e.id);
                              toast.success('ER pre-alert sent', {
                                description: `${e.id} · ${e.type} · ${e.severity}`
                              });
                            }}
                          >
                            <BellRing className="h-3.5 w-3.5" />
                            Alert ER
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-700 hover:bg-emerald-50"
                          onClick={() => {
                            const note = prompt('Resolution notes (optional)') ?? undefined;
                            resolve(e.id, note);
                            toast.success('Emergency resolved');
                          }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Resolve
                        </Button>
                      </div>
                    </>
                  )}
                  <button
                    onClick={() => del(e.id)}
                    className="self-end rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {emergencies.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm text-slate-500">No emergencies logged.</p>
          </div>
        )}
      </div>

      <EmergencyDialog
        open={open}
        form={form}
        setForm={setForm}
        onClose={() => setOpen(false)}
        onSave={save}
      />

      <DetailsDialog emergency={selected} onClose={() => setSelected(null)} />
    </AdminShell>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${color}`}>
        {label}
      </p>
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

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} h ago`;
  return `${Math.floor(hr / 24)} d ago`;
}

function EmergencyDialog({
  open,
  form,
  setForm,
  onClose,
  onSave
}: {
  open: boolean;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          >
            <div className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-bold text-slate-900">Log emergency</h2>
                <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Caller name</Label>
                    <Input
                      value={form.caller}
                      onChange={(e) => setForm((f) => ({ ...f, caller: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Caller phone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Type</Label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as EmergencyType }))}
                      className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
                    >
                      <option>Medical</option>
                      <option>Obstetric</option>
                      <option>Accident</option>
                      <option>Pediatric</option>
                      <option>Cardiac</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <Label>Severity</Label>
                    <select
                      value={form.severity}
                      onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as EmergencySeverity }))}
                      className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
                    >
                      <option>CRITICAL</option>
                      <option>HIGH</option>
                      <option>MODERATE</option>
                      <option>LOW</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Location *</Label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="Street, landmark, town"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <Label>Status</Label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as EmergencyStatus }))}
                      className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
                    >
                      <option value="reported">Reported</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="en_route">En route</option>
                      <option value="arrived">Arrived</option>
                    </select>
                  </div>
                  <div>
                    <Label>Ambulance</Label>
                    <Input
                      value={form.ambulance ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, ambulance: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>ETA (min)</Label>
                    <Input
                      type="number"
                      value={form.eta ?? 0}
                      onChange={(e) => setForm((f) => ({ ...f, eta: Number(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    rows={3}
                    value={form.notes ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onSave}>
                  <Save className="h-4 w-4" />
                  Log emergency
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DetailsDialog({
  emergency,
  onClose
}: {
  emergency: Emergency | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {emergency && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          >
            <div className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-bold text-slate-900">{emergency.id}</h2>
                <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[70vh] space-y-3 overflow-y-auto p-6 text-sm">
                <p>
                  <span className="text-slate-500">Caller:</span>{' '}
                  <b>{emergency.caller}</b> · {emergency.phone}
                </p>
                <p>
                  <span className="text-slate-500">Type:</span> {emergency.type} ·{' '}
                  <Badge>{emergency.severity}</Badge>
                </p>
                <p>
                  <span className="text-slate-500">Location:</span> {emergency.location}
                </p>
                {emergency.notes && (
                  <p className="rounded-lg bg-slate-50 p-3 text-slate-700">{emergency.notes}</p>
                )}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Timeline
                  </p>
                  <ol className="space-y-2 border-l-2 border-slate-200 pl-4 text-xs">
                    {emergency.log.map((l, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-primary-500 ring-2 ring-white" />
                        <p className="font-semibold text-slate-900">{l.action}</p>
                        <p className="text-slate-500">
                          {new Date(l.at).toLocaleString()} · by {l.by}
                        </p>
                        {l.detail && <p className="mt-0.5 text-slate-600">{l.detail}</p>}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
