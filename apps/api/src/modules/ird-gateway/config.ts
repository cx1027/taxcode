import { z } from "zod";

// ─── IRD API Config ───────────────────────────────────────────────────────────

const irdEnvSchema = z.object({
  IRD_API_URL: z.string().default("https://sandbox.ird.govt.nz/api/v2"),
  IRD_CLIENT_ID: z.string().default(""),
  IRD_CLIENT_SECRET: z.string().default(""),
  IRD_API_KEY: z.string().default(""),
  IRD_WEBHOOK_SECRET: z.string().default(""),
  IRD_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
});

const parsed = irdEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid IRD environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const irdEnv = parsed.data;

// ─── IRD API Response Types ───────────────────────────────────────────────────

export interface IRDAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IRDSubmitResponse {
  submission_id: string;
  status: "accepted" | "rejected" | "processing";
  message?: string;
}

export interface IRDStatusResponse {
  submission_id: string;
  status: "submitted" | "processing" | "accepted" | "rejected" | "notice_received";
  status_date: string;
  notice_number?: string;
  rejection_reason?: string;
}

export interface IRDNoticeResponse {
  notice_number: string;
  type: string;
  issued_date: string;
  description: string;
  amount?: number;
}

export interface IRDDocumentUploadResponse {
  document_id: string;
  status: "uploaded" | "processing" | "verified" | "rejected";
  message?: string;
}
