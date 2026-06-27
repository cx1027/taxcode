"use client";

import { useForm } from "react-hook-form";
import { InlineFieldError } from "@/components/forms/validation-summary";
import { Receipt, UserCheck } from "lucide-react";

interface TaxProfileSettingsFormProps {
  defaultValues?: Partial<TaxProfileData>;
  onSubmit: (data: TaxProfileData) => void;
}

export interface TaxProfileData {
  filingStatus: string;
  irdNumber: string;
  withholdingAllowance: number;
  estimatedWithholding: number;
}

export function TaxProfileSettingsForm({
  defaultValues,
  onSubmit,
}: TaxProfileSettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TaxProfileData>({
    defaultValues: {
      filingStatus: defaultValues?.filingStatus ?? "single",
      irdNumber: defaultValues?.irdNumber ?? "",
      withholdingAllowance: defaultValues?.withholdingAllowance ?? 1,
      estimatedWithholding: defaultValues?.estimatedWithholding ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Tax Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your tax filing status and IRD information.
        </p>
      </div>

      {/* Filing Status */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-muted-foreground" />
          Filing Status
        </h3>
        <div>
          <label htmlFor="tax-filingStatus" className="block text-sm font-medium text-foreground">
            Filing Status
          </label>
          <select
            {...register("filingStatus")}
            id="tax-filingStatus"
            className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="single">Single</option>
            <option value="married_joint">Married Filing Jointly</option>
            <option value="married_separate">Married Filing Separately</option>
            <option value="head_of_household">Head of Household</option>
          </select>
          <InlineFieldError message={errors.filingStatus?.message} />
        </div>
      </div>

      {/* IRD Number */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          IRD Information
        </h3>
        <div>
          <label htmlFor="tax-irdNumber" className="block text-sm font-medium text-foreground">
            IRD Number
          </label>
          <input
            {...register("irdNumber", {
              pattern: {
                value: /^\d{3}-\d{3}-\d{3}$/,
                message: "IRD number must be in format XXX-XXX-XXX",
              },
            })}
            id="tax-irdNumber"
            placeholder="123-456-789"
            className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <InlineFieldError message={errors.irdNumber?.message} />
        </div>
      </div>

      {/* Withholding */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Tax Withholding</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tax-withholdingAllowance" className="block text-sm font-medium text-foreground">
              Withholding Allowance
            </label>
            <input
              {...register("withholdingAllowance", { valueAsNumber: true })}
              id="tax-withholdingAllowance"
              type="number"
              min="0"
              max="10"
              className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <InlineFieldError message={errors.withholdingAllowance?.message} />
          </div>
          <div>
            <label htmlFor="tax-estimatedWithholding" className="block text-sm font-medium text-foreground">
              Estimated Withholding ($)
            </label>
            <input
              {...register("estimatedWithholding", { valueAsNumber: true })}
              id="tax-estimatedWithholding"
              type="number"
              min="0"
              step="0.01"
              className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <InlineFieldError message={errors.estimatedWithholding?.message} />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={!isDirty}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
