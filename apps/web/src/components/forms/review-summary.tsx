"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Send,
  FileText,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaxSummary } from "@/lib/schemas/filing";
import type { FilingInput } from "@/lib/schemas/filing";

interface ReviewSummaryProps {
  filingData: Partial<FilingInput>;
  taxSummary: TaxSummary | null;
  isCalculating: boolean;
  onCalculate: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

function SummaryRow({
  label,
  amount,
  isTotal = false,
  isNegative = false,
}: {
  label: string;
  amount: number;
  isTotal?: boolean;
  isNegative?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2.5",
        isTotal && "border-t border-border mt-2 pt-3"
      )}
    >
      <span
        className={cn(
          "text-sm",
          isTotal ? "font-semibold text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-sm tabular-nums font-medium",
          isTotal
            ? isNegative
              ? "text-destructive"
              : "text-success"
            : isNegative
              ? "text-destructive"
              : "text-foreground"
        )}
      >
        {isNegative && amount > 0 ? "-" : ""}$
        {Math.abs(amount).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </span>
    </div>
  );
}

function DataField({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">
        {value !== undefined && value !== "" ? value : "—"}
      </p>
    </div>
  );
}

export function ReviewSummary({
  filingData,
  taxSummary,
  isCalculating,
  onCalculate,
  onSubmit,
  isSubmitting,
}: ReviewSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Review & Calculate</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your filing details, then calculate your tax liability.
        </p>
      </div>

      {/* Personal Info Summary */}
      <div className="rounded-card border border-border p-5">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Personal Information
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <DataField
            label="Name"
            value={`${filingData.firstName || ""} ${filingData.lastName || ""}`.trim()}
          />
          <DataField label="IRD Number" value={filingData.irdNumber} />
          <DataField label="Tax Year" value={filingData.taxYear} />
          <DataField
            label="Address"
            value={
              filingData.address
                ? [
                    filingData.address.line1,
                    filingData.address.line2,
                    filingData.address.city,
                    filingData.address.state,
                    filingData.address.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")
                : undefined
            }
          />
        </div>
      </div>

      {/* Income Summary */}
      <div className="rounded-card border border-border p-5">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-success" />
          Income
        </h3>
        <div className="space-y-1">
          <SummaryRow label="W-2 Income" amount={filingData.w2Income || 0} />
          <SummaryRow label="1099 Income" amount={filingData.income1099 || 0} />
          <SummaryRow label="Other Income" amount={filingData.otherIncome || 0} />
          <SummaryRow label="Interest Income" amount={filingData.interestIncome || 0} />
          <SummaryRow label="Dividend Income" amount={filingData.dividendIncome || 0} />
          <SummaryRow
            label="Total Income"
            amount={
              (filingData.w2Income || 0) +
              (filingData.income1099 || 0) +
              (filingData.otherIncome || 0) +
              (filingData.interestIncome || 0) +
              (filingData.dividendIncome || 0)
            }
            isTotal
          />
        </div>
      </div>

      {/* Deductions Summary */}
      <div className="rounded-card border border-border p-5">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-info" />
          Deductions
        </h3>
        <div className="space-y-1">
          <SummaryRow
            label={filingData.deductionType === "itemized" ? "Itemized Deductions" : "Standard Deduction"}
            amount={
              filingData.deductionType === "itemized"
                ? (filingData.healthcareExpenses || 0) +
                  (filingData.stateLocalTax || 0) +
                  (filingData.charitableContributions || 0) +
                  (filingData.mortgageInterest || 0) +
                  (filingData.studentLoanInterest || 0)
                : 14600
            }
            isNegative
          />
        </div>
      </div>

      {/* Calculate button */}
      {!taxSummary && (
        <button
          onClick={onCalculate}
          disabled={isCalculating}
          className="w-full rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
        >
          {isCalculating ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Calculating...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Calculate Tax
            </span>
          )}
        </button>
      )}

      {/* Tax Calculation Result */}
      {taxSummary && (
        <div className="rounded-card border-2 border-primary/30 bg-primary/5 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h3 className="text-sm font-semibold text-foreground">Tax Calculation Result</h3>
          </div>

          <div className="space-y-1 rounded-lg bg-card p-4 border border-border">
            <SummaryRow label="Total Income" amount={taxSummary.breakdowns[0]?.amount || 0} />
            <SummaryRow
              label="Deductions"
              amount={-(taxSummary.breakdowns[1]?.amount || 0)}
              isNegative
            />
            <SummaryRow label="Taxable Income" amount={taxSummary.taxableIncome} />
            <SummaryRow
              label="Estimated Tax Liability"
              amount={taxSummary.taxLiability}
              isTotal
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-card p-3 border border-border">
            <span className="text-sm text-muted-foreground">Effective Tax Rate</span>
            <span className="text-lg font-semibold text-primary tabular-nums">
              {taxSummary.effectiveRate.toFixed(1)}%
            </span>
          </div>

          {/* Warnings */}
          {taxSummary.warnings.length > 0 && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium text-warning">Warnings</span>
              </div>
              <ul className="space-y-1">
                {taxSummary.warnings.map((warning, i) => (
                  <li key={i} className="text-xs text-warning/80">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Submit button */}
      {taxSummary && (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full rounded-lg bg-success px-4 py-3 text-sm font-medium text-success-foreground shadow-soft-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit Filing
            </span>
          )}
        </button>
      )}
    </div>
  );
}
