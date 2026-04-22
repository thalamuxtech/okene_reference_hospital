'use client';

import { notFound, useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Star,
  Languages,
  GraduationCap,
  Users,
  Video,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { DOCTORS, generateTimeSlots } from '@/lib/seed-data';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DoctorProfileClient() {
  const { id } = useParams<{ id: string }>();
  const doctor = DOCTORS.find((d) => d.id === id);
  const [tab, setTab] = useState<'about' | 'availability' | 'reviews'>('about');

  if (!doctor) return notFound();

  const slots = useMemo(
    () => generateTimeSlots(doctor.workingHours.start, doctor.workingHours.end).slice(0, 8),
    [doctor]
  );

  return (
    <div className="relative">
      {/* Hero band */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-brand" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative py-14 lg:py-20">
          <Link
            href="/doctors"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            ← Back to doctors
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center"
          >
            <div className="relative mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-full bg-white/30 p-1 shadow-xl">
                <div className="h-full w-full rounded-full bg-white" />
              </div>
              <Image
                src={doctor.photoURL}
                alt={`${doctor.firstName} ${doctor.lastName}`}
                width={144}
                height={144}
                className="relative h-36 w-36 rounded-full object-cover ring-4 ring-white/20"
              />
            </div>

            <div className="text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <Badge variant="teal" className="bg-white/15 text-white">
                  {doctor.specialization.join(' · ')}
                </Badge>
                {doctor.telehealthAvailable && (
                  <Badge variant="purple" className="bg-white/15 text-white">
                    <Video className="h-3 w-3" /> Telehealth
                  </Badge>
                )}
                {doctor.isAcceptingPatients && (
                  <Badge variant="success" className="bg-white/15 text-white">
                    <CheckCircle2 className="h-3 w-3" /> Accepting patients
                  </Badge>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
                {doctor.title ?? 'Dr.'} {doctor.firstName} {doctor.lastName}
              </h1>
              <p className="mt-2 text-base text-primary-100 lg:text-lg">
                {doctor.qualification.join(', ')} · {doctor.position} · {doctor.department}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm text-white/90 lg:justify-start">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{doctor.averageRating.toFixed(2)}</span>
                  <span className="opacity-80">({doctor.totalReviews} reviews)</span>
                </div>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  {doctor.yearsOfExperience} years experience
                </div>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {doctor.totalPatientsSeen.toLocaleString()}+ patients
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container -mt-10 pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm">
              <div className="flex gap-1 border-b border-slate-200/70 p-2">
                {(['about', 'availability', 'reviews'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition-colors ${
                      tab === t ? 'text-primary-600' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab === t && (
                      <motion.span
                        layoutId="doctor-tab"
                        className="absolute inset-0 rounded-lg bg-primary-50"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{t}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 lg:p-8">
                {tab === 'about' && <AboutTab doctor={doctor} />}
                {tab === 'availability' && <AvailabilityTab doctor={doctor} slots={slots} />}
                {tab === 'reviews' && <ReviewsTab doctor={doctor} />}
              </div>
            </div>
          </div>

          {/* Sticky booking card */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-lg">
              <div className="bg-gradient-to-br from-primary-50 to-white p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                  Consultation
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {formatCurrency(doctor.consultationFee)}
                </p>
                {doctor.telehealthAvailable && (
                  <p className="mt-1 text-sm text-slate-600">
                    Telehealth: {formatCurrency(doctor.telehealthFee)}
                  </p>
                )}
              </div>
              <div className="space-y-3 p-6">
                <Link href={`/book?doctor=${doctor.id}`} className="block">
                  <Button className="w-full" size="lg">
                    <Calendar className="h-5 w-5" />
                    Book Appointment
                  </Button>
                </Link>
                {doctor.telehealthAvailable && (
                  <Link href={`/book?doctor=${doctor.id}&type=telehealth`} className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      <Video className="h-5 w-5" />
                      Video Consultation
                    </Button>
                  </Link>
                )}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    Okene Reference Hospital
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Languages className="h-4 w-4 text-slate-400" />
                    {doctor.languages.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function AboutTab({ doctor }: { doctor: (typeof DOCTORS)[number] }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Biography</h2>
        <p className="mt-3 leading-relaxed text-slate-700">{doctor.bio}</p>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900">
          <Award className="h-4 w-4 text-primary-600" /> Credentials
        </h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {doctor.qualification.map((q) => (
            <div
              key={q}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
            >
              <CheckCircle2 className="h-4 w-4 text-primary-600" />
              {q}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900">
          <BookOpen className="h-4 w-4 text-primary-600" /> Working hours
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {doctor.workingDays.map((d) => (
            <Badge key={d} variant="teal">
              {d}
            </Badge>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600">
          {doctor.workingHours.start} — {doctor.workingHours.end}
        </p>
      </div>
    </div>
  );
}

function AvailabilityTab({
  doctor,
  slots
}: {
  doctor: (typeof DOCTORS)[number];
  slots: { time: string; available: boolean }[];
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Next available slots</h2>
      <p className="mt-1 text-sm text-slate-600">
        Showing the next few openings — select one to continue booking.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {slots.map((s, i) => (
          <Link
            key={i}
            href={`/book?doctor=${doctor.id}&time=${s.time}`}
            aria-disabled={!s.available}
            className={`rounded-lg border-2 p-3 text-center text-sm font-semibold transition-all ${
              s.available
                ? 'border-slate-200 text-slate-700 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700'
                : 'pointer-events-none border-slate-100 bg-slate-50 text-slate-400 line-through'
            }`}
          >
            {s.time}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ReviewsTab({ doctor }: { doctor: (typeof DOCTORS)[number] }) {
  const sample = [
    {
      name: 'Hauwa A.',
      rating: 5,
      date: '2 weeks ago',
      text: 'Excellent doctor — explained everything clearly and was very patient with my mother.'
    },
    {
      name: 'Samuel O.',
      rating: 5,
      date: '1 month ago',
      text: 'The best consultation I have ever had. The telehealth experience was seamless.'
    },
    {
      name: 'Chiamaka K.',
      rating: 4,
      date: '1 month ago',
      text: 'Very professional. A small wait but well worth it for the quality of care.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 rounded-xl bg-slate-50 p-5">
        <div className="text-center">
          <p className="text-4xl font-bold text-slate-900">{doctor.averageRating.toFixed(2)}</p>
          <div className="mt-1 flex justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(doctor.averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">{doctor.totalReviews} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3">{stars}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${stars === 5 ? 78 : stars === 4 ? 15 : stars === 3 ? 5 : 1}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {sample.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                <p className="text-xs text-slate-500">{r.date}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-700">{r.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
