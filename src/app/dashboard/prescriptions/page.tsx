import { ComingSoon } from '@/components/coming-soon';

export const metadata = { title: 'My prescriptions' };

export default function DashboardPrescriptions() {
  return (
    <ComingSoon
      title="My prescriptions"
      description="Active prescriptions, refill requests and pharmacy pickups will live here. For now, any new prescription from your consultations is saved to your records."
    />
  );
}
