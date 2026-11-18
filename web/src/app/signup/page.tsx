import {pageMetadata} from '@/lib/metadata';
import {Suspense} from 'react';
import {SignupFromUrl} from '@/components/Auth';

export const metadata = pageMetadata("/signup");

export default function SignupPage() {
  return <Suspense><SignupFromUrl /></Suspense>;
}
