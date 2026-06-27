import { pgTable, uuid, varchar, text, integer, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["user", "admin", "accountant"]);
export const filingStatusEnum = pgEnum("filing_status", [
  "draft",
  "in_progress",
  "needs_attention",
  "ready_for_review",
  "submitted",
  "completed",
  "rejected",
  "error",
]);
export const documentStatusEnum = pgEnum("document_status", [
  "pending",
  "processing",
  "uploaded",
  "verified",
  "rejected",
]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  role: userRoleEnum("role").default("user").notNull(),
  organizationId: uuid("organization_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Organizations ────────────────────────────────────────────────────────────

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  taxId: varchar("tax_id", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Organization Members ─────────────────────────────────────────────────────

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  role: varchar("role", { length: 50 }).default("member"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Filings ──────────────────────────────────────────────────────────────────

export const filings = pgTable("filings", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  taxYear: integer("tax_year").notNull(),
  status: filingStatusEnum("status").default("draft").notNull(),
  taxpayerType: varchar("taxpayer_type", { length: 20 }).default("individual"),
  totalIncome: integer("total_income"),
  totalDeductions: integer("total_deductions"),
  estimatedTax: integer("estimated_tax"),
  filedAt: timestamp("filed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Filing Sections ──────────────────────────────────────────────────────────

export const filingSections = pgTable("filing_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  filingId: uuid("filing_id").references(() => filings.id),
  sectionType: varchar("section_type", { length: 50 }).notNull(),
  data: jsonb("data").default({}),
  isComplete: integer("is_complete").default(0),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

// ─── Documents ────────────────────────────────────────────────────────────────

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  filingId: uuid("filing_id").references(() => filings.id),
  documentType: varchar("document_type", { length: 50 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size").notNull(),
  status: documentStatusEnum("status").default("pending").notNull(),
  url: text("url"),
  uploadedBy: uuid("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Submission Records ────────────────────────────────────────────────────────

export const submissionRecords = pgTable("submission_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  filingId: uuid("filing_id").references(() => filings.id),
  irasSubmissionId: varchar("iras_submission_id", { length: 100 }),
  status: varchar("status", { length: 30 }).notNull().default("submitted"),
  responseData: jsonb("response_data"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id"),
  userId: uuid("user_id"),
  action: varchar("action", { length: 100 }).notNull(),
  resourceType: varchar("resource_type", { length: 50 }).notNull(),
  resourceId: uuid("resource_id"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  isRead: integer("is_read").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Job Runs ─────────────────────────────────────────────────────────────────

export const jobRuns = pgTable("job_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobType: varchar("job_type", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  payload: jsonb("payload").default({}),
  result: jsonb("result"),
  attempts: integer("attempts").default(0),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Tax Rule Versions ────────────────────────────────────────────────────────

export const taxRuleVersions = pgTable("tax_rule_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  taxYear: integer("tax_year").notNull(),
  ruleVersion: varchar("rule_version", { length: 20 }).notNull(),
  effectiveDate: timestamp("effective_date", { withTimezone: true }).notNull(),
  rulesData: jsonb("rules_data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
