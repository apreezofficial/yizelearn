import type {Metadata} from 'next';
import {Auth} from '@/components/Auth';

export const metadata: Metadata = {title: 'Log in', description: 'Log in to keep learning on yizelearn.'};

export default function LoginPage() {
  return <Auth mode="login" />;
}
