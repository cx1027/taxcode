"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IncomeSchema, type IncomeInput } from "@/lib/schemas/filing";
import { InlineFieldError } from "./validation-summary";
import { DollarSign } from "lucide-react";

interface IncomeFormProps {
  defaultValues?: Partial<IncomeInput>;
  onSubmit: (data: IncomeInput) => void;
  onAutoSave?: (data: IncomeInput) => void;
}

function CurrencyInput({
  label,
  name,
  control,
  error,
  helperText,
}: {
  label: string;
  name: keyof IncomeInput;
  control: Control<IncomeInput>;
  error?: string;
  helperText?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative mt-1">
        <DollarSign
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full rounded-input border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground tabular-nums placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
            />
          )}
        />
      </div>
      {helperText && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>
      )}
      <InlineFieldError message={error} />
    </div>
  );
}

export function IncomeForm({ defaultValues, onSubmit, onAutoSave }: IncomeFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IncomeInput>({
    resolver: zodResolver(IncomeSchema),
    defaultValues: {
      w2Income: defaultValues?.w2Income ?? 0,
      income1099: defaultValues?.income1099 ?? 0,
      otherIncome: defaultValues?.otherIncome ?? 0,
      interestIncome: defaultValues?.interestIncome ?? 0,
      dividendIncome: defaultValues?.dividendIncome ?? 0,
    },
    mode: "onBlur",
  });

  // Auto-save on change (debounced)
  const watchedValues = watch();
  useEffect(() => {
    if (!onAutoSave) return;
    const timer = setTimeout(() => {
      onAutoSave(watchedValues as IncomeInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [watchedValues, onAutoSave]);

  // Calculate total income
  const totalIncome =
    (watchedValues.w2Income || 0) +
    (watchedValues.income1099 || 0) +
    (watchedValues.otherIncome || 0) +
    (watchedValues.interestIncome || 0) +
    (watchedValues.dividendIncome || 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Income Details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter all sources of income for this tax year.
        </p>
      </div>

      {/* W-2 Income */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Employment Income</h3>
        <CurrencyInput
          label="W-2 Income (Salary / Wages)"
          name="w2Income"
          control={control}
          error={errors.w2Income?.message}
          helperText="Total gross income from W-2 forms"
        />
      </div>

      {/* 1099 Income */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Self-Employment / Contract</h3>
        <CurrencyInput
          label="1099 Income (Freelance / Contract)"
          name="income1099"
          control={control}
          error={errors.income1099?.message}
          helperText="Income from 1099-NEC or 1099-K forms"
        />
      </div>

      {/* Other Income */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Other Income</h3>
        <CurrencyInput
          label="Other Income"
          name="otherIncome"
          control={control}
          error={errors.otherIncome?.message}
          helperText="Rental income, alimony, gambling winnings, etc."
        />
        <CurrencyInput
          label="Bank Interest"
          name="interestIncome"
          control={control}
          error={errors.interestIncome?.message}
          helperText="From 1099-INT forms"
        />
        <CurrencyInput
          label="Dividends"
          name="dividendIncome"
          control={control}
          error={errors.dividendIncome?.message}
          helperText="From 1099-DIV forms"
        />
      </div>

      {/* Total */}
      <div className="rounded-card border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Total Income</span>
          <span className="text-lg font-semibold text-primary tabular-nums">
            ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </form>
  );
}
