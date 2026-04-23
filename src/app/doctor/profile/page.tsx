'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { DoctorShell } from '@/components/doctor/doctor-shell';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, Stethoscope } from 'lucide-react';

export default function DoctorProfilePage() {
  return (
    <DoctorShell title="Profile">
      {(doctor) => {
        // Local editable state — in production, persist to Firestore under doctors/{id}
        const [firstName, setFirstName] = useState(doctor.firstName);
        const [lastName, setLastName] = useState(doctor.lastName);
        const [bio, setBio] = useState(doctor.bio);
        const [fee, setFee] = useState(String(doctor.consultationFee));
        const [teleFee, setTeleFee] = useState(String(doctor.telehealthFee));
        const [teleAvail, setTeleAvail] = useState(doctor.telehealthAvailable);
        const [accepting, setAccepting] = useState(doctor.isAcceptingPatients);
        const [start, setStart] = useState(doctor.workingHours.start);
        const [end, setEnd] = useState(doctor.workingHours.end);

        function save(e: React.FormEvent) {
          e.preventDefault();
          toast.success('Profile updated');
        }

        return (
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  My profile
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Update how patients see you on the public website.
                </p>
              </div>
            </div>

            <form
              onSubmit={save}
              className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
            >
              {/* Header */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <Image
                  src={doctor.photoURL}
                  alt={doctor.firstName}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-primary-100"
                  unoptimized
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                    {doctor.position}
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {doctor.title ?? 'Dr.'} {doctor.firstName} {doctor.lastName}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="teal">
                      <Stethoscope className="h-3 w-3" />
                      {doctor.department}
                    </Badge>
                    {doctor.qualification.map((q) => (
                      <Badge key={q} variant="outline">
                        {q}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>First name</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <Label>Last name</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Biography</Label>
                <Textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short bio shown on your public profile"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Consultation fee (₦)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Telehealth fee (₦)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={teleFee}
                    onChange={(e) => setTeleFee(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Working hours — start</Label>
                  <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
                </div>
                <div>
                  <Label>Working hours — end</Label>
                  <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-slate-50 p-4">
                <Toggle
                  checked={teleAvail}
                  onChange={setTeleAvail}
                  label="Offer telehealth consultations"
                  desc="Patients can book video visits with you."
                />
                <Toggle
                  checked={accepting}
                  onChange={setAccepting}
                  label="Accept new patients"
                  desc="When off, your profile will show as full."
                />
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <Button type="submit">
                  <Save className="h-4 w-4" />
                  Save changes
                </Button>
              </div>
            </form>
          </div>
        );
      }}
    </DoctorShell>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  desc
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-white p-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="relative h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary-500">
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
