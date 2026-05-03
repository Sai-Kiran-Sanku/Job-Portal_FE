"use client";

import * as React from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { cn } from "@/lib/cn";

const inputClass =
  "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultVisible?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { className, defaultVisible, visible: visibleProp, onVisibleChange, disabled, ...rest },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = React.useState(defaultVisible ?? false);
    const isControlled = visibleProp !== undefined;
    const visible = isControlled ? visibleProp : uncontrolled;

    const setVisible = (v: boolean) => {
      if (!isControlled) setUncontrolled(v);
      onVisibleChange?.(v);
    };

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          className={cn(inputClass, className)}
          {...rest}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
          onPointerDown={(e) => {
            if (disabled) return;
            if (e.button !== 0) return;
            e.preventDefault();
            setVisible(!visible);
          }}
        >
          {visible ? <LuEyeOff className="size-4" /> : <LuEye className="size-4" />}
        </button>
      </div>
    );
  },
);

export interface PasswordStrengthMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  value: number;
}

export const PasswordStrengthMeter = React.forwardRef<HTMLDivElement, PasswordStrengthMeterProps>(
  function PasswordStrengthMeter({ max = 4, value, className, ...rest }, ref) {
    const percent = (value / max) * 100;
    const { label, segmentClass } = strengthStyle(percent);

    return (
      <div ref={ref} className={cn("flex w-full flex-col gap-1", className)} {...rest}>
        <div className="flex w-full gap-1">
          {Array.from({ length: max }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1 flex-1 rounded-sm bg-[var(--color-border)] transition-colors",
                index < value && segmentClass,
              )}
            />
          ))}
        </div>
        {label ? <span className="text-xs text-[var(--color-text-muted)]">{label}</span> : null}
      </div>
    );
  },
);

function strengthStyle(percent: number) {
  if (percent < 33) return { label: "Low", segmentClass: "bg-red-500" };
  if (percent < 66) return { label: "Medium", segmentClass: "bg-amber-500" };
  return { label: "High", segmentClass: "bg-emerald-600" };
}
