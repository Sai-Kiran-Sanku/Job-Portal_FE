'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hoverable = true,
  className,
  children,
  ...props
}) => {
  const variants = {
    default:
      'border border-[var(--color-border)] bg-[var(--color-bg-primary)] shadow-sm',
    outlined: 'border border-[var(--color-border)] bg-transparent',
    elevated: 'bg-[var(--color-bg-primary)] shadow-lg',
    filled: 'bg-[var(--color-bg-secondary)]',
  };

  return (
    <div
      className={cn(
        'rounded-lg p-6 transition-all duration-300',
        variants[variant],
        hoverable && 'hover:-translate-y-1 hover:shadow-md',
        hoverable && variant !== 'elevated' && 'hover:border-emerald-400/40',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
