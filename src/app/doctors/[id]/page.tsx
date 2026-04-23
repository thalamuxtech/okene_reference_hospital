import { DOCTORS } from '@/lib/seed-data';
import DoctorProfileClient from './doctor-profile-client';

// Pre-render every seed doctor. Newly-added doctors (from /admin/doctors)
// live only in client-side state, so we still need a catch-all fallback —
// but with Next.js `output: 'export'`, unmatched params fall back to 404.
// To keep admin-added doctors reachable on a static host we enable the
// permissive config below so the same static HTML renders for any /doctors/*
// path, and the client decides what to render from the persisted store.
export function generateStaticParams() {
  return DOCTORS.map((d) => ({ id: d.id }));
}

export const dynamicParams = true;

export default function Page() {
  return <DoctorProfileClient />;
}
