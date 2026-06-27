import { z } from "zod";

// ─── Personal Information ─────────────────────────────────────────────────────

export const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  irdNumber: z
    .string()
    .min(1, "IRD number is required")
    .regex(/^\d{3}-\d{3}-\d{3}$/, "IRD number must be in format XXX-XXX-XXX"),
  taxYear: z
    .number()
    .int()
    .min(2000)
    .max(2099),
  address: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional().default(""),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP code is required"),
  }),
});

export type PersonalInfoInput = z.infer<typeof PersonalInfoSchema>;

// ─── Income Details ───────────────────────────────────────────────────────────

export const IncomeSchema = z.object({
  w2Income: z.number().min(0, "Cannot be negative").default(0),
  income1099: z.number().min(0, "Cannot be negative").default(0),
  otherIncome: z.number().min(0, "Cannot be negative").default(0),
  interestIncome: z.number().min(0, "Cannot be negative").default(0),
  dividendIncome: z.number().min(0, "Cannot be negative").default(0),
});

export type IncomeInput = z.infer<typeof IncomeSchema>;

// ─── Deductions ───────────────────────────────────────────────────────────────

export const DeductionsSchema = z.object({
  deductionType: z.enum(["standard", "itemized"]).default("standard"),
  healthcareExpenses: z.number().min(0).default(0),
  stateLocalTax: z.number().min(0).default(0),
  charitableContributions: z.number().min(0).default(0),
  mortgageInterest: z.number().min(0).default(0),
  studentLoanInterest: z.number().min(0).default(0),
});

export type DeductionsInput = z.infer<typeof DeductionsSchema>;

// ─── Full Filing Input (merged) ───────────────────────────────────────────────

export const FilingInputSchema = PersonalInfoSchema.extend(
  IncomeSchema.shape
).extend(DeductionsSchema.shape);

export type FilingInput = z.infer<typeof FilingInputSchema>;

// ─── Tax Summary (mock engine output) ─────────────────────────────────────────

export const TaxSummarySchema = z.object({
  filingId: z.string(),
  taxableIncome: z.number(),
  taxLiability: z.number(),
  effectiveRate: z.number(),
  warnings: z.array(z.string()),
  breakdowns: z.array(
    z.object({
      label: z.string(),
      amount: z.number(),
    })
  ),
});

export type TaxSummary = z.infer<typeof TaxSummarySchema>;

// ─── Mock document type ───────────────────────────────────────────────────────

export type DocumentType = "W-2" | "1099" | "1098" | "Receipt" | "ID" | "Other";

export interface MockDocument {
  id: string;
  filingId: string;
  filingName?: string;
  fileName: string;
  documentType: DocumentType;
  size: number;
  status: DocumentStatus;
  uploadedAt: string;
  url?: string | null;
}

// DocumentStatus type (defined locally to avoid circular dependency)
export type DocumentStatus = "pending" | "processing" | "uploaded" | "verified" | "rejected";

// ─── Mock data types ──────────────────────────────────────────────────────────

export interface MockFiling {
  id: string;
  name: string;
  taxYear: number;
  status: FilingStatus;
  dueDate: string;
  updatedAt: string;
  progress?: number;
  amountOwed?: number;
  refund?: number;
  taxpayerType?: "individual" | "business";
}

// FilingStatus type (defined locally to avoid circular dependency)
export type FilingStatus = "draft" | "in_progress" | "needs_attention" | "ready_for_review" | "submitted" | "completed" | "rejected" | "error";

// ─── Step identifiers ─────────────────────────────────────────────────────────

export const STEPS = ["personal-info", "income", "deductions", "review"] as const;
export type StepId = (typeof STEPS)[number];

export const STEP_LABELS: Record<StepId, string> = {
  "personal-info": "Personal Info",
  income: "Income",
  deductions: "Deductions",
  review: "Review",
};
