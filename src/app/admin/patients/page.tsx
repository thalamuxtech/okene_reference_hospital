'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  FileText,
  X,
  Save,
  Trash2,
  RotateCcw,
  CalendarPlus,
  Edit2
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  usePatientsStore,
  PATIENTS_CHANNEL,
  type Patient,
  type BloodGroup
} from '@/lib/patients-store';
import { useStoreSync } from '@/lib/use-store-sync';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

type FormState = Omit<Patient, 'id' | 'fullName' | 'registeredAt' | 'visits'>;

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  dob: '',
  age: 0,
  gender: 'Female',
  bloodGroup: 'O+',
  address: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  allergies: '',
  chronicConditions: '',
  notes: '',
  status: 'active'
};

export default function AdminPatientsPage() {
  const patients = usePatientsStore((s) => s.patients);
  const add = usePatientsStore((s) => s.add);
  const update = usePatientsStore((s) => s.update);
  const remove = usePatientsStore((s) => s.remove);
  const resetToSeed = usePatientsStore((s) => s.resetToSeed);

  // Keep our list fresh when other tabs change it.
  useStoreSync(PATIENTS_CHANNEL, () => usePatientsStore.persist.rehydrate());

  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const list = useMemo(() => {
    if (!q) return patients;
    const s = q.toLowerCase();
    return patients.filter((p) =>
      (p.fullName + p.id + p.phone + (p.email ?? '')).toLowerCase().includes(s)
    );
  }, [q, patients]);

  function openNew() {
    setEditingId(null);
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(p: Patient) {
    setEditingId(p.id);
    setForm({
      firstName: p.firstName,
      lastName: p.lastName,
      phone: p.phone,
      email: p.email ?? '',
      dob: p.dob ?? '',
      age: p.age,
      gender: p.gender,
      bloodGroup: p.bloodGroup,
      address: p.address ?? '',
      emergencyContactName: p.emergencyContactName ?? '',
      emergencyContactPhone: p.emergencyContactPhone ?? '',
      allergies: p.allergies ?? '',
      chronicConditions: p.chronicConditions ?? '',
      notes: p.notes ?? '',
      status: p.status
    });
    setOpen(true);
  }

  function save() {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('First and last name are required');
      return;
    }
    if (!form.phone.trim()) {
      toast.error('Phone is required');
      return;
    }

    if (editingId) {
      update(editingId, form);
      toast.success('Patient updated');
    } else {
      const created = add(form);
      toast.success(`Patient registered · ${created.id}`);
    }
    setOpen(false);
  }

  function del(p: Patient) {
    if (!confirm(`Remove ${p.fullName}?`)) return;
    remove(p.id);
    toast.message('Patient removed');
  }

  const totalActive = patients.filter((p) => p.status === 'active').length;
  const newThisMonth = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return patients.filter((p) => p.registeredAt >= start.getTime()).length;
  }, [patients]);

  return (
    <AdminShell title="Patients">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Patients</h1>
          <p className="mt-1 text-sm text-slate-600">Electronic medical records, history and consents.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => resetToSeed()}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" />
            Register patient
          </Button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total patients</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{patients.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Active</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{totalActive}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">New this month</p>
          <p className="mt-1 text-2xl font-bold text-primary-600">+{newThisMonth}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search name, phone, patient ID…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Age / Gender</th>
                <th className="px-4 py-3">Blood</th>
                <th className="px-4 py-3">Visits</th>
                <th className="px-4 py-3">Last visit</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {list.map((p) => {
                  const initials = p.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-navy-500 text-xs font-bold text-white">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{p.fullName}</p>
                            <p className="text-xs text-slate-500">{p.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.id}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {p.age}y · {p.gender}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{p.bloodGroup}</Badge>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{p.visits}</td>
                      <td className="px-4 py-3 text-slate-600">{p.lastVisit ?? '—'}</td>
                      <td className="px-4 py-3">
                        {p.status === 'active' ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="warning">Inactive</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/patients/detail?id=${encodeURIComponent(p.id)}`}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-600"
                            title="View records"
                          >
                            <FileText className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/appointments?patient=${encodeURIComponent(p.id)}`}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-600"
                            title="Book appointment"
                          >
                            <CalendarPlus className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => openEdit(p)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => del(p)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {list.length === 0 && (
          <div className="p-12 text-center text-sm text-slate-500">
            No patients match your search.
          </div>
        )}
      </div>

      <PatientDialog
        open={open}
        editing={!!editingId}
        form={form}
        setForm={setForm}
        onClose={() => setOpen(false)}
        onSave={save}
      />
    </AdminShell>
  );
}

function PatientDialog({
  open,
  editing,
  form,
  setForm,
  onClose,
  onSave
}: {
  open: boolean;
  editing: boolean;
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
            <div className="w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-bold text-slate-900">
                  {editing ? 'Edit patient' : 'Register patient'}
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>First name *</Label>
                    <Input
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Last name *</Label>
                    <Input
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+234 803 …"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.email ?? ''}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  <div>
                    <Label>Date of birth</Label>
                    <Input
                      type="date"
                      value={form.dob ?? ''}
                      onChange={(e) => {
                        const dob = e.target.value;
                        const age = dob
                          ? Math.max(
                              0,
                              Math.floor(
                                (Date.now() - new Date(dob).getTime()) / 31557600000
                              )
                            )
                          : form.age;
                        setForm({ ...form, dob, age });
                      }}
                    />
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.age}
                      onChange={(e) =>
                        setForm({ ...form, age: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                      className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label>Blood group</Label>
                    <select
                      value={form.bloodGroup}
                      onChange={(e) =>
                        setForm({ ...form, bloodGroup: e.target.value as BloodGroup })
                      }
                      className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
                    >
                      {BLOOD_GROUPS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Address</Label>
                  <Input
                    value={form.address ?? ''}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Street, town, LGA"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Emergency contact · name</Label>
                    <Input
                      value={form.emergencyContactName ?? ''}
                      onChange={(e) =>
                        setForm({ ...form, emergencyContactName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Emergency contact · phone</Label>
                    <Input
                      value={form.emergencyContactPhone ?? ''}
                      onChange={(e) =>
                        setForm({ ...form, emergencyContactPhone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Allergies</Label>
                    <Input
                      value={form.allergies ?? ''}
                      onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                      placeholder="Penicillin, …"
                    />
                  </div>
                  <div>
                    <Label>Chronic conditions</Label>
                    <Input
                      value={form.chronicConditions ?? ''}
                      onChange={(e) =>
                        setForm({ ...form, chronicConditions: e.target.value })
                      }
                      placeholder="Hypertension, diabetes, …"
                    />
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    rows={3}
                    value={form.notes ?? ''}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Active patient
                    </span>
                    <input
                      type="checkbox"
                      checked={form.status === 'active'}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.checked ? 'active' : 'inactive'
                        })
                      }
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        'relative h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary-500'
                      )}
                    >
                      <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onSave}>
                  <Save className="h-4 w-4" />
                  {editing ? 'Save changes' : 'Register patient'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
