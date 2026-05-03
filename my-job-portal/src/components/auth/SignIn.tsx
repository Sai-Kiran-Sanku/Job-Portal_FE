'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/components/ui/password-input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/cn';

interface FormValues {
  email: string;
  password: string;
}

const labelCls = 'mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]';
const inputCls =
  'w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]';
const errCls = 'mt-1 text-sm text-red-600 dark:text-red-400';

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );
  const router = useRouter();
  const { token, setToken } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  React.useEffect(() => {
    if (token) router.replace('/dashboard');
  }, [token, router]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setServerMessage(null);
    try {
      const params = new URLSearchParams();
      params.append('username', data.email);
      params.append('password', data.password);

      const res = await axios.post('/api/proxy/auth/login', params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true,
      });

      const body = res.data;
      if (body?.access_token) {
        const t = body.access_token;
        try {
          localStorage.setItem('access_token', t);
        } catch {
          /* ignore */
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
        try {
          document.cookie = `access_token=${encodeURIComponent(t)}; path=/`;
        } catch {
          /* ignore */
        }
        try {
          setToken(t);
        } catch {
          /* ignore */
        }

        setServerMessage({ type: 'success', text: 'Welcome back!' });
        router.push('/dashboard');
      } else {
        const msg = body?.detail || body?.message || 'Invalid response from server';
        setServerMessage({ type: 'error', text: String(msg) });
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown }; message?: string };
      const msg = e?.response?.data ?? e?.message ?? 'Unexpected error';
      setServerMessage({
        type: 'error',
        text: typeof msg === 'string' ? msg : JSON.stringify(msg),
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div
        className={cn(
          'w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-8 shadow-lg',
        )}
      >
        {serverMessage && (
          <div
            className={cn(
              'mb-4 rounded-md p-3 text-sm',
              serverMessage.type === 'error'
                ? 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200'
                : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
            )}
          >
            {serverMessage.text}
          </div>
        )}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="signin-email" className={labelCls}>
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              className={inputCls}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <p className={errCls}>{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="signin-password" className={labelCls}>
              Password
            </label>
            <PasswordInput id="signin-password" {...register('password', { required: 'Password is required' })} />
            {errors.password && <p className={errCls}>{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60 dark:text-stone-950"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Don&apos;t have an account?{' '}
            <a href="/register" className="font-medium text-[var(--color-primary)] hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
