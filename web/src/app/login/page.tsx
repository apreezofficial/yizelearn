import {pageMetadata} from '@/lib/metadata';
import {Auth} from '@/components/Auth';

export const metadata = pageMetadata("/login");

export default function LoginPage() {
  return <Auth mode="login" />;
}
