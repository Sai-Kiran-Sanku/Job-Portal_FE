import { redirect } from 'next/navigation';

export default function LoginPage() {
  redirect('/');
}

export const metadata = {
  title: 'Sign In - Nexora',
  description: 'Sign in to your Nexora account to access job opportunities.',
};
