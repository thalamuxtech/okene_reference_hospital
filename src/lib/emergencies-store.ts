'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { publish } from './broadcast';

export type EmergencySeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
export type EmergencyType = 'Medical' | 'Obstetric' | 'Accident' | 'Pediatric' | 'Cardiac' | 'Other';
export type EmergencyStatus =
  | 'reported'
  | 'dispatched'
  | 'en_route'
  | 'arrived'
  | 'resolved';

export type EmergencyLog = {
  at: number;
  by: 'admin' | 'system';
  action: string;
  detail?: string;
};

export type Emergency = {
  id: string;
  caller: string;
  phone: string;
  type: EmergencyType;
  severity: EmergencySeverity;
  location: string;
  status: EmergencyStatus;
  ambulance?: string;
  eta?: number; // minutes
  erAlerted: boolean;
  erAlertedAt?: number;
  notes?: string;
  createdAt: number;
  resolvedAt?: number;
  log: EmergencyLog[];
};

type State = {
  emergencies: Emergency[];
  add: (
    e: Omit<Emergency, 'id' | 'createdAt' | 'log' | 'erAlerted'>
  ) => Emergency;
  update: (id: string, patch: Partial<Emergency>) => void;
  setStatus: (id: string, status: EmergencyStatus) => void;
  alertER: (id: string) => void;
  resolve: (id: string, note?: string) => void;
  remove: (id: string) => void;
  resetToSeed: () => void;
};

function nextId(existing: Emergency[]): string {
  const year = new Date().getFullYear();
  const seq =
    existing
      .map((e) => Number(e.id.split('-').pop()) || 0)
      .reduce((m, n) => Math.max(m, n), 100) + 1;
  return `EMG-${year}-${String(seq).padStart(5, '0')}`;
}

function seed(): Emergency[] {
  const now = Date.now();
  return [
    {
      id: 'EMG-2026-00188',
      caller: 'Unknown',
      phone: '+234 803 551 2201',
      type: 'Medical',
      severity: 'CRITICAL',
      location: 'Obehira Road, Okene',
      status: 'en_route',
      ambulance: 'AMB-02',
      eta: 4,
      erAlerted: false,
      createdAt: now - 2 * 60_000,
      log: [{ at: now - 2 * 60_000, by: 'system', action: 'reported' }]
    },
    {
      id: 'EMG-2026-00187',
      caller: 'Halima Adavi',
      phone: '+234 810 449 1182',
      type: 'Obstetric',
      severity: 'HIGH',
      location: 'Lokoja Road, Adavi',
      status: 'dispatched',
      ambulance: 'AMB-01',
      eta: 11,
      erAlerted: true,
      erAlertedAt: now - 5 * 60_000,
      createdAt: now - 7 * 60_000,
      log: [
        { at: now - 7 * 60_000, by: 'system', action: 'reported' },
        { at: now - 5 * 60_000, by: 'admin', action: 'er-alerted' }
      ]
    },
    {
      id: 'EMG-2026-00186',
      caller: 'Omeiza Yahaya',
      phone: '+234 903 220 4409',
      type: 'Accident',
      severity: 'MODERATE',
      location: 'Ihima Junction, Okehi',
      status: 'resolved',
      ambulance: 'AMB-03',
      eta: 0,
      erAlerted: true,
      erAlertedAt: now - 30 * 60_000,
      createdAt: now - 34 * 60_000,
      resolvedAt: now - 5 * 60_000,
      log: [
        { at: now - 34 * 60_000, by: 'system', action: 'reported' },
        { at: now - 30 * 60_000, by: 'admin', action: 'er-alerted' },
        { at: now - 5 * 60_000, by: 'admin', action: 'resolved' }
      ]
    }
  ];
}

const CHANNEL = 'orh-emergencies';

export const useEmergenciesStore = create<State>()(
  persist(
    (set, get) => ({
      emergencies: seed(),

      add: (e) => {
        const id = nextId(get().emergencies);
        const record: Emergency = {
          ...e,
          id,
          erAlerted: false,
          createdAt: Date.now(),
          log: [{ at: Date.now(), by: 'admin', action: 'reported' }]
        };
        set((s) => ({ emergencies: [record, ...s.emergencies] }));
        publish(CHANNEL, 'add', { id });
        return record;
      },

      update: (id, patch) => {
        set((s) => ({
          emergencies: s.emergencies.map((e) =>
            e.id === id ? { ...e, ...patch } : e
          )
        }));
        publish(CHANNEL, 'update', { id });
      },

      setStatus: (id, status) => {
        set((s) => ({
          emergencies: s.emergencies.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status,
                  log: [
                    ...e.log,
                    { at: Date.now(), by: 'admin', action: `status:${status}` }
                  ]
                }
              : e
          )
        }));
        publish(CHANNEL, 'status', { id, status });
      },

      alertER: (id) => {
        set((s) => ({
          emergencies: s.emergencies.map((e) =>
            e.id === id
              ? {
                  ...e,
                  erAlerted: true,
                  erAlertedAt: Date.now(),
                  log: [
                    ...e.log,
                    { at: Date.now(), by: 'admin', action: 'er-alerted' }
                  ]
                }
              : e
          )
        }));
        publish(CHANNEL, 'er-alert', { id });
      },

      resolve: (id, note) => {
        set((s) => ({
          emergencies: s.emergencies.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status: 'resolved' as const,
                  resolvedAt: Date.now(),
                  notes: note ?? e.notes,
                  log: [
                    ...e.log,
                    {
                      at: Date.now(),
                      by: 'admin',
                      action: 'resolved',
                      detail: note
                    }
                  ]
                }
              : e
          )
        }));
        publish(CHANNEL, 'resolve', { id });
      },

      remove: (id) => {
        set((s) => ({ emergencies: s.emergencies.filter((e) => e.id !== id) }));
        publish(CHANNEL, 'remove', { id });
      },

      resetToSeed: () => {
        set({ emergencies: seed() });
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

export const EMERGENCIES_CHANNEL = CHANNEL;
