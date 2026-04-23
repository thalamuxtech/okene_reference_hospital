'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Users,
  CheckCircle2,
  FileText,
  ArrowRight,
  Clock,
  Activity,
  Star,
  Languages,
  Calendar
} from 'lucide-react';
import { DoctorShell } from '@/components/doctor/doctor-shell';
import { useTicketStore } from '@/lib/ticket-store';
import { useRecordsStore } from '@/lib/records-store';
import { Badge } from '@/components/ui/badge';

export default function DoctorHome() {
  return (
    <DoctorShell title="Dashboard">
      {(doctor) => {
        const tickets = useTicketStore.getState().tickets;
        const counters = useTicketStore.getState().counters;
        const records = useRecordsStore.getState().getByDoctor(doctor.id);

        const myCounter = counters.find((c) => c.doctorId === doctor.id);
        const myQueue = myCounter
          ? tickets.filter(
              (t) => t.status === 'waiting' && t.department === myCounter.department
            )
          : [];
        const active = tickets.find(
          (t) =>
            t.doctorId === doctor.id &&
            (t.status === 'called' || t.status === 'in_consultation')
        );
        const completedToday = tickets.filter(
          (t) =>
            t.doctorId === doctor.id &&
            t.status === 'completed' &&
            t.completedAt &&
            Date.now() - t.completedAt < 24 * 60 * 60 * 1000
        ).length;

        const kpis = [
          {
            label: 'In my queue',
            value: myQueue.length,
            icon: ClipboardList,
            color: 'bg-amber-100 text-amber-700'
          },
          {
            label: 'Currently attending',
            value: active ? 1 : 0,
            icon: Activity,
            color: 'bg-emerald-100 text-emerald-700'
          },
          {
            label: 'Seen today',
            value: completedToday,
            icon: CheckCircle2,
            color: 'bg-primary-100 text-primary-700'
          },
          {
            label: 'My medical records',
            value: records.length,
            icon: FileText,
            color: 'bg-violet-100 text-violet-700'
          }
        ];

        return (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                  Welcome back
                </p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {doctor.title ?? 'Dr.'} {doctor.firstName} {doctor.lastName}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {doctor.position} · {doctor.department}
                </p>
              </div>
              {myCounter ? (
                <Link
                  href="/doctor/queue"
                  className="rounded-xl bg-gradient-to-br from-primary-500 to-navy-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02]"
                >
                  Go to Counter #{myCounter.counter} →
                </Link>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                  No counter assigned yet. Ask administration to assign you a counter.
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((k) => (
                <motion.div
                  key={k.label}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
                >
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${k.color}`}
                  >
                    <k.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-600">{k.label}</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{k.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Profile card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-1"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={doctor.photoURL}
                    alt={doctor.firstName}
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] rounded-full object-cover ring-4 ring-primary-100"
                    unoptimized
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      My profile
                    </p>
                    <p className="mt-0.5 text-base font-bold text-slate-900">
                      {doctor.title ?? 'Dr.'} {doctor.lastName}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {doctor.qualification.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-900">
                      {doctor.averageRating.toFixed(2)}
                    </span>
                    <span className="text-slate-500">· {doctor.totalReviews} reviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Languages className="h-4 w-4 text-slate-400" />
                    {doctor.languages.join(', ')}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {doctor.workingHours.start} – {doctor.workingHours.end}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="h-4 w-4 text-slate-400" />
                    {doctor.totalPatientsSeen.toLocaleString()} patients seen
                  </div>
                </div>
                <Link
                  href="/doctor/profile"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-200 bg-white py-2 text-sm font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600"
                >
                  Update profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              {/* My queue preview */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-2"
              >
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">My queue preview</h2>
                    <p className="text-xs text-slate-500">
                      Patients waiting in {myCounter?.department ?? 'your department'}
                    </p>
                  </div>
                  <Link
                    href="/doctor/queue"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Open queue <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                {myQueue.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-sm text-slate-500">No patients waiting. 👌</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {myQueue.slice(0, 5).map((t, i) => (
                      <div key={t.id} className="flex items-center gap-4 p-4">
                        <div className="w-14 text-center">
                          <p className="font-mono text-base font-black text-slate-900">
                            {t.number}
                          </p>
                          <p className="text-[10px] font-semibold uppercase text-slate-500">
                            #{i + 1}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900">{t.patientName}</p>
                          <p className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            Arrived{' '}
                            {new Date(t.arrivedAt).toLocaleTimeString('en-NG', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {t.priority === 2 && <Badge variant="danger">Emergency</Badge>}
                        {t.priority === 1 && <Badge variant="warning">Priority</Badge>}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        );
      }}
    </DoctorShell>
  );
}
