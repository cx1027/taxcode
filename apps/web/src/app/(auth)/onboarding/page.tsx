"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Receipt, AlertTriangle, CheckCircle2, Building2, Briefcase, GraduationCap, Shield, PiggyBank, Heart, Landmark, Link2, CreditCard, FileCheck } from "lucide-react";

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
  // Step 1-4
  irdNumber: string;
  isCompanyOrPartner: boolean;
  hasBlockedIncome: boolean;
  selectedIncomeSources: IncomeSource[];
  // Step 5
  jobTitle: string;
  // Step 6
  needPayWHT: boolean | null;
  // Step 7
  isRegisteredGST: boolean | null;
  gstNumber: string;
  // Step 8
  hasStudentLoan: boolean | null;
  // Step 9
  hasACCLevy: boolean | null;
  // Step 10
  hasKiwiSaver: boolean | null;
  // Step 11
  donations: { charityName: string; isDeductible: boolean }[];
  // Step 12
  irdAuthorityGranted: boolean;
  // Step 13
  bankAuthorityGranted: boolean;
  // Step 14
  identityVerified: boolean;
  identityType: "passport" | "driver_license" | "";
  // Step 15
  agreementAccepted: boolean;
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
  { id: 5, label: "Employment" },
  { id: 6, label: "WHT Check" },
  { id: 7, label: "GST Registration" },
  { id: 8, label: "Student Loan" },
  { id: 9, label: "ACC Levy" },
  { id: 10, label: "KiwiSaver" },
  { id: 11, label: "Donations" },
  { id: 12, label: "IRD Connection" },
  { id: 13, label: "Bank Connection" },
  { id: 14, label: "Identity Verification" },
  { id: 15, label: "Agreement" },
];

// ============================================================
// Helpers
// ============================================================
function validateIrdNumber(value: string): boolean {
  return /^\d{3}-\d{3}-\d{3}$/.test(value.trim());
}

function validateGstNumber(value: string): boolean {
  return /^\d{8,9}$/.test(value.trim());
}

