"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Receipt, AlertTriangle, CheckCircle2 } from "lucide-react";

// ============================================================
// Types
// ============================================================
type IncomeSource =
  | "paye_salary"
  | "nz_interest"
  | "nz_dividends"
  | "investment_property"
  | "shareholder_employee_no_tax"
  | "partnership_income"
  | "ltc_company_income"
  | "nz_estate_trust_income"
  | "boarder_income"
  | "maori_authority_distributions";

interface OnboardingData {
  irdNumber: string;
  isCompanyOrPartner: boolean;
  hasBlockedIncome: boolean;
  selectedIncomeSources: IncomeSource[];
}

// ============================================================
// Constants
// ============================================================
const BLOCKED_INCOME_LABELS = [
  "Income earned outside NZ",
  "Short-term rental of primary residence",
  "Crypto currency",
  "Royalties",
];

const INCOME_SOURCE_OPTIONS: { value: IncomeSource; label: string }[] = [
  { value: "paye_salary", label: "PAYE / Salary" },
  { value: "nz_interest", label: "NZ Interest" },
  { value: "nz_dividends", label: "NZ Dividends" },
  { value: "investment_property", label: "Investment Property" },
  { value: "shareholder_employee_no_tax", label: "Shareholder-employee salary with no tax deducted" },
  { value: "partnership_income", label: "Partnership income" },
  { value: "ltc_company_income", label: "Look through company income (LTC)" },
  { value: "nz_estate_trust_income", label: "NZ Estate or trust income" },
  { value: "boarder_income", label: "Boarder income" },
  { value: "maori_authority_distributions", label: "Māori Authority distributions" },
];

const STEPS = [
  { id: 1, label: "IRD Number" },
  { id: 2, label: "Registration Check" },
  { id: 3, label: "Income Verification" },
  { id: 4, label: "Income Sources" },
];

// ============================================================
// Helpers
// ============================================================
function validateIrdNumber(value: string): boolean {
  return /^\d{3}-\d{3}-\d{3}$/.test(value.trim());
}

