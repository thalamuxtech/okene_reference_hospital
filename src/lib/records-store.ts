'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type VisitRecord = {
  id: string;
  patientName: string;
  patientPhone?: string;
  date: number;
  doctorId: string;
  doctorName: string;
  department: string;
  chiefComplaint: string;
  diagnosis: string;
  treatmentPlan: string;
  prescription: string;
  vitals: { bp?: string; pulse?: string; temp?: string; weight?: string };
  followUpDate?: string;
  notes?: string;
};

type State = {
  records: VisitRecord[];
  addRecord: (record: Omit<VisitRecord, 'id'>) => VisitRecord;
  updateRecord: (id: string, patch: Partial<VisitRecord>) => void;
  getByPatient: (patientName: string) => VisitRecord[];
  getByDoctor: (doctorId: string) => VisitRecord[];
};

const seed: VisitRecord[] = [
  {
    id: 'rec-1',
    patientName: 'Ozavize Adaviruku',
    patientPhone: '+234 803 221 9901',
    date: Date.now() - 14 * 86400_000,
    doctorId: 'dr-zainab-ozigi',
    doctorName: 'Dr. Zainab Ozigi',
    department: 'General Medicine',
    chiefComplaint: 'Persistent cough and mild fever x 3 days',
    diagnosis: 'Acute bronchitis',
    treatmentPlan: 'Supportive care, hydration, rest',
    prescription:
      'Amoxicillin 500mg TDS x 7d; Paracetamol 1g PRN; Bromhexine syrup 10ml TDS x 5d',
    vitals: { bp: '128/82', pulse: '86', temp: '37.9', weight: '62 kg' },
    followUpDate: '2026-05-07',
    notes: 'Patient advised to return if symptoms persist beyond 7 days.'
  },
  {
    id: 'rec-2',
    patientName: 'Yakubu Ozigi',
    patientPhone: '+234 810 110 4420',
    date: Date.now() - 30 * 86400_000,
    doctorId: 'dr-omeiza-nuhu',
    doctorName: 'Dr. Omeiza Nuhu',
    department: 'Cardiology',
    chiefComplaint: 'Follow-up hypertension review',
    diagnosis: 'Essential hypertension, well controlled',
    treatmentPlan: 'Continue current medications; low-salt diet counselled',
    prescription: 'Amlodipine 10mg OD; Losartan 50mg OD; Aspirin 75mg OD',
    vitals: { bp: '132/84', pulse: '72', weight: '78 kg' },
    followUpDate: '2026-06-05'
  },
  {
    id: 'rec-3',
    patientName: 'Halima Adavi',
    patientPhone: '+234 903 771 5508',
    date: Date.now() - 7 * 86400_000,
    doctorId: 'dr-ohiare-ozavize',
    doctorName: 'Dr. Ozavize Ohiare',
    department: 'Pediatrics',
    chiefComplaint: 'Immunisation · 9-month vaccines',
    diagnosis: 'Healthy child, EPI up to date',
    treatmentPlan: 'Measles and Yellow Fever vaccines administered; Vit A',
    prescription: 'None',
    vitals: { temp: '36.6', weight: '8.4 kg' }
  }
];

export const useRecordsStore = create<State>()(
  persist(
    (set, get) => ({
      records: seed,

      addRecord: (record) => {
        const withId: VisitRecord = {
          ...record,
          id: 'rec-' + Math.random().toString(36).slice(2, 9)
        };
        set((s) => ({ records: [withId, ...s.records] }));
        return withId;
      },

      updateRecord: (id, patch) =>
        set((s) => ({ records: s.records.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),

      getByPatient: (patientName) =>
        get().records.filter((r) => r.patientName.toLowerCase() === patientName.toLowerCase()),

      getByDoctor: (doctorId) => get().records.filter((r) => r.doctorId === doctorId)
    }),
    {
      name: 'orh-records',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? ({} as Storage) : window.localStorage
      )
    }
  )
);
