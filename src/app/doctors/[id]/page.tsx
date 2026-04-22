import { DOCTORS } from '@/lib/seed-data';
import DoctorProfileClient from './doctor-profile-client';

export function generateStaticParams() {
  return DOCTORS.map((d) => ({ id: d.id }));
}

export const dynamicParams = false;

export default function Page() {
  return <DoctorProfileClient />;
}
