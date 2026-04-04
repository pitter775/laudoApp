"use client";

import { cn } from "@/lib/utils";

type PremiumSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
};

export function PremiumSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  description,
  className,
}: PremiumSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "premium-pill flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        checked ? "border-primary/30 bg-primary/5" : "",
        className,
      )}
    >
      <span className="min-w-0">
        {label ? (
          <span className="block text-sm font-semibold text-slate-900">
            {label}
          </span>
        ) : null}
        {description ? (
          <span className="mt-1 block text-sm text-slate-600">
            {description}
          </span>
        ) : null}
      </span>

      <span
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition duration-300",
          checked ? "bg-primary" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "absolute left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}
