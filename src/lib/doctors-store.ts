'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DOCTORS as SEED_DOCTORS, type Doctor } from '@/lib/seed-data';

type State = {
  doctors: Doctor[];
  add: (d: Omit<Doctor, 'id' | 'doctorId' | 'averageRating' | 'totalReviews' | 'totalPatientsSeen'>) => Doctor;
  update: (id: string, patch: Partial<Doctor>) => void;
  remove: (id: string) => void;
  resetToSeed: () => void;
};

function slug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const useDoctorsStore = create<State>()(
  persist(
    (set, get) => ({
      doctors: SEED_DOCTORS,

      add: (d) => {
        const id = 'dr-' + slug(`${d.firstName}-${d.lastName}`) + '-' + Math.random().toString(36).slice(2, 5);
        const nextSeq = get().doctors.length + 100;
        const doctor: Doctor = {
          ...d,
          id,
          doctorId: 'DR-' + String(nextSeq).padStart(5, '0'),
          averageRating: 4.8,
          totalReviews: 0,
          totalPatientsSeen: 0
        };
        set((s) => ({ doctors: [doctor, ...s.doctors] }));
        return doctor;
      },

      update: (id, patch) =>
        set((s) => ({
          doctors: s.doctors.map((d) => (d.id === id ? { ...d, ...patch } : d))
        })),

      remove: (id) => set((s) => ({ doctors: s.doctors.filter((d) => d.id !== id) })),

      resetToSeed: () => set({ doctors: SEED_DOCTORS })
    }),
    {
      name: 'orh-doctors',
      // Bump when the seed data changes in a way existing cached copies
      // must be replaced (e.g. 2026-04-24: Salihu -> Solomon rename).
      version: 2,
      migrate: () => ({ doctors: SEED_DOCTORS }) as any,
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? ({} as Storage) : window.localStorage
      )
    }
  )
);
