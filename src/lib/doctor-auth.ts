'use client';

import { DOCTORS, type Doctor } from '@/lib/seed-data';

/**
 * Demo doctor authentication. Each seeded doctor has a predictable login:
 *   email:    <firstname>.<lastname>@okenehospital.ng
 *   password: Doctor@2026
 *
 * e.g. omeiza.nuhu@okenehospital.ng / Doctor@2026
 * In production, replace with Firebase Auth + custom claims (role: DOCTOR).
 */
export const DOCTOR_PASSWORD = 'Doctor@2026';
export const DOCTOR_SESSION_KEY = 'orh-doctor-session';

export function doctorEmail(d: Doctor) {
  return `${d.firstName}.${d.lastName}`.toLowerCase() + '@okenehospital.ng';
}

export function signInDoctor(email: string, password: string): Doctor | null {
  const normalised = email.trim().toLowerCase();
  if (password !== DOCTOR_PASSWORD) return null;
  const doctor = DOCTORS.find((d) => doctorEmail(d) === normalised);
  if (!doctor) return null;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(
      DOCTOR_SESSION_KEY,
      JSON.stringify({ doctorId: doctor.id, email: normalised, signedInAt: Date.now() })
    );
  }
  return doctor;
}

export function getCurrentDoctor(): Doctor | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(DOCTOR_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { doctorId: string; signedInAt: number };
    if (Date.now() - parsed.signedInAt > 8 * 60 * 60 * 1000) return null;
    return DOCTORS.find((d) => d.id === parsed.doctorId) ?? null;
  } catch {
    return null;
  }
}

export function signOutDoctor() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(DOCTOR_SESSION_KEY);
}
