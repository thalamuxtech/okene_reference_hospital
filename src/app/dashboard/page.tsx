'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  Activity,
  FileText,
  Bell,
  Heart,
  TrendingUp,
  Pill,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { DOCTORS } from '@/lib/seed-data';
import { Badge } from '@/components/ui/badge';
import { Stagger, StaggerItem } from '@/components/motion/stagger';

export default function DashboardPage() {
  const upcoming = [
    {
      doctor: DOCTORS[1],
      date: 'Today',
      time: '10:30 AM',
      type: 'In-person',
      status: 'confirmed'
    },
    {
      doctor: DOCTORS[0],
      date: 'Tue, 29 Apr',
      time: '2:00 PM',
      type: 'Telehealth',
      status: 'scheduled'
    }
  ];

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 -z-10 h-[240px] gradient-hero" />

      <div className="container pt-10 lg:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
              Good afternoon
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
              Welcome back, <span className="text-gradient">Ibrahim</span>
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Here’s what’s happening with your care today.
            </p>
          </div>
          <Link href="/book" className="btn-primary">
            <Calendar className="h-4 w-4" />
            Book new appointment
          </Link>
        </motion.div>

        {/* Quick stats */}
        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Calendar, label: 'Upcoming', value: '2', color: 'bg-primary-50 text-primary-700' },
            { icon: Activity, label: 'Visits this year', value: '7', color: 'bg-violet-50 text-violet-700' },
            { icon: Pill, label: 'Active prescriptions', value: '3', color: 'bg-emerald-50 text-emerald-700' },
            { icon: Bell, label: 'Unread alerts', value: '2', color: 'bg-amber-50 text-amber-700' }
          ].map((s) => (
            <StaggerItem key={s.label}>
              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs"
              >
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                <p className="mt-0.5 text-sm text-slate-600">{s.label}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Upcoming appointments */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Upcoming appointments</h2>
              <Link href="/dashboard/appointments" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {upcoming.map((u, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs transition-all hover:shadow-md"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary-500 to-navy-500" />

                  <div className="flex items-start gap-4">
                    <Image
                      src={u.doctor.photoURL}
                      alt={u.doctor.firstName}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          Dr. {u.doctor.firstName} {u.doctor.lastName}
                        </h3>
                        <Badge variant={u.status === 'confirmed' ? 'success' : 'info'}>
                          {u.status === 'confirmed' && <CheckCircle2 className="h-3 w-3" />}
                          {u.status}
                        </Badge>
                        <Badge variant={u.type === 'Telehealth' ? 'purple' : 'teal'}>
                          {u.type === 'Telehealth' && <Video className="h-3 w-3" />}
                          {u.type}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-primary-600">{u.doctor.specialization[0]}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="h-4 w-4" /> {u.date}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="h-4 w-4" /> {u.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {u.type === 'Telehealth' ? (
                        <Link href="/telehealth/demo" className="btn-primary h-9 px-3 text-xs">
                          <Video className="h-4 w-4" /> Join
                        </Link>
                      ) : (
                        <Link href="#" className="btn-outline h-9 px-3 text-xs">
                          Details
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Sidebar cards */}
          <div className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-red-500 to-red-700 p-6 text-white shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                  <Heart className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold">Emergency access</p>
              </div>
              <p className="mt-4 text-2xl font-bold">112</p>
              <p className="text-xs text-red-100">24/7 hotline with GPS assist</p>
              <a
                href="tel:112"
                className="mt-5 block rounded-lg bg-white py-2.5 text-center text-sm font-bold text-red-600 transition-transform hover:scale-[1.02]"
              >
                Call now
              </a>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Health trends</h3>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Blood pressure', value: '120/80', trend: 'stable', color: 'text-emerald-600' },
                  { label: 'Pulse', value: '72 bpm', trend: 'normal', color: 'text-emerald-600' },
                  { label: 'Weight', value: '72 kg', trend: '-1.2%', color: 'text-emerald-600' }
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">{m.label}</p>
                      <p className="text-lg font-bold text-slate-900">{m.value}</p>
                    </div>
                    <span className={`text-xs font-semibold ${m.color}`}>{m.trend}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs"
            >
              <h3 className="mb-4 text-sm font-bold text-slate-900">Quick actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: '/triage', icon: Activity, label: 'AI Triage' },
                  { href: '/telehealth', icon: Video, label: 'Telehealth' },
                  { href: '/dashboard/records', icon: FileText, label: 'Records' },
                  { href: '/dashboard/prescriptions', icon: Pill, label: 'Rx' }
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-center transition-all hover:border-primary-500 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <a.icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700 group-hover:text-primary-600">
                      {a.label}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        {/* Recent activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent activity</h2>
            <Link href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              View all →
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white">
            {[
              { icon: FileText, text: 'Lab results available — Full Blood Count', time: '2 hours ago', color: 'bg-blue-50 text-blue-700' },
              { icon: Bell, text: 'Reminder: Appointment tomorrow at 10:30 AM', time: 'Yesterday', color: 'bg-amber-50 text-amber-700' },
              { icon: Pill, text: 'Prescription refill approved by Dr. Hassan', time: '3 days ago', color: 'bg-emerald-50 text-emerald-700' },
              { icon: CheckCircle2, text: 'Payment received for Dr. Musa consultation', time: '1 week ago', color: 'bg-violet-50 text-violet-700' }
            ].map((a, i, arr) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 ${
                  i < arr.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.color}`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <p className="flex-1 text-sm text-slate-700">{a.text}</p>
                <span className="flex-shrink-0 text-xs text-slate-400">{a.time}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
