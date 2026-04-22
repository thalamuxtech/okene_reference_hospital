'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TicketStatus =
  | 'waiting'
  | 'called'
  | 'in_consultation'
  | 'completed'
  | 'skipped'
  | 'cancelled';

export type Ticket = {
  id: string;
  number: string; // e.g. A-127
  department: string; // Cardiology, Pediatrics …
  deptCode: string; // A, B, C …
  patientName: string;
  phone?: string;
  priority: 0 | 1 | 2; // 0 normal · 1 priority · 2 emergency
  status: TicketStatus;
  counter?: number; // assigned counter number (1..N)
  doctorId?: string;
  doctorName?: string;
  arrivedAt: number; // epoch ms
  calledAt?: number;
  consultStartAt?: number;
  completedAt?: number;
  calledExpiresAt?: number; // for the 2-min "please come to counter" countdown
  estimatedWaitMin?: number;
};

export type CounterStatus = {
  counter: number; // 1..N
  department: string;
  doctorId: string | null;
  doctorName: string | null;
  available: boolean; // doctor available & free
  currentTicketId: string | null;
};

type State = {
  tickets: Ticket[];
  counters: CounterStatus[];
  seqByDept: Record<string, number>;

  addTicket: (
    input: Pick<Ticket, 'department' | 'deptCode' | 'patientName' | 'priority'> & {
      phone?: string;
    }
  ) => Ticket;
  callNext: (counter: number) => Ticket | null;
  startConsultation: (ticketId: string) => void;
  completeConsultation: (counter: number) => void;
  skipTicket: (ticketId: string) => void;
  setCounterAvailability: (counter: number, available: boolean) => void;
  assignDoctorToCounter: (
    counter: number,
    doctorId: string | null,
    doctorName: string | null,
    department?: string
  ) => void;
  resetAll: () => void;
};

const initialCounters: CounterStatus[] = [
  { counter: 1, department: 'General Medicine', doctorId: 'dr-zainab-ozigi', doctorName: 'Dr. Zainab Ozigi', available: true, currentTicketId: null },
  { counter: 2, department: 'Cardiology', doctorId: 'dr-omeiza-nuhu', doctorName: 'Dr. Omeiza Nuhu', available: true, currentTicketId: null },
  { counter: 3, department: 'Pediatrics', doctorId: 'dr-ohiare-ozavize', doctorName: 'Dr. Ozavize Ohiare', available: true, currentTicketId: null },
  { counter: 4, department: 'Obstetrics & Gynaecology', doctorId: 'prof-avidime-salihu', doctorName: 'Prof. Salihu Avidime', available: true, currentTicketId: null },
  { counter: 5, department: 'Orthopedics', doctorId: 'dr-abdulrahman-attah', doctorName: 'Dr. Abdulrahman Attah', available: false, currentTicketId: null },
  { counter: 6, department: 'Ophthalmology', doctorId: 'dr-ibrahim-onimisi', doctorName: 'Dr. Ibrahim Onimisi', available: true, currentTicketId: null }
];

const seedTickets = (): Ticket[] => {
  const now = Date.now();
  const make = (n: number, p: Partial<Ticket>): Ticket => ({
    id: 'T' + n,
    number: `${p.deptCode}-${String(120 + n).padStart(3, '0')}`,
    department: p.department ?? 'General Medicine',
    deptCode: p.deptCode ?? 'G',
    patientName: p.patientName ?? 'Patient',
    priority: p.priority ?? 0,
    status: p.status ?? 'waiting',
    arrivedAt: now - (10 - n) * 60_000,
    counter: p.counter,
    doctorId: p.doctorId,
    doctorName: p.doctorName,
    calledAt: p.calledAt,
    estimatedWaitMin: p.estimatedWaitMin,
    phone: p.phone
  } as Ticket);

  return [
    make(1, { department: 'General Medicine', deptCode: 'G', patientName: 'Ozavize Adaviruku', status: 'in_consultation', counter: 1, doctorId: 'dr-zainab-ozigi', doctorName: 'Dr. Zainab Ozigi' }),
    make(2, { department: 'Cardiology', deptCode: 'A', patientName: 'Yakubu Ozigi', status: 'in_consultation', counter: 2, doctorId: 'dr-omeiza-nuhu', doctorName: 'Dr. Omeiza Nuhu' }),
    make(3, { department: 'Pediatrics', deptCode: 'B', patientName: 'Halima Adavi', status: 'in_consultation', counter: 3, doctorId: 'dr-ohiare-ozavize', doctorName: 'Dr. Ozavize Ohiare' }),
    make(4, { department: 'General Medicine', deptCode: 'G', patientName: 'Ohunene Oseni', priority: 0, status: 'waiting', estimatedWaitMin: 6 }),
    make(5, { department: 'General Medicine', deptCode: 'G', patientName: 'Aisha Suleman', priority: 1, status: 'waiting', estimatedWaitMin: 14 }),
    make(6, { department: 'Cardiology', deptCode: 'A', patientName: 'Onyeche Idakwoji', priority: 0, status: 'waiting', estimatedWaitMin: 18 }),
    make(7, { department: 'Pediatrics', deptCode: 'B', patientName: 'Eneojo Okoliko', priority: 0, status: 'waiting', estimatedWaitMin: 10 }),
    make(8, { department: 'Obstetrics & Gynaecology', deptCode: 'O', patientName: 'Zeinab Aboki', priority: 2, status: 'waiting', estimatedWaitMin: 0 }),
    make(9, { department: 'Ophthalmology', deptCode: 'P', patientName: 'Sekinat Inusa', priority: 0, status: 'waiting', estimatedWaitMin: 22 }),
    make(10, { department: 'General Medicine', deptCode: 'G', patientName: 'Michael Ajala', priority: 0, status: 'waiting', estimatedWaitMin: 28 })
  ];
};

