import {pageMetadata} from '@/lib/metadata';
import {SupportTickets} from '@/components/SupportTickets';

export const metadata = pageMetadata("/dashboard/support");

export default function DashboardSupportPage() {
  return <SupportTickets />;
}
