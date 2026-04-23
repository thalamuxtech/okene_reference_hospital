import { ComingSoon } from '@/components/coming-soon';

export const metadata = { title: 'My appointments' };

export default function DashboardAppointments() {
  return (
    <ComingSoon
      title="My appointments"
      description="A detailed list of your upcoming, past and cancelled appointments will live here. In the meantime, see your latest on the main dashboard."
    />
  );
}
