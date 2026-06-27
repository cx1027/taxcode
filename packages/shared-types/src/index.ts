import { z } from "zod";

// ─── Auth ───────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

// ─── User ────────────────────────────────────────────────────────────────────

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  organizationId: z.string().nullable(),
  role: z.enum(["user", "admin", "accountant"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UpdateUserSchema = UserSchema.partial();

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

// ─── Organization ────────────────────────────────────────────────────────────

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  taxId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── Filing ─────────────────────────────────────────────────────────────────

export const FilingStatusEnum = z.enum([
  "draft",
  "in_progress",
  "needs_attention",
  "ready_for_review",
  "submitted",
  "completed",
  "rejected",
  "error",
]);

export const FilingSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  taxYear: z.number(),
  status: FilingStatusEnum,
  taxpayerType: z.enum(["individual", "business"]),
  totalIncome: z.number().nullable(),
  totalDeductions: z.number().nullable(),
  estimatedTax: z.number().nullable(),
  filedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateFilingSchema = z.object({
  taxYear: z.number(),
  taxpayerType: z.enum(["individual", "business"]),
});

export const UpdateFilingSchema = z.object({
  status: FilingStatusEnum.optional(),
  totalIncome: z.number().nullable().optional(),
  totalDeductions: z.number().nullable().optional(),
  estimatedTax: z.number().nullable().optional(),
});

// ─── Filing Input ────────────────────────────────────────────────────────────

export const IncomeInputSchema = z.object({
  code: z.string(),
  description: z.string().optional(),
  amount: z.number(),
  source: z.string().optional(),
});

export const DeductionInputSchema = z.object({
  code: z.string(),
  description: z.string().optional(),
  amount: z.number(),
});

// ─── Document ────────────────────────────────────────────────────────────────

export const DocumentStatusEnum = z.enum([
  "pending",
  "processing",
  "uploaded",
  "verified",
  "rejected",
]);

export const DocumentSchema = z.object({
  id: z.string(),
  filingId: z.string(),
  name: z.string(),
  type: z.string(),
  size: z.number(),
  status: DocumentStatusEnum,
  url: z.string().nullable(),
  uploadedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UploadDocumentSchema = z.object({
  filingId: z.string(),
  type: z.string(),
  name: z.string(),
  size: z.number(),
});

// ─── Tax Engine ─────────────────────────────────────────────────────────────

export const TaxInputSchema = z.object({
  filing_id: z.string(),
  tax_year: z.number(),
  income: z.number(),
  deductions: z.array(DeductionInputSchema),
  taxpayer_type: z.enum(["individual", "business"]),
});

export const TaxBreakdownSchema = z.object({
  label: z.string(),
  amount: z.number(),
});

export const TaxOutputSchema = z.object({
  filing_id: z.string(),
  taxable_income: z.number(),
  tax_liability: z.number(),
  effective_rate: z.number(),
  warnings: z.array(z.string()),
  breakdowns: z.array(TaxBreakdownSchema),
});

export const ValidationIssueSchema = z.object({
  field: z.string(),
  code: z.string(),
  message: z.string(),
  severity: z.enum(["error", "warning", "info"]),
});

export const ValidationResultSchema = z.object({
  filing_id: z.string(),
  valid: z.boolean(),
  issues: z.array(ValidationIssueSchema),
});

// ─── Job ─────────────────────────────────────────────────────────────────────

export const JobStatusEnum = z.enum([
  "waiting",
  "active",
  "completed",
  "failed",
  "delayed",
]);

export const JobSchema = z.object({
  id: z.string(),
  type: z.string(),
  status: JobStatusEnum,
  data: z.record(z.unknown()),
  result: z.record(z.unknown()).nullable(),
  attempts: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── API Response Wrappers ───────────────────────────────────────────────────

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    error: z.string().nullable(),
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  });

// ─── Type Exports ────────────────────────────────────────────────────────────

export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type User = z.infer<typeof UserSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type FilingStatus = z.infer<typeof FilingStatusEnum>;
export type Filing = z.infer<typeof FilingSchema>;
export type CreateFiling = z.infer<typeof CreateFilingSchema>;
export type UpdateFiling = z.infer<typeof UpdateFilingSchema>;
export type IncomeInput = z.infer<typeof IncomeInputSchema>;
export type DeductionInput = z.infer<typeof DeductionInputSchema>;
export type DocumentStatus = z.infer<typeof DocumentStatusEnum>;
export type Document = z.infer<typeof DocumentSchema>;
export type TaxInput = z.infer<typeof TaxInputSchema>;
export type TaxOutput = z.infer<typeof TaxOutputSchema>;
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type JobStatus = z.infer<typeof JobStatusEnum>;
export type Job = z.infer<typeof JobSchema>;
