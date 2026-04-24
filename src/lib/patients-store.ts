'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { publish } from './broadcast';

export type PatientStatus = 'active' | 'inactive';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email?: string;
  dob?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string;
  chronicConditions?: string;
  notes?: string;
  lastVisit?: string;
  visits: number;
  status: PatientStatus;
  registeredAt: number;
  /**
   * Optional pregnancy record for OBGYN patients (Phase 3).
   */
  pregnancy?: PregnancyRecord;
};

export type AntenatalVisit = {
  id: string;
  date: string;
  gestationWeeks?: number;
  bp?: string;
  weight?: string;
  fundalHeight?: string;
  fetalHeartRate?: string;
  urineProtein?: string;
  notes?: string;
};

export type ScanRecord = {
  id: string;
  date: string;
  type: 'dating' | 'anomaly' | 'growth' | 'doppler' | 'other';
  findings: string;
  performedBy?: string;
};

export type NeonateGrowthPoint = {
  id: string;
  date: string;
  ageWeeks: number;
  weightKg: number;
  heightCm?: number;
  headCircumferenceCm?: number;
  notes?: string;
};

export type PregnancyRecord = {
  isPregnant: boolean;
  lmp?: string; // last menstrual period (ISO date)
  edd?: string; // estimated due date (ISO)
  gravida?: number;
  para?: number;
  bloodPressureBaseline?: string;
  antenatalVisits: AntenatalVisit[];
  scans: ScanRecord[];
  /**
   * Growth records for the neonate once born. Each entry snapshots one
   * well-baby visit.
   */
  neonateGrowth: NeonateGrowthPoint[];
  deliveredOn?: string;
  deliveryNotes?: string;
};

type State = {
  patients: Patient[];

  add: (p: Omit<Patient, 'id' | 'fullName' | 'registeredAt' | 'visits'> & {
    visits?: number;
  }) => Patient;
  update: (id: string, patch: Partial<Patient>) => void;
  remove: (id: string) => void;
  findById: (id: string) => Patient | undefined;
  findByPhone: (phone: string) => Patient | undefined;
  incrementVisits: (id: string) => void;
  setPregnancy: (id: string, record: PregnancyRecord) => void;
  addAntenatalVisit: (id: string, visit: Omit<AntenatalVisit, 'id'>) => void;
  addScan: (id: string, scan: Omit<ScanRecord, 'id'>) => void;
  addNeonatePoint: (id: string, point: Omit<NeonateGrowthPoint, 'id'>) => void;
  resetToSeed: () => void;
};

const SEED_NAMES = [
  'Ozavize Adaviruku',
  'Onyeche Idakwoji',
  'Ohunene Oseni',
  'Halima Abdul',
  'Eneojo Okoliko',
  'Aisha Suleman',
  'Yakubu Ozigi',
  'Sekinat Inusa',
  'Michael Ajala',
  'Zeinab Aboki',
  'Omeiza Yahaya',
  'Hauwa Aliyu'
];

const BLOODS: BloodGroup[] = ['A+', 'O+', 'B+', 'AB+', 'O-'];

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

function nextPatientId(existing: Patient[]): string {
  const year = new Date().getFullYear();
  const seq =
    existing
      .map((p) => Number(p.id.split('-').pop()) || 0)
      .reduce((m, n) => Math.max(m, n), 10000) + 1;
  return `ORH-${year}-${seq}`;
}

function seed(): Patient[] {
  return Array.from({ length: 24 }).map((_, i) => {
    const full = SEED_NAMES[i % SEED_NAMES.length];
    const [firstName, ...rest] = full.split(' ');
    const lastName = rest.join(' ');
    return {
      id: `ORH-2026-${10000 + i}`,
      firstName,
      lastName,
      fullName: full,
      phone: '+234 803 000 00' + String(i).padStart(2, '0'),
      age: 20 + (i % 50),
      gender: i % 2 === 0 ? 'Male' : 'Female',
      bloodGroup: BLOODS[i % BLOODS.length],
      lastVisit: `${(i % 28) + 1} Apr 2026`,
      visits: (i % 12) + 1,
      status: i % 7 === 0 ? 'inactive' : 'active',
      registeredAt: Date.now() - i * 86400000
    } as Patient;
  });
}

