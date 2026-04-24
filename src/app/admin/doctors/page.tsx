'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Plus, Star, Video, Edit2, Search, Trash2, X, Save, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import { useDoctorsStore } from '@/lib/doctors-store';
import { SPECIALTIES, type Doctor } from '@/lib/seed-data';
import { toast } from 'sonner';

type FormState = Omit<Doctor, 'id' | 'doctorId' | 'averageRating' | 'totalReviews' | 'totalPatientsSeen'>;

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  title: 'Dr.',
  photoURL: '',
  qualification: [],
  specialization: [],
  specialtyId: 'general',
  yearsOfExperience: 0,
  consultationFee: 10000,
  telehealthAvailable: false,
  telehealthFee: 0,
  languages: ['English'],
  bio: '',
  department: 'General Medicine',
  position: 'Medical Officer',
  workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
  workingHours: { start: '09:00', end: '17:00' },
  isAcceptingPatients: true,
  hometown: ''
};

export default function AdminDoctorsPage() {
  const doctors = useDoctorsStore((s) => s.doctors);
  const addDoctor = useDoctorsStore((s) => s.add);
  const updateDoctor = useDoctorsStore((s) => s.update);
  const removeDoctor = useDoctorsStore((s) => s.remove);
  const resetDoctors = useDoctorsStore((s) => s.resetToSeed);
  const [q, setQ] = useState('');

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const list = useMemo(() => {
    if (!q) return doctors;
    const s = q.toLowerCase();
    return doctors.filter((d) =>
      `${d.firstName} ${d.lastName} ${d.specialization.join(' ')} ${d.department}`
        .toLowerCase()
        .includes(s)
    );
  }, [q, doctors]);

  function openNew() {
    setEditingId(null);
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(d: Doctor) {
    setEditingId(d.id);
    setForm({
      firstName: d.firstName,
      lastName: d.lastName,
      title: d.title,
      photoURL: d.photoURL,
      qualification: d.qualification,
      specialization: d.specialization,
      specialtyId: d.specialtyId,
      yearsOfExperience: d.yearsOfExperience,
      consultationFee: d.consultationFee,
      telehealthAvailable: d.telehealthAvailable,
      telehealthFee: d.telehealthFee,
      languages: d.languages,
      bio: d.bio,
      department: d.department,
      position: d.position,
      workingDays: d.workingDays,
      workingHours: d.workingHours,
      isAcceptingPatients: d.isAcceptingPatients,
      hometown: d.hometown
    });
    setOpen(true);
  }

  function save() {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('Name is required');
      return;
    }
    const avatarFallback = form.photoURL.trim()
      ? form.photoURL
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          form.firstName + ' ' + form.lastName
        )}&size=400&background=006E6E&color=ffffff&bold=true&format=png`;
    const payload = { ...form, photoURL: avatarFallback };

    if (editingId) {
      updateDoctor(editingId, payload);
      toast.success('Doctor updated');
    } else {
      addDoctor(payload);
      toast.success('Doctor added');
    }
    setOpen(false);
  }

  function del(d: Doctor) {
    if (!confirm(`Remove ${d.title ?? 'Dr.'} ${d.firstName} ${d.lastName}?`)) return;
    removeDoctor(d.id);
    toast.message('Doctor removed');
  }

  return (
    <AdminShell title="Doctors">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Doctors</h1>
          <p className="mt-1 text-sm text-slate-600">
            Full CRUD · changes apply across the website and patient-facing directory.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => resetDoctors()}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" />
            Add doctor
          </Button>
        </div>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search doctor, specialty or department"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => (
          <div
            key={d.id}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative flex justify-center pt-6 pb-3">
              <Image
                src={d.photoURL}
                alt={d.firstName}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-lg transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute right-3 top-3 flex gap-1">
                <button
                  onClick={() => openEdit(d)}
                  className="rounded-lg bg-slate-100 p-1.5 text-slate-600 transition-colors hover:bg-primary-500 hover:text-white"
                  aria-label="Edit"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => del(d)}
                  className="rounded-lg bg-slate-100 p-1.5 text-slate-600 transition-colors hover:bg-red-500 hover:text-white"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="h-1.5 bg-gradient-to-br from-primary-500 to-navy-500" />
            <div className="p-5">
              <h3 className="text-center text-base font-bold text-slate-900">
                {d.title ?? 'Dr.'} {d.firstName} {d.lastName}
              </h3>
              <p className="mt-0.5 text-center text-xs text-primary-600">
                {d.qualification.join(', ') || '—'}
              </p>
              <p className="mt-0.5 text-center text-xs text-slate-600">{d.department}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {d.averageRating.toFixed(2)} ({d.totalReviews})
                </span>
                <span>·</span>
                <span>{d.yearsOfExperience}y</span>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {d.telehealthAvailable && (
                  <Badge variant="purple">
                    <Video className="h-3 w-3" /> Telehealth
                  </Badge>
                )}
                {d.isAcceptingPatients ? (
                  <Badge variant="success">Accepting</Badge>
                ) : (
                  <Badge variant="warning">Full</Badge>
                )}
              </div>

              <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase text-slate-500">Fee</p>
                  <p className="text-sm font-bold text-slate-900">
                    {formatCurrency(d.consultationFee)}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => openEdit(d)}>
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 240, damping: 26 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
            >
              <div className="w-full max-w-2xl overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingId ? 'Edit doctor' : 'Add doctor'}
                  </h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto p-6">
                  <DoctorForm form={form} setForm={setForm} />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
                  <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={save}>
                    <Save className="h-4 w-4" />
                    {editingId ? 'Save changes' : 'Create doctor'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}

function DoctorForm({
  form,
  setForm
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[120px_1fr_1fr]">
        <div>
          <Label>Title</Label>
          <select
            value={form.title ?? 'Dr.'}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="Dr.">Dr.</option>
            <option value="Prof.">Prof.</option>
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Ms.">Ms.</option>
          </select>
        </div>
        <div>
          <Label>First name</Label>
          <Input
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>
        <div>
          <Label>Last name</Label>
          <Input
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Photo URL (optional — falls back to auto-generated avatar)</Label>
        <Input
          value={form.photoURL}
          onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
          placeholder="https://…"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Specialty</Label>
          <select
            value={form.specialtyId}
            onChange={(e) => {
              const s = SPECIALTIES.find((x) => x.id === e.target.value);
              setForm({
                ...form,
                specialtyId: e.target.value,
                department: s?.name ?? form.department,
                specialization: s ? [s.name] : form.specialization
              });
            }}
            className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm focus:border-primary-500 focus:outline-none"
          >
            {SPECIALTIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Position</Label>
          <Input
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            placeholder="Consultant, Senior Registrar…"
          />
        </div>
      </div>

      <div>
        <Label>Qualifications (comma-separated)</Label>
        <Input
          value={form.qualification.join(', ')}
          onChange={(e) =>
            setForm({
              ...form,
              qualification: e.target.value
                .split(',')
                .map((x) => x.trim())
                .filter(Boolean)
            })
          }
          placeholder="MBBS, FMCS, FWACS"
        />
      </div>

      <div>
        <Label>Languages (comma-separated)</Label>
        <Input
          value={form.languages.join(', ')}
          onChange={(e) =>
            setForm({
              ...form,
              languages: e.target.value
                .split(',')
                .map((x) => x.trim())
                .filter(Boolean)
            })
          }
          placeholder="English, Ebira, Hausa"
        />
      </div>

      <div>
        <Label>Bio</Label>
        <Textarea
          rows={3}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label>Years of experience</Label>
          <Input
            type="number"
            min={0}
            value={form.yearsOfExperience}
            onChange={(e) =>
              setForm({ ...form, yearsOfExperience: Number(e.target.value) || 0 })
            }
          />
        </div>
        <div>
          <Label>Consultation fee (₦)</Label>
          <Input
            type="number"
            min={0}
            value={form.consultationFee}
            onChange={(e) => setForm({ ...form, consultationFee: Number(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label>Telehealth fee (₦)</Label>
          <Input
            type="number"
            min={0}
            value={form.telehealthFee}
            onChange={(e) => setForm({ ...form, telehealthFee: Number(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Working hours · start</Label>
          <Input
            type="time"
            value={form.workingHours.start}
            onChange={(e) =>
              setForm({ ...form, workingHours: { ...form.workingHours, start: e.target.value } })
            }
          />
        </div>
        <div>
          <Label>Working hours · end</Label>
          <Input
            type="time"
            value={form.workingHours.end}
            onChange={(e) =>
              setForm({ ...form, workingHours: { ...form.workingHours, end: e.target.value } })
            }
          />
        </div>
      </div>

      <div>
        <Label>Working days</Label>
        <div className="flex flex-wrap gap-2">
          {(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const).map((d) => {
            const on = form.workingDays.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    workingDays: on
                      ? form.workingDays.filter((x) => x !== d)
                      : [...form.workingDays, d]
                  })
                }
                className={cn(
                  'rounded-full border-2 px-3 py-1 text-xs font-semibold transition-colors',
                  on
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'
                )}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 rounded-xl bg-slate-50 p-4">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            Offer telehealth
          </span>
          <input
            type="checkbox"
            checked={form.telehealthAvailable}
            onChange={(e) => setForm({ ...form, telehealthAvailable: e.target.checked })}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary-500">
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
          </span>
        </label>
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            Accepting new patients
          </span>
          <input
            type="checkbox"
            checked={form.isAcceptingPatients}
            onChange={(e) => setForm({ ...form, isAcceptingPatients: e.target.checked })}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary-500">
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
          </span>
        </label>
      </div>
    </div>
  );
}
