'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CalendarPlus,
  Edit2,
  Heart,
  Baby,
  Activity,
  Scan,
  Plus,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import {
  usePatientsStore,
  PATIENTS_CHANNEL,
  type Patient,
  type AntenatalVisit,
  type ScanRecord,
  type NeonateGrowthPoint,
  type PregnancyRecord
} from '@/lib/patients-store';
import { useStoreSync } from '@/lib/use-store-sync';
import {
  GrowthChart,
  NEONATE_WEIGHT_REF,
  NEONATE_HEIGHT_REF,
  NEONATE_HEAD_REF
} from '@/components/growth-chart';
import { useAppointmentsStore } from '@/lib/appointments-store';

export default function AdminPatientDetailPage() {
  return (
    <Suspense fallback={<AdminShell title="Patient"><div className="container py-10">Loading…</div></AdminShell>}>
      <PatientDetail />
    </Suspense>
  );
}

function PatientDetail() {
  const params = useSearchParams();
  const id = params.get('id');
  const patients = usePatientsStore((s) => s.patients);
  useStoreSync(PATIENTS_CHANNEL, () => usePatientsStore.persist.rehydrate());
  const appointments = useAppointmentsStore((s) => s.appointments);

  const patient = useMemo(() => patients.find((p) => p.id === id), [patients, id]);

  if (!patient) {
    return (
      <AdminShell title="Patient">
        <div className="mx-auto max-w-md py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Patient not found</h1>
          <p className="mt-2 text-sm text-slate-600">
            This patient may have been removed, or the ID is invalid.
          </p>
          <Link
            href="/admin/patients"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border-2 border-primary-500 bg-white px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back to patients
          </Link>
        </div>
      </AdminShell>
    );
  }

  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);

  const isOBGYNCandidate = patient.gender === 'Female';

  return (
    <AdminShell title={patient.fullName}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/patients"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:border-primary-500 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{patient.fullName}</h1>
            <p className="mt-0.5 font-mono text-xs text-slate-500">{patient.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/appointments?patient=${encodeURIComponent(patient.id)}`}>
            <Button variant="outline">
              <CalendarPlus className="h-4 w-4" />
              Book appointment
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Demographics
          </h3>
          <dl className="mt-3 space-y-2 text-sm">
            <Row k="Age" v={`${patient.age}y`} />
            <Row k="Gender" v={patient.gender} />
            <Row k="Blood" v={patient.bloodGroup} />
            <Row k="Phone" v={patient.phone} />
            {patient.email && <Row k="Email" v={patient.email} />}
            {patient.address && <Row k="Address" v={patient.address} />}
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Clinical
          </h3>
          <dl className="mt-3 space-y-2 text-sm">
            {patient.allergies && <Row k="Allergies" v={patient.allergies} />}
            {patient.chronicConditions && <Row k="Chronic" v={patient.chronicConditions} />}
            <Row k="Visits" v={String(patient.visits)} />
            {patient.lastVisit && <Row k="Last visit" v={patient.lastVisit} />}
            <Row
              k="Status"
              v={patient.status === 'active' ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Inactive</Badge>}
            />
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Emergency contact
          </h3>
          <dl className="mt-3 space-y-2 text-sm">
            <Row k="Name" v={patient.emergencyContactName ?? '—'} />
            <Row k="Phone" v={patient.emergencyContactPhone ?? '—'} />
          </dl>
        </div>
      </div>

      {/* Appointments */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Appointments
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {patientAppointments.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-slate-500">
              No appointments yet.
            </div>
          )}
          {patientAppointments.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-mono text-xs text-slate-500">{a.id}</p>
                <p className="text-sm font-semibold text-slate-900">
                  {a.date} · {a.time} · {a.doctorName}
                </p>
                <p className="text-xs text-slate-500">{a.specialty} · {a.type}</p>
              </div>
              <Badge variant={a.status === 'completed' ? 'success' : 'info'}>{a.status}</Badge>
            </div>
          ))}
        </div>
      </div>

      {isOBGYNCandidate && <OBGYNSection patient={patient} />}

      {patient.notes && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Notes</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{patient.notes}</p>
        </div>
      )}
    </AdminShell>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-slate-500">{k}</dt>
      <dd className="text-right font-medium text-slate-900">{v}</dd>
    </div>
  );
}

/* -------------------------- OBGYN --------------------------- */

function OBGYNSection({ patient }: { patient: Patient }) {
  const setPregnancy = usePatientsStore((s) => s.setPregnancy);
  const addAntenatalVisit = usePatientsStore((s) => s.addAntenatalVisit);
  const addScan = usePatientsStore((s) => s.addScan);
  const addNeonatePoint = usePatientsStore((s) => s.addNeonatePoint);

  const pregnancy: PregnancyRecord = patient.pregnancy ?? {
    isPregnant: false,
    antenatalVisits: [],
    scans: [],
    neonateGrowth: []
  };

  const [tab, setTab] = useState<'antenatal' | 'scans' | 'neonate' | 'details'>('antenatal');
  const [editing, setEditing] = useState(false);
  const [lmp, setLmp] = useState(pregnancy.lmp ?? '');
  const [gravida, setGravida] = useState(pregnancy.gravida ?? 1);
  const [para, setPara] = useState(pregnancy.para ?? 0);
  const [baseline, setBaseline] = useState(pregnancy.bloodPressureBaseline ?? '');
  const [delivered, setDelivered] = useState(pregnancy.deliveredOn ?? '');
  const [deliveryNotes, setDeliveryNotes] = useState(pregnancy.deliveryNotes ?? '');

  function saveHeader() {
    const edd = lmp
      ? new Date(new Date(lmp).getTime() + 280 * 86_400_000).toISOString().slice(0, 10)
      : pregnancy.edd;
    setPregnancy(patient.id, {
      ...pregnancy,
      isPregnant: !delivered,
      lmp: lmp || undefined,
      edd,
      gravida,
      para,
      bloodPressureBaseline: baseline || undefined,
      deliveredOn: delivered || undefined,
      deliveryNotes: deliveryNotes || undefined
    });
    setEditing(false);
    toast.success('OBGYN record updated');
  }

  return (
    <section className="mt-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">OBGYN · Antenatal & Neonate</h2>
            <p className="text-xs text-slate-500">
              Prenatal visits, scans and post-natal growth tracking.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pregnancy.isPregnant && pregnancy.edd && (
            <Badge variant="purple">EDD · {pregnancy.edd}</Badge>
          )}
          {pregnancy.deliveredOn && (
            <Badge variant="success">Delivered · {pregnancy.deliveredOn}</Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
            <Edit2 className="h-3.5 w-3.5" />
            {editing ? 'Cancel' : 'Edit record'}
          </Button>
        </div>
      </div>

      {editing && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <Label>LMP</Label>
              <Input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
            </div>
            <div>
              <Label>Gravida</Label>
              <Input
                type="number"
                min={0}
                value={gravida}
                onChange={(e) => setGravida(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Para</Label>
              <Input
                type="number"
                min={0}
                value={para}
                onChange={(e) => setPara(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>BP baseline</Label>
              <Input value={baseline} onChange={(e) => setBaseline(e.target.value)} placeholder="120/80" />
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Delivered on (optional)</Label>
              <Input type="date" value={delivered} onChange={(e) => setDelivered(e.target.value)} />
            </div>
            <div>
              <Label>Delivery notes</Label>
              <Input value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button onClick={saveHeader}>
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-1 border-b border-slate-200">
        {(
          [
            { id: 'antenatal', label: 'Antenatal visits', icon: Activity },
            { id: 'scans', label: 'Scans', icon: Scan },
            { id: 'neonate', label: 'Neonate growth', icon: Baby }
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'antenatal' && (
          <AntenatalTab
            visits={pregnancy.antenatalVisits}
            onAdd={(v) => {
              addAntenatalVisit(patient.id, v);
              toast.success('Antenatal visit added');
            }}
          />
        )}
        {tab === 'scans' && (
          <ScansTab
            scans={pregnancy.scans}
            onAdd={(s) => {
              addScan(patient.id, s);
              toast.success('Scan recorded');
            }}
          />
        )}
        {tab === 'neonate' && (
          <NeonateTab
            points={pregnancy.neonateGrowth}
            onAdd={(p) => {
              addNeonatePoint(patient.id, p);
              toast.success('Growth point added');
            }}
          />
        )}
      </div>
    </section>
  );
}

function AntenatalTab({
  visits,
  onAdd
}: {
  visits: AntenatalVisit[];
  onAdd: (v: Omit<AntenatalVisit, 'id'>) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<Omit<AntenatalVisit, 'id'>>({ date: today });
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-sm font-bold text-slate-900">Record new visit</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <Label>Gestation (weeks)</Label>
            <Input
              type="number"
              value={form.gestationWeeks ?? ''}
              onChange={(e) => setForm({ ...form, gestationWeeks: Number(e.target.value) || undefined })}
            />
          </div>
          <div>
            <Label>BP</Label>
            <Input placeholder="120/80" value={form.bp ?? ''} onChange={(e) => setForm({ ...form, bp: e.target.value })} />
          </div>
          <div>
            <Label>Weight (kg)</Label>
            <Input value={form.weight ?? ''} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div>
            <Label>Fundal height (cm)</Label>
            <Input value={form.fundalHeight ?? ''} onChange={(e) => setForm({ ...form, fundalHeight: e.target.value })} />
          </div>
          <div>
            <Label>Fetal HR (bpm)</Label>
            <Input value={form.fetalHeartRate ?? ''} onChange={(e) => setForm({ ...form, fetalHeartRate: e.target.value })} />
          </div>
          <div>
            <Label>Urine protein</Label>
            <Input value={form.urineProtein ?? ''} onChange={(e) => setForm({ ...form, urineProtein: e.target.value })} />
          </div>
        </div>
        <div className="mt-3">
          <Label>Notes</Label>
          <Textarea
            rows={2}
            value={form.notes ?? ''}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            onClick={() => {
              onAdd(form);
              setForm({ date: today });
            }}
          >
            <Plus className="h-4 w-4" />
            Add visit
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-3">
          <h4 className="text-sm font-bold text-slate-900">Visit history · {visits.length}</h4>
        </div>
        <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
          {visits.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-slate-500">No visits yet.</div>
          )}
          {visits
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((v) => (
              <div key={v.id} className="px-5 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">
                    {v.date}
                    {v.gestationWeeks != null && (
                      <span className="ml-2 text-xs font-normal text-slate-500">
                        · {v.gestationWeeks} weeks
                      </span>
                    )}
                  </p>
                  {v.bp && <Badge variant="outline">BP {v.bp}</Badge>}
                </div>
                <div className="mt-1 grid grid-cols-2 gap-1 text-xs text-slate-600 sm:grid-cols-4">
                  {v.weight && <span>Wt · {v.weight}</span>}
                  {v.fundalHeight && <span>FH · {v.fundalHeight}</span>}
                  {v.fetalHeartRate && <span>FHR · {v.fetalHeartRate}</span>}
                  {v.urineProtein && <span>Urine · {v.urineProtein}</span>}
                </div>
                {v.notes && <p className="mt-1 text-xs text-slate-500">{v.notes}</p>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function ScansTab({
  scans,
  onAdd
}: {
  scans: ScanRecord[];
  onAdd: (s: Omit<ScanRecord, 'id'>) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<Omit<ScanRecord, 'id'>>({
    date: today,
    type: 'dating',
    findings: ''
  });
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-sm font-bold text-slate-900">New scan</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <Label>Type</Label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ScanRecord['type'] })}
              className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
            >
              <option value="dating">Dating</option>
              <option value="anomaly">Anomaly</option>
              <option value="growth">Growth</option>
              <option value="doppler">Doppler</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <Label>Performed by</Label>
          <Input
            value={form.performedBy ?? ''}
            onChange={(e) => setForm({ ...form, performedBy: e.target.value })}
            placeholder="Dr. …"
          />
        </div>
        <div className="mt-3">
          <Label>Findings</Label>
          <Textarea
            rows={3}
            value={form.findings}
            onChange={(e) => setForm({ ...form, findings: e.target.value })}
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            onClick={() => {
              if (!form.findings.trim()) {
                toast.error('Add findings before saving');
                return;
              }
              onAdd(form);
              setForm({ date: today, type: 'dating', findings: '' });
            }}
          >
            <Plus className="h-4 w-4" />
            Save scan
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-3">
          <h4 className="text-sm font-bold text-slate-900">Scan history · {scans.length}</h4>
        </div>
        <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
          {scans.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-slate-500">No scans yet.</div>
          )}
          {scans
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((s) => (
              <div key={s.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    {s.date}
                    <span className="ml-2 text-xs font-normal uppercase tracking-wide text-primary-600">
                      {s.type}
                    </span>
                  </p>
                  {s.performedBy && <span className="text-xs text-slate-500">{s.performedBy}</span>}
                </div>
                <p className="mt-1 text-sm text-slate-700">{s.findings}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function NeonateTab({
  points,
  onAdd
}: {
  points: NeonateGrowthPoint[];
  onAdd: (p: Omit<NeonateGrowthPoint, 'id'>) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<Omit<NeonateGrowthPoint, 'id'>>({
    date: today,
    ageWeeks: 0,
    weightKg: 0
  });

  const weightPts = points.map((p) => ({ ageWeeks: p.ageWeeks, value: p.weightKg }));
  const heightPts = points
    .filter((p) => p.heightCm != null)
    .map((p) => ({ ageWeeks: p.ageWeeks, value: p.heightCm as number }));
  const headPts = points
    .filter((p) => p.headCircumferenceCm != null)
    .map((p) => ({ ageWeeks: p.ageWeeks, value: p.headCircumferenceCm as number }));

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <GrowthChart
          title="Weight"
          unit="kg"
          points={weightPts}
          low={NEONATE_WEIGHT_REF.low}
          high={NEONATE_WEIGHT_REF.high}
          color="#0D9488"
        />
        <GrowthChart
          title="Length"
          unit="cm"
          points={heightPts}
          low={NEONATE_HEIGHT_REF.low}
          high={NEONATE_HEIGHT_REF.high}
          color="#6D28D9"
        />
        <GrowthChart
          title="Head circumference"
          unit="cm"
          points={headPts}
          low={NEONATE_HEAD_REF.low}
          high={NEONATE_HEAD_REF.high}
          color="#DB2777"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h4 className="text-sm font-bold text-slate-900">Record measurement</h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <Label>Age (weeks)</Label>
              <Input
                type="number"
                min={0}
                value={form.ageWeeks}
                onChange={(e) => setForm({ ...form, ageWeeks: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Length (cm)</Label>
              <Input
                type="number"
                step="0.1"
                value={form.heightCm ?? ''}
                onChange={(e) =>
                  setForm({ ...form, heightCm: e.target.value === '' ? undefined : Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Head circumference (cm)</Label>
              <Input
                type="number"
                step="0.1"
                value={form.headCircumferenceCm ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    headCircumferenceCm: e.target.value === '' ? undefined : Number(e.target.value)
                  })
                }
              />
            </div>
          </div>
          <div className="mt-3">
            <Label>Notes</Label>
            <Textarea
              rows={2}
              value={form.notes ?? ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              onClick={() => {
                if (!form.weightKg) {
                  toast.error('Weight is required');
                  return;
                }
                onAdd(form);
                setForm({ date: today, ageWeeks: 0, weightKg: 0 });
              }}
            >
              <Plus className="h-4 w-4" />
              Add measurement
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <h4 className="text-sm font-bold text-slate-900">History · {points.length}</h4>
          </div>
          <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
            {points.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-slate-500">
                No growth records yet.
              </div>
            )}
            {points
              .slice()
              .sort((a, b) => b.ageWeeks - a.ageWeeks)
              .map((p) => (
                <div key={p.id} className="px-5 py-3 text-sm">
                  <p className="font-semibold text-slate-900">
                    {p.date} · {p.ageWeeks} wk
                  </p>
                  <div className="mt-1 grid grid-cols-3 gap-1 text-xs text-slate-600">
                    <span>Wt · {p.weightKg} kg</span>
                    {p.heightCm != null && <span>L · {p.heightCm} cm</span>}
                    {p.headCircumferenceCm != null && <span>HC · {p.headCircumferenceCm} cm</span>}
                  </div>
                  {p.notes && <p className="mt-1 text-xs text-slate-500">{p.notes}</p>}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