export const useTicketStore = create<State>()(
  persist(
    (set, get) => ({
      tickets: seedTickets(),
      counters: initialCounters,
      seqByDept: { G: 130, A: 125, B: 123, O: 105, C: 88, P: 74, D: 52, N: 33, E: 48 },

      addTicket: ({ department, deptCode, patientName, priority, phone }) => {
        const nextSeq = (get().seqByDept[deptCode] ?? 0) + 1;
        const ticket: Ticket = {
          id: 'T' + Math.random().toString(36).slice(2, 9).toUpperCase(),
          number: `${deptCode}-${String(nextSeq).padStart(3, '0')}`,
          department,
          deptCode,
          patientName,
          phone,
          priority,
          status: 'waiting',
          arrivedAt: Date.now(),
          estimatedWaitMin: Math.max(
            0,
            get().tickets.filter((t) => t.status === 'waiting' && t.department === department).length * 8
          )
        };
        set((s) => ({
          tickets: [...s.tickets, ticket],
          seqByDept: { ...s.seqByDept, [deptCode]: nextSeq }
        }));
        return ticket;
      },

      callNext: (counter) => {
        const state = get();
        const c = state.counters.find((x) => x.counter === counter);
        if (!c || !c.available) return null;
        // Pick highest priority, then earliest arrival, matching the counter's department.
        const candidates = state.tickets
          .filter((t) => t.status === 'waiting' && t.department === c.department)
          .sort((a, b) =>
            b.priority - a.priority !== 0 ? b.priority - a.priority : a.arrivedAt - b.arrivedAt
          );
        const next = candidates[0];
        if (!next) return null;
        const now = Date.now();
        const updatedTicket: Ticket = {
          ...next,
          status: 'called',
          counter: c.counter,
          doctorId: c.doctorId ?? undefined,
          doctorName: c.doctorName ?? undefined,
          calledAt: now,
          calledExpiresAt: now + 120_000
        };
        set((s) => ({
          tickets: s.tickets.map((t) => (t.id === next.id ? updatedTicket : t)),
          counters: s.counters.map((cc) =>
            cc.counter === counter ? { ...cc, currentTicketId: next.id } : cc
          )
        }));
        return updatedTicket;
      },

      startConsultation: (ticketId) => {
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId ? { ...t, status: 'in_consultation', consultStartAt: Date.now() } : t
          )
        }));
      },

      completeConsultation: (counter) => {
        const state = get();
        const c = state.counters.find((x) => x.counter === counter);
        if (!c || !c.currentTicketId) return;
        const tid = c.currentTicketId;
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === tid ? { ...t, status: 'completed', completedAt: Date.now() } : t
          ),
          counters: s.counters.map((cc) =>
            cc.counter === counter ? { ...cc, currentTicketId: null } : cc
          )
        }));
      },

      skipTicket: (ticketId) => {
        set((s) => ({
          tickets: s.tickets.map((t) => (t.id === ticketId ? { ...t, status: 'skipped' } : t)),
          counters: s.counters.map((cc) =>
            cc.currentTicketId === ticketId ? { ...cc, currentTicketId: null } : cc
          )
        }));
      },

      setCounterAvailability: (counter, available) =>
        set((s) => ({
          counters: s.counters.map((cc) =>
            cc.counter === counter ? { ...cc, available } : cc
          )
        })),

      assignDoctorToCounter: (counter, doctorId, doctorName, department) =>
        set((s) => ({
          counters: s.counters.map((cc) =>
            cc.counter === counter
              ? {
                  ...cc,
                  doctorId,
                  doctorName,
                  department: department ?? cc.department,
                  available: doctorId != null
                }
              : cc
          )
        })),

      resetAll: () =>
        set({
          tickets: seedTickets(),
          counters: initialCounters,
          seqByDept: { G: 130, A: 125, B: 123, O: 105, C: 88, P: 74, D: 52, N: 33, E: 48 }
        })
    }),
    {
      name: 'orh-tickets',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? ({} as Storage) : window.localStorage
      )
    }
  )
);

export const DEPARTMENTS_META = [
  { code: 'G', name: 'General Medicine', color: 'from-primary-500 to-teal-600' },
  { code: 'A', name: 'Cardiology', color: 'from-rose-500 to-red-600' },
  { code: 'B', name: 'Pediatrics', color: 'from-sky-500 to-cyan-600' },
  { code: 'O', name: 'Obstetrics & Gynaecology', color: 'from-pink-500 to-rose-600' },
  { code: 'C', name: 'Orthopedics', color: 'from-amber-500 to-orange-600' },
  { code: 'P', name: 'Ophthalmology', color: 'from-indigo-500 to-blue-600' },
  { code: 'D', name: 'Dermatology', color: 'from-emerald-500 to-teal-600' },
  { code: 'N', name: 'Neurology', color: 'from-violet-500 to-purple-600' },
  { code: 'E', name: 'ENT', color: 'from-fuchsia-500 to-purple-600' }
];
