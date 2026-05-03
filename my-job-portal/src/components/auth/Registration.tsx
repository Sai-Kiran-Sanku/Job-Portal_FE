'use client';

import { useForm } from 'react-hook-form';
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/cn';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const labelCls = 'mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]';
const inputCls =
  'w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]';
const errCls = 'mt-1 text-sm text-red-600 dark:text-red-400';

const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const password = watch('password', '');

  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (token) router.replace('/dashboard');
  }, [token, router]);

  const normalizeMessage = (m: unknown): string => {
    if (!m) return '';
    if (typeof m === 'string') return m;
    if (Array.isArray(m)) return m.map(normalizeMessage).join('; ');
    if (typeof m === 'object' && m !== null) {
      const o = m as Record<string, unknown>;
      if (typeof o.message === 'string') return o.message;
      if (typeof o.detail === 'string') return o.detail;
      if (typeof o.msg === 'string') return o.msg;
      return Object.entries(o)
        .map(([k, v]) => `${k}: ${normalizeMessage(v)}`)
        .join(' | ');
    }
    return String(m);
  };

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setServerMessage(null);
    try {
      const payload = {
        f_name: data.firstName,
        l_name: data.lastName,
        email: data.email,
        password: data.password,
      };

      const res = await fetch('/api/proxy/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = json?.detail || json?.message || json || res.statusText || 'Registration failed';
        setServerMessage({ type: 'error', text: normalizeMessage(msg) });
        return;
      }

      setServerMessage({ type: 'success', text: 'Account created successfully' });
      router.push('/login');
    } catch (err: unknown) {
      setServerMessage({
        type: 'error',
        text: normalizeMessage((err as Error)?.message ?? err),
      });
    } finally {
      setLoading(false);
    }
  });

  const strengthValue = password.length > 0 ? Math.min(Math.ceil(password.length / 2), 4) : 0;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div
        className={cn(
          'w-full max-w-lg rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-8 shadow-lg md:p-12',
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
        <form onSubmit={onSubmit} className="flex w-full max-w-[500px] flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="reg-first" className={labelCls}>
                First name <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-first"
                className={inputCls}
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: { value: 2, message: 'Minimum 2 characters required' },
                })}
              />
              {errors.firstName && <p className={errCls}>{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="reg-last" className={labelCls}>
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-last"
                className={inputCls}
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: { value: 2, message: 'Minimum 2 characters required' },
                })}
              />
              {errors.lastName && <p className={errCls}>{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className={labelCls}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              placeholder="Enter your email"
              className={inputCls}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">We&apos;ll never share your email.</p>
            {errors.email && <p className={errCls}>{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="reg-password" className={labelCls}>
              Password <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-2">
              <PasswordInput
                id="reg-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
              />
              <PasswordStrengthMeter value={strengthValue} />
            </div>
            {errors.password && <p className={errCls}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[var(--color-primary)] py-3 text-base font-semibold text-white transition hover:opacity-95 disabled:opacity-60 dark:text-stone-950"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>

          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
