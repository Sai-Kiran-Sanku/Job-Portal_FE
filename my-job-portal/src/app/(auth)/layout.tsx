'use client';

import React from 'react';
import { ColorModeButton } from '@/components/ui/color-mode';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <div className="absolute right-4 top-4 z-10">
        <ColorModeButton />
      </div>
      {children}
    </div>
  );
}