const DEDUCTIBLE_CHARITIES = [
  "Red Cross",
  "Salvation Army",
  "World Vision",
  "UNICEF",
  "Cancer Society",
  "Heart Foundation",
  "SPCA",
  "Habitat for Humanity",
  "Salvation Army",
  "Ronald McDonald House",
  "Make-A-Wish",
  "Starship Foundation",
];

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

  // Step 5 — Job
  const [jobTitle, setJobTitle] = useState("");

  // Step 6 — WHT
  const [needPayWHT, setNeedPayWHT] = useState<boolean | null>(null);

  // Step 7 — GST
  const [isRegisteredGST, setIsRegisteredGST] = useState<boolean | null>(null);
  const [gstNumber, setGstNumber] = useState("");

  // Step 8 — Student Loan
  const [hasStudentLoan, setHasStudentLoan] = useState<boolean | null>(null);

  // Step 9 — ACC Levy
  const [hasACCLevy, setHasACCLevy] = useState<boolean | null>(null);

  // Step 10 — KiwiSaver
  const [hasKiwiSaver, setHasKiwiSaver] = useState<boolean | null>(null);

  // Step 11 — Donations
  const [donationCharityName, setDonationCharityName] = useState("");
  const [donations, setDonations] = useState<{ charityName: string; isDeductible: boolean }[]>([]);

  // Step 12 — IRD Authority
  const [irdAuthorityGranted, setIrdAuthorityGranted] = useState(false);

  // Step 13 — Bank Authority
  const [bankAuthorityGranted, setBankAuthorityGranted] = useState(false);

  // Step 14 — Identity
  const [identityType, setIdentityType] = useState<"passport" | "driver_license" | "">("");
  const [identityVerified, setIdentityVerified] = useState(false);

  // Step 15 — Agreement
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  // Sync IRD input value with state
  useEffect(() => {
    const input = irdRef.current;
    if (!input) return;
    const sync = () => {
      const val = input.value;
      setIrdNumber((prev) => (prev !== val ? val : prev));
    };
    input.addEventListener("input", sync);
    input.addEventListener("change", sync);
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
        return isCompanyOrPartner === false;
      case 3:
        return !hasBlockedIncome;
      case 4:
        return selectedIncomeSources.size > 0;
      case 5:
        return jobTitle.trim().length > 0;
      case 6:
        return needPayWHT !== null;
      case 7:
        if (isRegisteredGST === true) return validateGstNumber(gstNumber);
        return isRegisteredGST === false;
      case 8:
        return hasStudentLoan !== null;
      case 9:
        return hasACCLevy !== null;
      case 10:
        return hasKiwiSaver !== null;
      case 11:
        return true; // donations optional
      case 12:
        return irdAuthorityGranted;
      case 13:
        return bankAuthorityGranted;
      case 14:
        return identityVerified && identityType !== "";
      case 15:
        return agreementAccepted;
      default:
        return false;
    }
  })();

  // Handlers
  const handleNext = useCallback(() => {
    if (!isStepValid) return;
    if (currentStep === 15) {
      handleSubmit();
      return;
    }
    setCurrentStep((prev) => prev + 1);
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

  const handleAddDonation = useCallback(() => {
    if (donationCharityName.trim().length === 0) return;
    const isDeductible = DEDUCTIBLE_CHARITIES.some(
      (c) => c.toLowerCase() === donationCharityName.trim().toLowerCase()
    );
    setDonations((prev) => [...prev, { charityName: donationCharityName.trim(), isDeductible }]);
    setDonationCharityName("");
  }, [donationCharityName]);

  const handleRemoveDonation = useCallback((index: number) => {
    setDonations((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data: OnboardingData = {
        irdNumber,
        isCompanyOrPartner: isCompanyOrPartner ?? false,
        hasBlockedIncome,
        selectedIncomeSources: Array.from(selectedIncomeSources),
        jobTitle,
        needPayWHT,
        isRegisteredGST,
        gstNumber,
        hasStudentLoan,
        hasACCLevy,
        hasKiwiSaver,
        donations,
        irdAuthorityGranted,
        bankAuthorityGranted,
        identityVerified,
        identityType,
        agreementAccepted,
      };
      localStorage.setItem("taxcode-onboarding", JSON.stringify(data));
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding failed:", error);
      setIsSubmitting(false);
    }
  };

  const totalSteps = 15;

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[40%] flex-col justify-between bg-sidebar p-10 max-h-screen overflow-y-auto">
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
        <div className="space-y-3 mt-6">
          <p className="text-sm font-medium text-sidebar-foreground/50 uppercase tracking-wider">
            Progress
          </p>
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
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
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${
                    step.id === currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.id < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-sidebar-foreground/20 text-sidebar-foreground/60"
                  }`}
                >
                  {step.id < currentStep ? "✓" : step.id}
                </span>
                <span className="truncate">{step.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-start justify-center p-8 overflow-y-auto max-h-screen">
        <div className="w-full max-w-xl space-y-6 pb-8">
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
              Step {currentStep} of {totalSteps}
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
                  <p className="mt-1 text-xs text-red-500">IRD number must be in format XXX-XXX-XXX</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">Enter your 9-digit IRD number in the format XXX-XXX-XXX</p>
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
                <p className="mt-1 text-xs text-muted-foreground">TaxCode currently supports individual tax filing only.</p>
                <div className="mt-4 flex gap-4">
                  <button type="button" onClick={() => setIsCompanyOrPartner(false)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${isCompanyOrPartner === false ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    No, I&apos;m an individual
                  </button>
                  <button type="button" onClick={() => setIsCompanyOrPartner(true)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${isCompanyOrPartner === true ? "border-red-500 bg-red-50 text-red-600" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    Yes, company/partnership
                  </button>
                </div>
              </div>
              {isCompanyOrPartner === true && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Registration not available</p>
                    <p className="mt-1 text-xs text-red-600">TaxCode currently does not support company or partnership tax filing. You cannot proceed with registration as a company or partnership.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== STEP 3: Income Verification ========== */}
          {currentStep === 3 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Do you have any of the following income types?</label>
                <p className="mt-1 text-xs text-muted-foreground">Select all that apply. Some income types may affect your eligibility.</p>
                <div className="mt-4 space-y-3">
                  {BLOCKED_INCOME_LABELS.map((label) => (
                    <label key={label} className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all ${blockedIncomes.has(label) ? "border-red-400 bg-red-50" : "border-border hover:border-border/80"}`}>
                      <input type="checkbox" checked={blockedIncomes.has(label)} onChange={() => handleToggleBlockedIncome(label)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <span className={`text-sm ${blockedIncomes.has(label) ? "text-red-700 font-medium" : "text-foreground"}`}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {hasBlockedIncome && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Registration not available</p>
                    <p className="mt-1 text-xs text-red-600">TaxCode currently does not support filing with the following income types: {Array.from(blockedIncomes).join(", ")}. You cannot proceed with registration.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== STEP 4: Income Sources ========== */}
          {currentStep === 4 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Select your income sources <span className="text-red-500">*</span></label>
                <p className="mt-1 text-xs text-muted-foreground">Select all that apply. Choose at least one income source.</p>
                <div className="mt-4 space-y-2">
                  {INCOME_SOURCE_OPTIONS.map((option) => (
                    <label key={option.value} className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all ${selectedIncomeSources.has(option.value) ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
                      <input type="checkbox" checked={selectedIncomeSources.has(option.value)} onChange={() => handleToggleIncomeSource(option.value)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <span className={`text-sm ${selectedIncomeSources.has(option.value) ? "text-primary font-medium" : "text-foreground"}`}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========== STEP 5: Enter your job ========== */}
          {currentStep === 5 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-foreground">What is your job title? <span className="text-red-500">*</span></label>
                <div className="mt-1 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Software Engineer, Teacher, Accountant" className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Enter your current job title or occupation.</p>
              </div>
            </div>
          )}

          {/* ========== STEP 6: Check if need pay WHT ========== */}
          {currentStep === 6 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Do you need to pay Withholding Tax (WHT)? <span className="text-red-500">*</span></label>
                <p className="mt-1 text-xs text-muted-foreground">WHT applies if you receive income that requires withholding tax deductions (e.g. contractor income, certain investment income).</p>
                <div className="mt-4 flex gap-4">
                  <button type="button" onClick={() => setNeedPayWHT(true)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${needPayWHT === true ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    Yes, I need to pay WHT
                  </button>
                  <button type="button" onClick={() => setNeedPayWHT(false)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${needPayWHT === false ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    No, I don&apos;t
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========== STEP 7: If Registered GST ========== */}
          {currentStep === 7 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Are you registered for GST? <span className="text-red-500">*</span></label>
                <p className="mt-1 text-xs text-muted-foreground">GST registration is required if your annual turnover exceeds $60,000.</p>
                <div className="mt-4 flex gap-4">
                  <button type="button" onClick={() => setIsRegisteredGST(true)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${isRegisteredGST === true ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    Yes
                  </button>
                  <button type="button" onClick={() => { setIsRegisteredGST(false); setGstNumber(""); }}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${isRegisteredGST === false ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    No
                  </button>
                </div>
                {isRegisteredGST === true && (
                  <div className="mt-4">
                    <label htmlFor="gstNumber" className="block text-sm font-medium text-foreground">GST Number <span className="text-red-500">*</span></label>
                    <div className="mt-1 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <input id="gstNumber" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="123456789" className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    {gstNumber && !validateGstNumber(gstNumber) && (
                      <p className="mt-1 text-xs text-red-500">GST number must be 8-9 digits</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== STEP 8: Student Loan ========== */}
          {currentStep === 8 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Do you have a student loan? <span className="text-red-500">*</span></label>
                <p className="mt-1 text-xs text-muted-foreground">If you have a student loan, repayments will be deducted from your salary at a rate of 12%.</p>
                <div className="mt-4 flex gap-4">
                  <button type="button" onClick={() => setHasStudentLoan(true)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${hasStudentLoan === true ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    <GraduationCap className="h-4 w-4 inline mr-2" />
                    Yes, I have a student loan
                  </button>
                  <button type="button" onClick={() => setHasStudentLoan(false)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${hasStudentLoan === false ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    No, I don&apos;t
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========== STEP 9: ACC Levy ========== */}
          {currentStep === 9 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Do you pay ACC Earners&apos; Levy? <span className="text-red-500">*</span></label>
                <p className="mt-1 text-xs text-muted-foreground">The ACC Earners&apos; Levy covers non-work injuries and is automatically deducted from your income (1.6%).</p>
                <div className="mt-4 flex gap-4">
                  <button type="button" onClick={() => setHasACCLevy(true)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${hasACCLevy === true ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    <Shield className="h-4 w-4 inline mr-2" />
                    Yes, I pay ACC levy
                  </button>
                  <button type="button" onClick={() => setHasACCLevy(false)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${hasACCLevy === false ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    No, I don&apos;t
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========== STEP 10: KiwiSaver ========== */}
          {currentStep === 10 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Do you have a KiwiSaver account? <span className="text-red-500">*</span></label>
                <p className="mt-1 text-xs text-muted-foreground">KiwiSaver is a voluntary retirement savings scheme with employer and government contributions.</p>
                <div className="mt-4 flex gap-4">
                  <button type="button" onClick={() => setHasKiwiSaver(true)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${hasKiwiSaver === true ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    <PiggyBank className="h-4 w-4 inline mr-2" />
                    Yes, I have KiwiSaver
                  </button>
                  <button type="button" onClick={() => setHasKiwiSaver(false)}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${hasKiwiSaver === false ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    No, I don&apos;t
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========== STEP 11: Donation ========== */}
          {currentStep === 11 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Have you made any charitable donations?</label>
                <p className="mt-1 text-xs text-muted-foreground">Donations to approved charities may be tax deductible. Enter charity names below.</p>
                <div className="mt-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <input value={donationCharityName} onChange={(e) => setDonationCharityName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddDonation(); } }} placeholder="Enter charity name (e.g. Red Cross)" className="flex-1 rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <button type="button" onClick={handleAddDonation} disabled={donationCharityName.trim().length === 0}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
                    Add
                  </button>
                </div>
                {donations.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {donations.map((d, i) => (
                      <div key={i} className={`flex items-center justify-between rounded-lg border px-4 py-3 ${d.isDeductible ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
                        <div className="flex items-center gap-2">
                          <Heart className={`h-4 w-4 ${d.isDeductible ? "text-green-500" : "text-yellow-500"}`} />
                          <span className="text-sm text-foreground">{d.charityName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${d.isDeductible ? "text-green-600" : "text-yellow-600"}`}>
                            {d.isDeductible ? "✓ Tax Deductible" : "✗ Not Deductible"}
                          </span>
                          <button type="button" onClick={() => handleRemoveDonation(i)} className="text-xs text-muted-foreground hover:text-red-500">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {donationCharityName && !DEDUCTIBLE_CHARITIES.some(c => c.toLowerCase() === donationCharityName.trim().toLowerCase()) && (
                  <p className="mt-2 text-xs text-yellow-600">⚠ This charity may not be on the IRD approved list. You can still add it but it may not be tax deductible.</p>
                )}
              </div>
            </div>
          )}

          {/* ========== STEP 12: Authority to Connect IRD ========== */}
          {currentStep === 12 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Authority to Act — Connect to IRD <span className="text-red-500">*</span></label>
                <p className="mt-1 text-xs text-muted-foreground">We need your permission to connect to IRD on your behalf. This allows us to automatically collect information about your student loan, ACC, and KiwiSaver.</p>
                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                  <Landmark className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-700">IRD API Integration</p>
                    <p className="mt-1 text-xs text-blue-600">By granting authority, we will securely connect to IRD to retrieve: student loan balance, ACC levy status, KiwiSaver details, and income information reported by your employer.</p>
                  </div>
                </div>
                <label className="mt-4 flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={irdAuthorityGranted} onChange={(e) => setIrdAuthorityGranted(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-foreground">I grant TaxCode authority to connect to IRD on my behalf</span>
                </label>
              </div>
            </div>
          )}

          {/* ========== STEP 13: Authority to Connect Bank ========== */}
          {currentStep === 13 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Authority to Act — Connect to Bank Account <span className="text-red-500">*</span></label>
                <p className="mt-1 text-xs text-muted-foreground">We use Open Banking to securely connect to your bank account(s). This helps us verify income and transactions for accurate tax filing.</p>
                <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4 flex items-start gap-3">
                  <Link2 className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-700">OpenBank API Integration</p>
                    <p className="mt-1 text-xs text-purple-600">We support multiple bank accounts. Your banking credentials are never stored — we use secure Open Banking APIs to read transaction data.</p>
                  </div>
                </div>
                <label className="mt-4 flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={bankAuthorityGranted} onChange={(e) => setBankAuthorityGranted(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-foreground">I grant TaxCode authority to connect to my bank account(s) via Open Banking</span>
                </label>
              </div>
            </div>
          )}

          {/* ========== STEP 14: Verify Identity ========== */}
          {currentStep === 14 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Verify Your Identity <span className="text-red-500">*</span></label>
                <p className="mt-1 text-xs text-muted-foreground">Please select an identity document type to verify your identity.</p>
                <div className="mt-4 space-y-3">
                  <label className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all ${identityType === "passport" ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
                    <input type="radio" name="identityType" checked={identityType === "passport"} onChange={() => { setIdentityType("passport"); setIdentityVerified(true); }} className="h-4 w-4 text-primary focus:ring-primary" />
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-foreground font-medium">Passport</span>
                      <p className="text-xs text-muted-foreground">NZ or foreign passport</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all ${identityType === "driver_license" ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
                    <input type="radio" name="identityType" checked={identityType === "driver_license"} onChange={() => { setIdentityType("driver_license"); setIdentityVerified(true); }} className="h-4 w-4 text-primary focus:ring-primary" />
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-foreground font-medium">Driver License</span>
                      <p className="text-xs text-muted-foreground">NZ full or restricted license</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========== STEP 15: 免责条款 ========== */}
          {currentStep === 15 && (
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Terms & Disclaimer <span className="text-red-500">*</span></label>
                <div className="mt-3 rounded-lg border border-border bg-surface p-4 max-h-[300px] overflow-y-auto space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <p className="font-medium text-foreground">Income and Expense Disclaimer</p>
                  <p>The income and expense details provided in this application are for reference only. We use disclaimers and other income/expense controls to manage risk.</p>
                  <p className="font-medium text-foreground">Risk Controls</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Missing details: Use disclaimers to control risk</li>
                    <li>Missing accounts: Use disclaimers to control risk</li>
                    <li>Under-reported income types: Use disclaimers to control risk</li>
                  </ul>
                  <p className="font-medium text-foreground">Software Limitations</p>
                  <p>We&apos;ll automatically fetch your PAYE/Salary income from IRD once your employer reports it. If you see it in MyIR but not in our App, just reach out to us.</p>
                  <p className="font-medium text-foreground">Data Accuracy</p>
                  <p>While we strive to ensure all data is accurate and up-to-date, TaxCode is not responsible for any discrepancies between the information displayed and actual IRD records. Always verify with your IRD MyIR account for official records.</p>
                  <p className="font-medium text-foreground">Limitation of Liability</p>
                  <p>TaxCode shall not be held liable for any tax filing errors, penalties, or additional tax liabilities arising from incomplete or inaccurate information provided by the user or third-party data sources.</p>
                </div>
                <label className="mt-4 flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreementAccepted} onChange={(e) => setAgreementAccepted(e.target.checked)} className="h-4 w-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-foreground">I have read and agree to the Terms & Disclaimer above <span className="text-red-500">*</span></span>
                </label>
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

            {currentStep < totalSteps ? (
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
