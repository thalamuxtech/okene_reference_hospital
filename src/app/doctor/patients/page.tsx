'use client';

import { useMemo, useState } from 'react';
import { DoctorShell } from '@/components/doctor/doctor-shell';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User } from 'lucide-react';
import Link from 'next/link';
import { useRecordsStore } from '@/lib/records-store';
import { useTicketStore } from '@/lib/ticket-store';

export default function DoctorPatientsPage() {
  return (
    <DoctorShell title="Patients">
      {(doctor) => <PatientsBody doctorId={doctor.id} />}
    </DoctorShell>
  );
}

function PatientsBody({ doctorId }: { doctorId: string }) {
  const records = useRecordsStore((s) => s.records);
  const tickets = useTicketStore((s) => s.tickets);
  const [q, setQ] = useState('');

  const patients = useMemo(() => {
    const map = new Map<string, { name: string; phone?: string; visits: number; lastVisit: number; departments: Set<string> }>();
    records.forEach((r) => {
      const key = r.patientName;
      const entry = map.get(key) ?? {
        name: r.patientName,
        phone: r.patientPhone,
        visits: 0,
        lastVisit: 0,
        departments: new Set<string>()
      };
      entry.visits += 1;
      entry.lastVisit = Math.max(entry.lastVisit, r.date);
      entry.departments.add(r.department);
      entry.phone ??= r.patientPhone;
      map.set(key, entry);
    });
    // Include current active ticket patients too
    tickets
      .filter((t) => t.status !== 'waiting' || records.some((r) => r.patientName === t.patientName))
      .forEach((t) => {
        if (!map.has(t.patientName)) {
          map.set(t.patientName, {
            name: t.patientName,
            phone: t.phone,
            visits: 0,
            lastVisit: t.arrivedAt,
            departments: new Set([t.department])
          });
        }
      });

    let list = Array.from(map.values()).sort((a, b) => b.lastVisit - a.lastVisit);
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) || (p.phone && p.phone.toLowerCase().includes(s))
      );
    }
    return list;
  }, [records, tickets, q]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My patients</h1>
        <p className="mt-1 text-sm text-slate-600">
          Patients I have consulted · click to open their records.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search patient name or phone…"
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {patients.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">No patients yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {patients.map((p) => (
              <Link
                key={p.name}
                href="/doctor/records"
                className="flex items-center gap-4 p-4 hover:bg-slate-50"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-navy-500 text-xs font-bold text-white">
                  {p.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.phone ?? '—'}</p>
                </div>
                <div className="hidden sm:block">
                  {Array.from(p.departments).map((d) => (
                    <Badge key={d} variant="teal" className="mr-1">
                      {d}
                    </Badge>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{p.visits}</p>
                  <p className="text-[10px] uppercase text-slate-500">visits</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
