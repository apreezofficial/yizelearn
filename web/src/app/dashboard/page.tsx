import type {Metadata} from 'next';
import {LearnerDashboard} from '@/components/LearnerDashboard';

export const metadata: Metadata = {title: 'Your dashboard', description: 'Continue learning with yizelearn.'};

export default function DashboardPage() {
  return <LearnerDashboard />;
}
