'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { DOCTORS } from '@/lib/seed-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Star, Video, Edit2, MoreVertical, Search } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/utils';

export default function AdminDoctorsPage() {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    if (!q) return DOCTORS;
    const s = q.toLowerCase();
    return DOCTORS.filter((d) =>
      `${d.firstName} ${d.lastName} ${d.specialization.join(' ')} ${d.department}`.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <AdminShell title="Doctors">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Doctors</h1>
          <p className="mt-1 text-sm text-slate-600">Manage profiles, availability, telehealth and credentials.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add doctor
        </Button>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search doctor, specialty or department" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => (
          <div key={d.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="relative h-20 bg-gradient-to-br from-primary-500 to-navy-500">
              <button className="absolute right-3 top-3 rounded-lg bg-white/20 p-1.5 text-white backdrop-blur-sm hover:bg-white/30">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <div className="-mt-10 p-5">
              <Image src={d.photoURL} alt={d.firstName} width={72} height={72} className="h-[72px] w-[72px] rounded-full object-cover ring-4 ring-white" />
              <h3 className="mt-3 text-base font-bold text-slate-900">
                Dr. {d.firstName} {d.lastName}
              </h3>
              <p className="mt-0.5 text-xs text-primary-600">{d.qualification.join(', ')}</p>
              <p className="mt-0.5 text-xs text-slate-600">{d.department}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {d.averageRating.toFixed(2)} ({d.totalReviews})
                </span>
                <span>·</span>
                <span>{d.yearsOfExperience}y exp</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {d.telehealthAvailable && (
                  <Badge variant="purple">
                    <Video className="h-3 w-3" /> Telehealth
                  </Badge>
                )}
                {d.isAcceptingPatients ? (
                  <Badge variant="success">Accepting patients</Badge>
                ) : (
                  <Badge variant="warning">Full</Badge>
                )}
              </div>

              <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase text-slate-500">Fee</p>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(d.consultationFee)}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
