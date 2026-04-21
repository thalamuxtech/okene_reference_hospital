'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Specialty } from '@/lib/seed-data';
import { cn } from '@/lib/utils';

export function SpecialtyCard({ specialty, href }: { specialty: Specialty; href?: string }) {
  return (
    <Link href={href ?? `/book?specialty=${specialty.id}`} className="group block">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className={cn(
          'relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs transition-all hover:border-primary-200 hover:shadow-md',
          'sm:p-6'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 -z-0 bg-gradient-to-br opacity-60 transition-opacity group-hover:opacity-100',
            specialty.gradient
          )}
        />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm ring-1 ring-slate-200/70">
              <span>{specialty.icon}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">{specialty.name}</h3>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">{specialty.description}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
        </div>
      </motion.div>
    </Link>
  );
}