// ============================================================
// Page Component
// ============================================================
export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 — IRD Number
  const [irdNumber, setIrdNumber] = useState("");
  const [irdBlurred, setIrdBlurred] = useState(false);
  const irdRef = useRef<HTMLInputElement>(null);

  // Step 2 — Company/Partner
  const [isCompanyOrPartner, setIsCompanyOrPartner] = useState<boolean | null>(null);

  // Step 3 — Blocked income check
  const [blockedIncomes, setBlockedIncomes] = useState<Set<string>>(new Set());

  // Step 4 — Income sources
  const [selectedIncomeSources, setSelectedIncomeSources] = useState<Set<IncomeSource>>(new Set());

  // Sync IRD input value with state (handles browser autofill / playwright)
  useEffect(() => {
    const input = irdRef.current;
    if (!input) return;
    const sync = () => {
      const val = input.value;
      setIrdNumber((prev) => (prev !== val ? val : prev));
    };
    input.addEventListener("input", sync);
    input.addEventListener("change", sync);
    // Also sync on mount in case of autofill
    const timer = setTimeout(sync, 100);
    return () => {
      input.removeEventListener("input", sync);
      input.removeEventListener("change", sync);
      clearTimeout(timer);
    };
  }, []);

  // Derived
  const hasBlockedIncome = blockedIncomes.size > 0;

  const isStepValid = (() => {
    switch (currentStep) {
      case 1:
        return validateIrdNumber(irdNumber);
      case 2:
        return isCompanyOrPartner === false; // only "No" is valid to proceed
      case 3:
        return !hasBlockedIncome; // valid only if no blocked income selected
      case 4:
        return selectedIncomeSources.size > 0;
      default:
        return false;
    }
  })();

  // Handlers
  const handleNext = useCallback(() => {
    if (!isStepValid) return;
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, isStepValid]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleToggleBlockedIncome = useCallback((label: string) => {
    setBlockedIncomes((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }, []);

  const handleToggleIncomeSource = useCallback((source: IncomeSource) => {
    setSelectedIncomeSources((prev) => {
      const next = new Set(prev);
      if (next.has(source)) {
        next.delete(source);
      } else {
        next.add(source);
      }
      return next;
    });
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data: OnboardingData = {
        irdNumber,
        isCompanyOrPartner: isCompanyOrPartner ?? false,
        hasBlockedIncome,
        selectedIncomeSources: Array.from(selectedIncomeSources),
      };
      localStorage.setItem("taxcode-onboarding", JSON.stringify(data));
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding failed:", error);
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-sidebar p-12">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
            <span className="text-xl font-bold text-primary-foreground">TC</span>
          </div>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-sidebar-foreground">
            Welcome to TaxCode
          </h1>
          <p className="mt-3 text-base text-sidebar-foreground/70 leading-relaxed">
            Let&apos;s set up your tax profile. This will help us determine your filing eligibility.
          </p>
        </div>

        {/* Step indicators */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-sidebar-foreground/50 uppercase tracking-wider">
            Progress
          </p>
          <ul className="space-y-3">
            {STEPS.map((step) => (
              <li
                key={step.id}
                className={`flex items-center gap-3 text-sm transition-colors ${
                  step.id === currentStep
                    ? "text-sidebar-foreground font-medium"
                    : step.id < currentStep
                    ? "text-green-500"
                    : "text-sidebar-foreground/40"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    step.id === currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.id < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-sidebar-foreground/20 text-sidebar-foreground/60"
                  }`}
                >
                  {step.id < currentStep ? "✓" : step.id}
                </span>
                {step.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-xl space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="text-base font-bold text-primary-foreground">TC</span>
            </div>
            <span className="text-xl font-semibold text-foreground">TaxCode</span>
          </div>

          {/* Step title */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of 4
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {STEPS[currentStep - 1].label}
            </h2>
          </div>

          {/* ========== STEP 1: IRD Number ========== */}
          {currentStep === 1 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label htmlFor="irdNumber" className="block text-sm font-medium text-foreground">
                  IRD Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <input
                    ref={irdRef}
                    id="irdNumber"
                    value={irdNumber}
                    onChange={(e) => setIrdNumber(e.target.value)}
                    onBlur={() => setIrdBlurred(true)}
                    placeholder="123-456-789"
                    className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {irdBlurred && irdNumber && !validateIrdNumber(irdNumber) && (
                  <p className="mt-1 text-xs text-red-500">
                    IRD number must be in format XXX-XXX-XXX
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Enter your 9-digit IRD number in the format XXX-XXX-XXX
                </p>
              </div>
            </div>
          )}

          {/* ========== STEP 2: Company/Partner Check ========== */}
          {currentStep === 2 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Are you registering as a company or partnership? <span className="text-red-500">*</span>
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  TaxCode currently supports individual tax filing only.
                </p>
                <div className="mt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsCompanyOrPartner(false)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      isCompanyOrPartner === false
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-border/80"
                    }`}
                  >
                    No, I&apos;m an individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCompanyOrPartner(true)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      isCompanyOrPartner === true
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-border text-muted-foreground hover:border-border/80"
                    }`}
                  >
                    Yes, company/partnership
                  </button>
                </div>
              </div>

              {/* Blocked message */}
              {isCompanyOrPartner === true && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      Registration not available
                    </p>
                    <p className="mt-1 text-xs text-red-600">
                      TaxCode currently does not support company or partnership tax filing.
                      You cannot proceed with registration as a company or partnership.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== STEP 3: Income Verification ========== */}
          {currentStep === 3 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Do you have any of the following income types?
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select all that apply. Some income types may affect your eligibility.
                </p>
                <div className="mt-4 space-y-3">
                  {BLOCKED_INCOME_LABELS.map((label) => (
                    <label
                      key={label}
                      className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all ${
                        blockedIncomes.has(label)
                          ? "border-red-400 bg-red-50"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={blockedIncomes.has(label)}
                        onChange={() => handleToggleBlockedIncome(label)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className={`text-sm ${blockedIncomes.has(label) ? "text-red-700 font-medium" : "text-foreground"}`}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Blocked message */}
              {hasBlockedIncome && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      Registration not available
                    </p>
                    <p className="mt-1 text-xs text-red-600">
                      TaxCode currently does not support filing with the following income types:{" "}
                      {Array.from(blockedIncomes).join(", ")}.
                      You cannot proceed with registration.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== STEP 4: Income Sources ========== */}
          {currentStep === 4 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Select your income sources <span className="text-red-500">*</span>
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select all that apply. Choose at least one income source.
                </p>
                <div className="mt-4 space-y-2">
                  {INCOME_SOURCE_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all ${
                        selectedIncomeSources.has(option.value)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIncomeSources.has(option.value)}
                        onChange={() => handleToggleIncomeSource(option.value)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className={`text-sm ${selectedIncomeSources.has(option.value) ? "text-primary font-medium" : "text-foreground"}`}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========== Navigation Buttons ========== */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-opacity hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid}
                className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium shadow-soft transition-all ${
                  isStepValid
                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid || isSubmitting}
                className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium shadow-soft transition-all ${
                  isStepValid && !isSubmitting
                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
