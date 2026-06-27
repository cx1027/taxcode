"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeductionsSchema, type DeductionsInput } from "@/lib/schemas/filing";
import { InlineFieldError } from "./validation-summary";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeductionsFormProps {
  defaultValues?: Partial<DeductionsInput>;
  onSubmit: (data: DeductionsInput) => void;
  onAutoSave?: (data: DeductionsInput) => void;
}

function CurrencyInput({
  label,
  name,
  control,
  error,
  helperText,
}: {
  label: string;
  name: keyof DeductionsInput;
  control: Control<DeductionsInput>;
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

export function DeductionsForm({
  defaultValues,
  onSubmit,
  onAutoSave,
}: DeductionsFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DeductionsInput>({
    resolver: zodResolver(DeductionsSchema),
    defaultValues: {
      deductionType: defaultValues?.deductionType ?? "standard",
      healthcareExpenses: defaultValues?.healthcareExpenses ?? 0,
      stateLocalTax: defaultValues?.stateLocalTax ?? 0,
      charitableContributions: defaultValues?.charitableContributions ?? 0,
      mortgageInterest: defaultValues?.mortgageInterest ?? 0,
      studentLoanInterest: defaultValues?.studentLoanInterest ?? 0,
    },
    mode: "onBlur",
  });

  const watchedValues = watch();
  const isItemized = watchedValues.deductionType === "itemized";

  // Auto-save on change (debounced)
  useEffect(() => {
    if (!onAutoSave) return;
    const timer = setTimeout(() => {
      onAutoSave(watchedValues as DeductionsInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [watchedValues, onAutoSave]);

  // Calculate total itemized deductions
  const totalItemized =
    (watchedValues.healthcareExpenses || 0) +
    (watchedValues.stateLocalTax || 0) +
    (watchedValues.charitableContributions || 0) +
    (watchedValues.mortgageInterest || 0) +
    (watchedValues.studentLoanInterest || 0);

  const STANDARD_DEDUCTION = 14600;
  const appliedDeduction = isItemized ? totalItemized : STANDARD_DEDUCTION;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Deductions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose between standard deduction or itemized deductions.
        </p>
      </div>

      {/* Deduction type toggle */}
      <div className="rounded-card border border-border p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">Deduction Type</h3>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => control._formValues && undefined}
            className={cn(
              "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
              !isItemized
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            <span className="block">Standard Deduction</span>
            <span className="mt-1 block text-xs opacity-75">$14,600 (2024)</span>
          </button>
          <Controller
            name="deductionType"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange("itemized")}
                className={cn(
                  "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                  isItemized
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                <span className="block">Itemized Deductions</span>
                <span className="mt-1 block text-xs opacity-75">
                  {isItemized ? `$${totalItemized.toLocaleString()}` : "Enter expenses below"}
                </span>
              </button>
            )}
          />
        </div>
        <InlineFieldError message={errors.deductionType?.message} />
      </div>

      {/* Itemized deductions (only shown when itemized) */}
      {isItemized && (
        <div className="rounded-card border border-border p-5 space-y-4 animate-in fade-in">
          <h3 className="text-sm font-medium text-foreground">Itemized Expenses</h3>
          <CurrencyInput
            label="Healthcare Expenses"
            name="healthcareExpenses"
            control={control}
            error={errors.healthcareExpenses?.message}
            helperText="Medical, dental, prescription costs above 7.5% AGI"
          />
          <CurrencyInput
            label="State & Local Taxes (SALT)"
            name="stateLocalTax"
            control={control}
            error={errors.stateLocalTax?.message}
            helperText="State income tax + property tax (capped at $10,000)"
          />
          <CurrencyInput
            label="Charitable Contributions"
            name="charitableContributions"
            control={control}
            error={errors.charitableContributions?.message}
            helperText="Donations to qualified charities"
          />
          <CurrencyInput
            label="Mortgage Interest"
            name="mortgageInterest"
            control={control}
            error={errors.mortgageInterest?.message}
            helperText="Interest on home mortgage (up to $750k debt)"
          />
          <CurrencyInput
            label="Student Loan Interest"
            name="studentLoanInterest"
            control={control}
            error={errors.studentLoanInterest?.message}
            helperText="Up to $2,500 per year"
          />
        </div>
      )}

      {/* Summary */}
      <div className="rounded-card border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Applied Deduction</span>
          <span className="text-lg font-semibold text-primary tabular-nums">
            ${appliedDeduction.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {isItemized
            ? "Based on your itemized expenses"
            : "Standard deduction for single filers (2024)"}
        </p>
      </div>
    </form>
  );
}
