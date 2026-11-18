import {pageMetadata} from '@/lib/metadata';
import {LearnerDashboard} from '@/components/LearnerDashboard';

export const metadata = pageMetadata("/dashboard");

export default function DashboardPage() {
  return <LearnerDashboard />;
}