const CHANNEL = 'orh-patients';

export const usePatientsStore = create<State>()(
  persist(
    (set, get) => ({
      patients: seed(),

      add: (p) => {
        const id = nextPatientId(get().patients);
        const fullName = `${p.firstName} ${p.lastName}`.trim();
        const record: Patient = {
          ...p,
          id,
          fullName,
          visits: p.visits ?? 0,
          registeredAt: Date.now()
        };
        set((s) => ({ patients: [record, ...s.patients] }));
        publish(CHANNEL, 'add', { id });
        return record;
      },

      update: (id, patch) => {
        set((s) => ({
          patients: s.patients.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...patch,
                  fullName:
                    (patch.firstName ?? p.firstName) +
                    ' ' +
                    (patch.lastName ?? p.lastName)
                }
              : p
          )
        }));
        publish(CHANNEL, 'update', { id });
      },

      remove: (id) => {
        set((s) => ({ patients: s.patients.filter((p) => p.id !== id) }));
        publish(CHANNEL, 'remove', { id });
      },

      findById: (id) => get().patients.find((p) => p.id === id),
      findByPhone: (phone) => {
        const norm = phone.replace(/\D/g, '');
        return get().patients.find((p) => p.phone.replace(/\D/g, '') === norm);
      },

      incrementVisits: (id) => {
        const today = new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        set((s) => ({
          patients: s.patients.map((p) =>
            p.id === id ? { ...p, visits: p.visits + 1, lastVisit: today } : p
          )
        }));
        publish(CHANNEL, 'visit', { id });
      },

      setPregnancy: (id, record) => {
        set((s) => ({
          patients: s.patients.map((p) =>
            p.id === id ? { ...p, pregnancy: record } : p
          )
        }));
        publish(CHANNEL, 'pregnancy-set', { id });
      },

      addAntenatalVisit: (id, visit) => {
        set((s) => ({
          patients: s.patients.map((p) => {
            if (p.id !== id) return p;
            const pr: PregnancyRecord = p.pregnancy ?? {
              isPregnant: true,
              antenatalVisits: [],
              scans: [],
              neonateGrowth: []
            };
            return {
              ...p,
              pregnancy: {
                ...pr,
                antenatalVisits: [
                  ...pr.antenatalVisits,
                  { id: uid('ANC'), ...visit }
                ]
              }
            };
          })
        }));
        publish(CHANNEL, 'antenatal-add', { id });
      },

      addScan: (id, scan) => {
        set((s) => ({
          patients: s.patients.map((p) => {
            if (p.id !== id) return p;
            const pr: PregnancyRecord = p.pregnancy ?? {
              isPregnant: true,
              antenatalVisits: [],
              scans: [],
              neonateGrowth: []
            };
            return {
              ...p,
              pregnancy: {
                ...pr,
                scans: [...pr.scans, { id: uid('SCAN'), ...scan }]
              }
            };
          })
        }));
        publish(CHANNEL, 'scan-add', { id });
      },

      addNeonatePoint: (id, point) => {
        set((s) => ({
          patients: s.patients.map((p) => {
            if (p.id !== id) return p;
            const pr: PregnancyRecord = p.pregnancy ?? {
              isPregnant: false,
              antenatalVisits: [],
              scans: [],
              neonateGrowth: []
            };
            return {
              ...p,
              pregnancy: {
                ...pr,
                neonateGrowth: [
                  ...pr.neonateGrowth,
                  { id: uid('NG'), ...point }
                ]
              }
            };
          })
        }));
        publish(CHANNEL, 'neonate-add', { id });
      },

      resetToSeed: () => {
        set({ patients: seed() });
        publish(CHANNEL, 'reset');
      }
    }),
    {
      name: CHANNEL,
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? ({} as Storage) : window.localStorage
      )
    }
  )
);

export const PATIENTS_CHANNEL = CHANNEL;
