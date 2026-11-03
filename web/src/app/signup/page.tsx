import type {Metadata} from 'next';
import {Suspense} from 'react';
import {SignupFromUrl} from '@/components/Auth';

export const metadata: Metadata = {title: 'Create your account', description: 'Create a yizelearn account to start learning or teaching.'};

export default function SignupPage() {
  return <Suspense><SignupFromUrl /></Suspense>;
}
