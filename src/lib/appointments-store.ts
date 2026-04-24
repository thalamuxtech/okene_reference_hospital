'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { publish } from './broadcast';

export type AppointmentStatus =
  | 'scheduled'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AppointmentType = 'in-person' | 'telehealth' | 'follow_up';

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string; // ISO YYYY-MM-DD
  time: string; // HH:MM
  type: AppointmentType;
  reason?: string;
  symptoms?: string;
  fee: number;
  status: AppointmentStatus;
  createdAt: number;
  createdBy: 'patient' | 'admin' | 'doctor' | 'system';
};

type State = {
  appointments: Appointment[];
  add: (a: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  update: (id: string, patch: Partial<Appointment>) => void;
  setStatus: (id: string, status: AppointmentStatus) => void;
  remove: (id: string) => void;
  findByPatient: (patientId: string) => Appointment[];
  findByDoctor: (doctorId: string) => Appointment[];
  resetToSeed: () => void;
};

function nextId(existing: Appointment[]): string {
  const year = new Date().getFullYear();
  const seq =
    existing
      .map((a) => Number(a.id.split('-').pop()) || 0)
      .reduce((m, n) => Math.max(m, n), 10000) + 1;
  return `APT-${year}-${seq}`;
}

function seed(): Appointment[] {
  const base = Date.now();
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `APT-2026-${10000 + i}`,
    patientId: `ORH-2026-${10000 + i}`,
    patientName: [
      'Ozavize Adaviruku',
      'Halima Abdul',
      'Yakubu Ozigi',
      'Zeinab Aboki',
      'Michael Ajala',
      'Aisha Suleman'
    ][i],
    patientPhone: '+234 803 000 00' + String(i).padStart(2, '0'),
    doctorId: 'dr-omeiza-nuhu',
    doctorName: 'Dr. Omeiza Nuhu',
    specialty: 'Cardiology',
    date: new Date().toISOString().slice(0, 10),
    time: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00'][i],
    type: 'in-person' as AppointmentType,
    fee: 18000,
    status: (['scheduled', 'checked_in', 'completed', 'scheduled', 'in_progress', 'completed'] as AppointmentStatus[])[i],
    createdAt: base - i * 3_600_000,
    createdBy: 'patient' as const
  }));
}

const CHANNEL = 'orh-appointments';

export const useAppointmentsStore = create<State>()(
  persist(
    (set, get) => ({
      appointments: seed(),

      add: (a) => {
        const id = nextId(get().appointments);
        const record: Appointment = { ...a, id, createdAt: Date.now() };
        set((s) => ({ appointments: [record, ...s.appointments] }));
        publish(CHANNEL, 'add', { id });
        return record;
      },

      update: (id, patch) => {
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, ...patch } : a
          )
        }));
        publish(CHANNEL, 'update', { id });
      },

      setStatus: (id, status) => {
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status } : a
          )
        }));
        publish(CHANNEL, 'status', { id, status });
      },

      remove: (id) => {
        set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) }));
        publish(CHANNEL, 'remove', { id });
      },

      findByPatient: (patientId) =>
        get().appointments.filter((a) => a.patientId === patientId),

      findByDoctor: (doctorId) =>
        get().appointments.filter((a) => a.doctorId === doctorId),

      resetToSeed: () => {
        set({ appointments: seed() });
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

export const APPOINTMENTS_CHANNEL = CHANNEL;
