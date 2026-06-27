"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilingInputSchema, STEPS, STEP_LABELS, type StepId, type FilingInput } from "@/lib/schemas/filing";
import { api } from "@/lib/api";
import { StepNavigator } from "@/components/forms/step-navigator";
import { SaveDraftBar } from "@/components/forms/save-draft-bar";
import { ValidationSummary } from "@/components/forms/validation-summary";
import { PersonalInfoForm } from "@/components/forms/personal-info-form";
import { IncomeForm } from "@/components/forms/income-form";
import { DeductionsForm } from "@/components/forms/deductions-form";
import { ReviewSummary } from "@/components/forms/review-summary";
import type { MockFiling, TaxSummary } from "@/lib/schemas/filing";

const STEP_FORMS: Record<StepId, keyof FilingInput | "review"> = {
  "personal-info": "firstName",
  income: "w2Income",
  deductions: "deductionType",
  review: "review",
};

export default function FilingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const filingId = params.id as string;

  const [currentStep, setCurrentStep] = useState<StepId>("personal-info");
  const [completedSteps, setCompletedSteps] = useState<StepId[]>([]);
  const [filing, setFiling] = useState<MockFiling | null>(null);
  const [draftData, setDraftData] = useState<Partial<FilingInput>>({});
  const [taxSummary, setTaxSummary] = useState<TaxSummary | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const currentIndex = STEPS.indexOf(currentStep);

  // Form setup
  const form = useForm<FilingInput>({
    resolver: zodResolver(FilingInputSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      irdNumber: "",
      taxYear: new Date().getFullYear(),
      address: { line1: "", line2: "", city: "", state: "", zip: "" },
      w2Income: 0,
      income1099: 0,
      otherIncome: 0,
      interestIncome: 0,
      dividendIncome: 0,
      deductionType: "standard",
      healthcareExpenses: 0,
      stateLocalTax: 0,
      charitableContributions: 0,
      mortgageInterest: 0,
      studentLoanInterest: 0,
    },
    mode: "onBlur",
  });

  // Load filing and draft data
  useEffect(() => {
    async function load() {
      try {
        const f = await api.filings.getById(filingId);
        setFiling(f);

        const draft = await api.filings.getDraft(filingId);
        if (draft) {
          setDraftData(draft);
          // Patch form with draft values
          Object.entries(draft).forEach(([key, value]) => {
            form.setValue(key as keyof FilingInput, value as never);
          });
        }
      } catch {
        router.push("/filings");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [filingId, router, form]);

  // Auto-save on step change
  const autoSave = useCallback(
    async (data: Partial<FilingInput>) => {
      try {
        await api.filings.updateDraft(filingId, data as Record<string, unknown>);
      } catch {
        // Silently fail for auto-save
      }
    },
    [filingId]
  );

  // Step navigation — use functional updates to avoid stale closures
  const goToStep = useCallback(
    (step: StepId) => {
      // Save current step data before switching
      const values = form.getValues();
      autoSave(values);

      setCurrentStep((prevStep) => {
        const prevIndex = STEPS.indexOf(prevStep);
        const targetIndex = STEPS.indexOf(step);
        // Mark current step as completed if moving forward
        if (prevIndex < targetIndex) {
          setCompletedSteps((prev) => [...prev, prevStep]);
        }
        return step;
      });
      setValidationErrors({});
    },
    [form, autoSave]
  );

  const goNext = useCallback(() => {
    setCurrentStep((prevStep) => {
      const prevIndex = STEPS.indexOf(prevStep);
      if (prevIndex < STEPS.length - 1) {
        const nextStep = STEPS[prevIndex + 1];
        setCompletedSteps((prev) => [...prev, prevStep]);
        return nextStep;
      }
      return prevStep;
    });
    setValidationErrors({});
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((prevStep) => {
      const prevIndex = STEPS.indexOf(prevStep);
      if (prevIndex > 0) {
        return STEPS[prevIndex - 1];
      }
      return prevStep;
    });
    setValidationErrors({});
  }, []);

  // Calculate tax
  const handleCalculate = useCallback(async () => {
    setIsCalculating(true);
    try {
      const values = form.getValues();
      const result = await api.tax.calculate(filingId, values as unknown as Record<string, unknown>);
      setTaxSummary(result);
    } finally {
      setIsCalculating(false);
    }
  }, [filingId, form]);

  // Submit filing
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await api.submitFiling(filingId);
      router.push("/filings");
    } finally {
      setIsSubmitting(false);
    }
  }, [filingId, router]);

  // Save draft
  const handleSaveDraft = useCallback(async () => {
    const values = form.getValues();
    await api.filings.updateDraft(filingId, values as unknown as Record<string, unknown>);
  }, [filingId, form]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!filing) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Filing not found.</p>
        <Link href="/filings" className="mt-4 text-primary hover:underline">
          Back to Filings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <Link
          href="/filings"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Filings
        </Link>
        <div className="mt-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {filing.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tax Year {filing.taxYear} · Due {filing.dueDate}
          </p>
        </div>
      </div>

      {/* Step Navigator */}
      <div className="rounded-card border border-border bg-card p-5">
        <StepNavigator
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />
      </div>

      {/* Validation Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <ValidationSummary errors={validationErrors} />
      )}

      {/* Step Content */}
      <div className="rounded-card border border-border bg-card p-6">
        {currentStep === "personal-info" && (
          <PersonalInfoForm
            defaultValues={draftData}
            onSubmit={(data) => {
              setDraftData((prev) => ({ ...prev, ...data }));
              goNext();
            }}
            onAutoSave={autoSave}
          />
        )}
        {currentStep === "income" && (
          <IncomeForm
            defaultValues={draftData}
            onSubmit={(data) => {
              setDraftData((prev) => ({ ...prev, ...data }));
              goNext();
            }}
            onAutoSave={autoSave}
          />
        )}
        {currentStep === "deductions" && (
          <DeductionsForm
            defaultValues={draftData}
            onSubmit={(data) => {
              setDraftData((prev) => ({ ...prev, ...data }));
              goNext();
            }}
            onAutoSave={autoSave}
          />
        )}
        {currentStep === "review" && (
          <ReviewSummary
            filingData={draftData}
            taxSummary={taxSummary}
            isCalculating={isCalculating}
            onCalculate={handleCalculate}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Step navigation buttons */}
      {currentStep !== "review" && (
        <div className="flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Step {currentIndex + 1} of {STEPS.length}
            </span>
            <button
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Save Draft Bar */}
      <SaveDraftBar
        onSave={handleSaveDraft}
        hasChanges={form.formState.isDirty}
      />
    </div>
  );
}
