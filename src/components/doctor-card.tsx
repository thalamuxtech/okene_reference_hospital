'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Languages, GraduationCap, Video } from 'lucide-react';
import type { Doctor } from '@/lib/seed-data';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-xs transition-shadow hover:shadow-lg"
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-primary-50 via-white to-navy-50" />

      <div className="relative p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-navy-500 p-[2px]">
              <div className="h-full w-full rounded-full bg-white" />
            </div>
            <Image
              src={doctor.photoURL}
              alt={`${doctor.firstName} ${doctor.lastName}`}
              width={72}
              height={72}
              className="relative h-[72px] w-[72px] rounded-full object-cover"
            />
            {doctor.telehealthAvailable && (
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white ring-2 ring-white">
                <Video className="h-3 w-3" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900">
              {doctor.title ?? 'Dr.'} {doctor.firstName} {doctor.lastName}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-primary-600">
              {doctor.qualification.join(', ')}
            </p>
            <p className="mt-0.5 text-sm text-slate-600">{doctor.specialization.join(' · ')}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-900">{doctor.averageRating.toFixed(2)}</span>
            <span className="text-slate-500">({doctor.totalReviews})</span>
          </div>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1 text-slate-600">
            <GraduationCap className="h-4 w-4" />
            <span>{doctor.yearsOfExperience}y</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {doctor.languages.slice(0, 3).map((l) => (
            <Badge key={l} variant="teal" className="gap-1">
              <Languages className="h-3 w-3" />
              {l}
            </Badge>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Consultation</p>
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(doctor.consultationFee)}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/doctors/profile?id=${encodeURIComponent(doctor.id)}`}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-primary-500 hover:text-primary-600"
            >
              Profile
            </Link>
            <Link
              href={`/book?doctor=${doctor.id}`}
              className="rounded-lg bg-primary-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
