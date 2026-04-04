"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

const EMPTY_SELECT_VALUE = "__empty_select__";

export type PremiumSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: LucideIcon;
};

type PremiumSelectProps = {
  value: string;
  options: PremiumSelectOption[];
  onChange: (value: string) => void;
  label?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  helperText?: string;
  placeholder?: string;
  emptyText?: string;
  placeholderIcon?: LucideIcon;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
};

export function PremiumSelect({
  value,
  options,
  onChange,
  label,
  name,
  disabled = false,
  required = false,
  invalid = false,
  helperText,
  placeholder = "Selecione",
  emptyText = "Nenhuma opcao disponivel.",
  placeholderIcon: PlaceholderIcon,
  className,
  triggerClassName,
  panelClassName,
}: PremiumSelectProps) {
  const radixValue = value === "" ? EMPTY_SELECT_VALUE : value;
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  return (
    <div className={cn(label ? "grid gap-2" : "", className)}>
      {label ? (
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
          {label}
          {required ? " *" : ""}
        </span>
      ) : null}

      <Select.Root
        value={radixValue}
        onValueChange={(nextValue) =>
          onChange(nextValue === EMPTY_SELECT_VALUE ? "" : nextValue)
        }
        disabled={disabled}
        name={name}
      >
        <Select.Trigger
          className={cn(
            "premium-field flex h-10 w-full cursor-pointer select-none items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm text-slate-900 outline-none transition",
            "focus:border-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-60",
            invalid
              ? "!border-rose-400 bg-rose-50/40 focus:!border-rose-500 focus-visible:!border-rose-500"
              : "",
            triggerClassName,
          )}
          aria-invalid={invalid}
        >
          <span className="flex min-w-0 items-center gap-2">
            {selectedOption?.icon ? (
              <selectedOption.icon className="h-4 w-4 shrink-0 text-primary" />
            ) : PlaceholderIcon ? (
              <PlaceholderIcon className="h-4 w-4 shrink-0 text-slate-400" />
            ) : null}
            <span
              className={cn(
                "truncate",
                selectedOption ? "text-slate-900" : "text-slate-400",
              )}
            >
              {selectedOption?.label ?? placeholder}
            </span>
          </span>
          <Select.Icon asChild>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={8}
            className={cn(
              "premium-panel z-[120] max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-slate-200 bg-white/98 p-2 shadow-[0_18px_46px_rgba(15,23,42,0.14)]",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              panelClassName,
            )}
          >
            <Select.Viewport className="max-h-64 space-y-1 overflow-y-auto">
              {options.length > 0 ? (
                options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={
                      option.value === "" ? EMPTY_SELECT_VALUE : option.value
                    }
                    disabled={option.disabled}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center justify-between rounded-xl px-3 py-2.5 text-sm outline-none transition",
                      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                      "data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-950",
                      "data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {option.icon ? (
                        <option.icon className="h-4 w-4 shrink-0 text-current" />
                      ) : null}
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </span>
                    <Select.ItemIndicator>
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-slate-500">{emptyText}</div>
              )}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {helperText ? (
        <p
          className={cn(
            "text-[11px] leading-5",
            invalid ? "text-rose-600" : "text-slate-500",
          )}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
