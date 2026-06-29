CREATE TYPE "public"."document_status" AS ENUM('pending', 'processing', 'uploaded', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."filing_status" AS ENUM('draft', 'in_progress', 'needs_attention', 'ready_for_review', 'submitted', 'completed', 'rejected', 'error');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'accountant');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"resource_type" varchar(50) NOT NULL,
	"resource_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filing_id" uuid,
	"document_type" varchar(50) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_size" integer NOT NULL,
	"status" "document_status" DEFAULT 'pending' NOT NULL,
	"url" text,
	"uploaded_by" uuid,
	"uploaded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "filing_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filing_id" uuid,
	"section_type" varchar(50) NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb,
	"is_complete" integer DEFAULT 0,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "filings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"tax_year" integer NOT NULL,
	"status" "filing_status" DEFAULT 'draft' NOT NULL,
	"taxpayer_type" varchar(20) DEFAULT 'individual',
	"total_income" integer,
	"total_deductions" integer,
	"estimated_tax" integer,
	"filed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_type" varchar(50) NOT NULL,
	"status" varchar(20) NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"result" jsonb,
	"attempts" integer DEFAULT 0,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text,
	"is_read" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"organization_id" uuid,
	"role" varchar(50) DEFAULT 'member',
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"tax_id" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filing_id" uuid,
	"iras_submission_id" varchar(100),
	"status" varchar(30) DEFAULT 'submitted' NOT NULL,
	"response_data" jsonb,
	"submitted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tax_rule_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tax_year" integer NOT NULL,
	"rule_version" varchar(20) NOT NULL,
	"effective_date" timestamp with time zone NOT NULL,
	"rules_data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone" varchar(20),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"organization_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_filing_id_filings_id_fk" FOREIGN KEY ("filing_id") REFERENCES "public"."filings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "filing_sections" ADD CONSTRAINT "filing_sections_filing_id_filings_id_fk" FOREIGN KEY ("filing_id") REFERENCES "public"."filings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "filings" ADD CONSTRAINT "filings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_records" ADD CONSTRAINT "submission_records_filing_id_filings_id_fk" FOREIGN KEY ("filing_id") REFERENCES "public"."filings"("id") ON DELETE no action ON UPDATE no action;