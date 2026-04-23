import { ComingSoon } from '@/components/coming-soon';

export const metadata = { title: 'My medical records' };

export default function DashboardRecords() {
  return (
    <ComingSoon
      title="My medical records"
      description="Your visits, diagnoses, vitals, lab results and doctor notes will appear here — encrypted and private."
    />
  );
}
