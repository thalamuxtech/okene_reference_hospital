'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components/admin/admin-shell';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  X,
  Video,
  Clock,
  Save,
  RotateCcw,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import { DOCTORS, generateTimeSlots } from '@/lib/seed-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  useAppointmentsStore,
  APPOINTMENTS_CHANNEL,
  type Appointment,
  type AppointmentStatus,
  type AppointmentType
} from '@/lib/appointments-store';
import { usePatientsStore, PATIENTS_CHANNEL, type Patient } from '@/lib/patients-store';
import { useStoreSync } from '@/lib/use-store-sync';

export default function AdminAppointmentsPage() {
  return (
    <Suspense fallback={<AdminShell title="Appointments"><div className="container py-10">Loading…</div></AdminShell>}>
      <AppointmentsInner />
    </Suspense>
  );
}

function AppointmentsInner() {
  const params = useSearchParams();
  const prefillPatientId = params.get('patient');

  const appointments = useAppointmentsStore((s) => s.appointments);
  const addAppt = useAppointmentsStore((s) => s.add);
  const setStatus = useAppointmentsStore((s) => s.setStatus);
  const removeAppt = useAppointmentsStore((s) => s.remove);
  const resetAppts = useAppointmentsStore((s) => s.resetToSeed);
  const patients = usePatientsStore((s) => s.patients);

  useStoreSync(APPOINTMENTS_CHANNEL, () => useAppointmentsStore.persist.rehydrate());
  useStoreSync(PATIENTS_CHANNEL, () => usePatientsStore.persist.rehydrate());

  const [query, setQuery] = useState('');
  const [status, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (prefillPatientId) setDialogOpen(true);
  }, [prefillPatientId]);

  const list = useMemo(() => {
    return appointments.filter((a) => {
      if (status !== 'all' && a.status !== status) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(a.patientName + a.id + a.patientPhone).toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [appointments, status, query]);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function del(id: string) {
    if (!confirm('Delete this appointment?')) return;
    removeAppt(id);
    toast.message('Appointment deleted');
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => resetAppts()}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New appointment
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {(
          [
            { label: 'All', key: 'all', color: 'bg-slate-100 text-slate-700' },
            { label: 'Scheduled', key: 'scheduled', color: 'bg-blue-100 text-blue-700' },
            { label: 'Checked in', key: 'checked_in', color: 'bg-emerald-100 text-emerald-700' },
            { label: 'In progress', key: 'in_progress', color: 'bg-amber-100 text-amber-700' },
            { label: 'Completed', key: 'completed', color: 'bg-teal-100 text-teal-700' },
            { label: 'No-show', key: 'no_show', color: 'bg-red-100 text-red-700' }
          ] as const
        ).map((s) => {
          const value =
            s.key === 'all'
              ? appointments.length
              : appointments.filter((a) => a.status === s.key).length;
          return (
            <button
              key={s.label}
              onClick={() => setStatusFilter(s.key as AppointmentStatus | 'all')}
              className={cn(
                'rounded-xl border bg-white p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md',
                status === s.key ? 'border-primary-400 ring-2 ring-primary-100' : 'border-slate-200'
              )}
            >
              <p className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${s.color}`}>
                {s.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by patient, number or phone…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
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
                {list.map((a, i) => {
                  const doctor = DOCTORS.find((d) => d.id === a.doctorId);
                  return (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className={cn(
                        'transition-colors hover:bg-slate-50',
                        selected.includes(a.id) && 'bg-primary-50/40'
                      )}
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
                          <Clock className="h-3 w-3" /> {a.date} · {a.time}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{a.patientName}</p>
                        <p className="text-xs text-slate-500">{a.patientPhone}</p>
                        <p className="text-[11px] font-mono text-slate-400">{a.patientId}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {doctor && (
                            <Image
                              src={doctor.photoURL}
                              alt={doctor.firstName}
                              width={28}
                              height={28}
                              className="h-7 w-7 rounded-full object-cover"
                              unoptimized
                            />
                          )}
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{a.doctorName}</p>
                            <p className="text-[11px] text-slate-500">{a.specialty}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(a.fee)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={a.status}
                          onChange={(e) => setStatus(a.id, e.target.value as AppointmentStatus)}
                          className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 focus:border-primary-500 focus:outline-none"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="checked_in">Checked in</option>
                          <option value="in_progress">In progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="no_show">No-show</option>
                        </select>
                        {a.type === 'telehealth' && (
                          <Badge variant="purple" className="ml-1">
                            <Video className="h-3 w-3" />
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => del(a.id)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
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
            Showing <b className="text-slate-900">{list.length}</b> of {appointments.length}
            {selected.length > 0 && (
              <span className="ml-2 font-semibold text-primary-600">
                · {selected.length} selected
              </span>
            )}
          </p>
        </div>
      </div>

      <NewAppointmentDialog
        open={dialogOpen}
        patients={patients}
        prefillPatientId={prefillPatientId}
        onClose={() => setDialogOpen(false)}
        onSave={(payload) => {
          const created = addAppt(payload);
          toast.success(`Appointment ${created.id} booked`);
          setDialogOpen(false);
        }}
      />

    </AdminShell>
  );
}

function NewAppointmentDialog({
  open,
  patients,
  prefillPatientId,
  onClose,
  onSave
}: {
  open: boolean;
  patients: Patient[];
  prefillPatientId: string | null;
  onClose: () => void;
  onSave: (a: Omit<Appointment, 'id' | 'createdAt'>) => void;
}) {
  const [patientId, setPatientId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>(DOCTORS[0].id);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState<string>('09:00');
  const [type, setType] = useState<AppointmentType>('in-person');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    if (prefillPatientId) setPatientId(prefillPatientId);
  }, [prefillPatientId]);

  const patient = patients.find((p) => p.id === patientId);
  const doctor = DOCTORS.find((d) => d.id === doctorId)!;
  const slots = useMemo(
    () => generateTimeSlots(doctor.workingHours.start, doctor.workingHours.end),
    [doctor]
  );

  function save() {
    if (!patient) {
      toast.error('Select a patient first');
      return;
    }
    onSave({
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      doctorId: doctor.id,
      doctorName: `${doctor.title ?? 'Dr.'} ${doctor.firstName} ${doctor.lastName}`,
      specialty: doctor.specialization[0],
      date,
      time,
      type,
      reason,
      symptoms,
      fee: type === 'telehealth' ? doctor.telehealthFee : doctor.consultationFee,
      status: 'scheduled',
      createdBy: 'admin'
    });
    // reset for next
    setPatientId('');
    setReason('');
    setSymptoms('');
  }

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
            <div className="w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-bold text-slate-900">New appointment</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
                <div>
                  <Label>Patient</Label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">— Select a registered patient —</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} · {p.phone} · {p.id}
                      </option>
                    ))}
                  </select>
                  {patients.length === 0 && (
                    <p className="mt-1 text-xs text-slate-500">
                      No patients yet — register one first in the Patients page.
                    </p>
                  )}
                </div>

                <div>
                  <Label>Doctor</Label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
                  >
                    {DOCTORS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title ?? 'Dr.'} {d.firstName} {d.lastName} · {d.specialization[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
                    >
                      {slots.map((s) => (
                        <option key={s.time} value={s.time}>
                          {s.time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as AppointmentType)}
                      className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
                    >
                      <option value="in-person">In-person</option>
                      <option value="telehealth">Telehealth</option>
                      <option value="follow_up">Follow-up</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Reason for visit</Label>
                  <Input value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>

                <div>
                  <Label>Symptoms</Label>
                  <Textarea
                    rows={3}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />
                </div>

                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  Consultation fee:{' '}
                  <b>
                    {formatCurrency(
                      type === 'telehealth' ? doctor.telehealthFee : doctor.consultationFee
                    )}
                  </b>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={save}>
                  <Save className="h-4 w-4" />
                  Book appointment
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
