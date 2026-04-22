'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MoreVertical, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';

const PATIENTS = Array.from({ length: 24 }).map((_, i) => {
  const names = ['Ibrahim Musa', 'Fatima Kabir', 'Samuel Okoro', 'Grace Ayodele', 'Aisha Bello', 'Musa Idris', 'Chiamaka Eze', 'Tunde Adewale', 'Hauwa Aliyu', 'Chinedu Okafor'];
  const name = names[i % names.length];
  const initials = name.split(' ').map((n) => n[0]).join('');
  return {
    id: `ORH-2026-${(10000 + i).toString()}`,
    name,
    initials,
    phone: '+234 803 000 00' + String(i).padStart(2, '0'),
    age: 20 + (i % 50),
    gender: i % 2 === 0 ? 'Male' : 'Female',
    lastVisit: `${(i % 28) + 1} Apr 2026`,
    visits: (i % 12) + 1,
    bloodGroup: ['A+', 'O+', 'B+', 'AB+', 'O-'][i % 5],
    status: i % 7 === 0 ? 'inactive' : 'active'
  };
});

export default function AdminPatientsPage() {
  const [q, setQ] = useState('');
  const list = useMemo(() => (!q ? PATIENTS : PATIENTS.filter((p) => (p.name + p.id + p.phone).toLowerCase().includes(q.toLowerCase()))), [q]);

  return (
    <AdminShell title="Patients">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Patients</h1>
          <p className="mt-1 text-sm text-slate-600">Electronic medical records, history and consents.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Register patient
        </Button>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total patients</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">2,148</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">New this month</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">+182</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Consent · SMS reminders</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">93%</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search name, phone, patient ID…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
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
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-navy-500 text-xs font-bold text-white">
                        {p.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{p.name}</p>
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
                  <td className="px-4 py-3 text-slate-600">{p.lastVisit}</td>
                  <td className="px-4 py-3">
                    {p.status === 'active' ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Inactive</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600" title="View records">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
