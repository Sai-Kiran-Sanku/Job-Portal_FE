'use client';

import React from 'react';
import Header from '@/components/Header';
import { ColorModeButton } from '@/components/ui/color-mode';

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute right-4 top-4 z-10">
        <ColorModeButton />
      </div>

      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-[var(--color-text-primary)]">
              Dashboard
            </h1>
            <p className="mt-1 text-[var(--color-text-muted)]">
              A preview of the job-seeker dashboard while authentication is disabled.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Applications sent', value: '23', help: '+3 this week' },
              { label: 'Interviews scheduled', value: '5', help: '+2 this week' },
              { label: 'Profile views', value: '147', help: '+12 this week' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-sm"
              >
                <p className="text-sm font-medium text-[var(--color-text-muted)]">{stat.label}</p>
                <p className="font-heading mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">{stat.help}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] shadow-sm">
            <div className="border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
                Recent applications
              </h2>
            </div>
            <div className="flex flex-col gap-4 p-6">
              {[
                { company: 'TechCorp', position: 'SDE1', status: 'Interview', date: '2 days ago' },
                { company: 'InnoSoft', position: 'Frontend Engineer', status: 'Applied', date: '1 week ago' },
                { company: 'DataWorks', position: 'Data Engineer', status: 'Rejected', date: '2 weeks ago' },
              ].map((app, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-md bg-[var(--color-bg-secondary)] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-tertiary)] text-xs font-semibold text-[var(--color-text-primary)]">
                      {app.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text-primary)]">{app.position}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{app.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span
                      className={
                        app.status === 'Interview'
                          ? 'rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-900 dark:bg-blue-950/50 dark:text-blue-200'
                          : app.status === 'Applied'
                            ? 'rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-950/50 dark:text-amber-200'
                            : 'rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-900 dark:bg-red-950/50 dark:text-red-200'
                      }
                    >
                      {app.status}
                    </span>
                    <span className="text-sm text-[var(--color-text-muted)]">{app.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
