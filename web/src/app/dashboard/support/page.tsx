import type {Metadata} from 'next';
import {SupportTickets} from '@/components/SupportTickets';

export const metadata: Metadata = {title: 'Support tickets', description: 'Open and follow your yizelearn support tickets.'};

export default function DashboardSupportPage() {
  return <SupportTickets />;
}
