import { redirect } from 'next/navigation';

export default function RegisterPage() {
  redirect('/');
}

export const metadata = {
  title: 'Create Account - Nexora',
  description: 'Create your Nexora account and start your job search journey.',
};
