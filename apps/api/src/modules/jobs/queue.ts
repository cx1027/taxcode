import { Queue, Worker, type ConnectionOptions, type Job } from "bullmq";
import IORedis from "ioredis";
import { env } from "../../config";

// ─── Connection ───────────────────────────────────────────────────────────────

const connection: ConnectionOptions = {
  host: new URL(env.REDIS_URL).hostname,
  port: Number(new URL(env.REDIS_URL).port) || 6379,
  password: new URL(env.REDIS_URL).password || undefined,
  maxRetriesPerRequest: null,
};

export const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// ─── Queue Names ───────────────────────────────────────────────────────────────

export const QUEUE_NAMES = {
  RECALCULATION: "filing-recalculation",
  EXPORT: "filing-export",
  NOTIFICATION: "notification",
  REMINDER: "deadline-reminder",
  DOCUMENT_PROCESSING: "document-processing",
} as const;

// ─── Job Types ────────────────────────────────────────────────────────────────

export type JobType =
  | "filing-recalculation"
  | "filing-export"
  | "notification"
  | "deadline-reminder"
  | "document-processing";

export interface RecalculationJobData {
  filingId: string;
  userId: string;
}

export interface ExportJobData {
  filingId: string;
  format: "pdf" | "csv";
}

export interface NotificationJobData {
  userId: string;
  type: string;
  title: string;
  message: string;
}

export interface ReminderJobData {
  filingId: string;
  userId: string;
  deadline: string;
}

export interface DocumentProcessingJobData {
  documentId: string;
  filingId: string;
}

// ─── Queue Definitions ─────────────────────────────────────────────────────────

export const queues = {
  recalculation: new Queue<RecalculationJobData>(QUEUE_NAMES.RECALCULATION, { connection }),
  export: new Queue<ExportJobData>(QUEUE_NAMES.EXPORT, { connection }),
  notification: new Queue<NotificationJobData>(QUEUE_NAMES.NOTIFICATION, { connection }),
  reminder: new Queue<ReminderJobData>(QUEUE_NAMES.REMINDER, { connection }),
  documentProcessing: new Queue<DocumentProcessingJobData>(QUEUE_NAMES.DOCUMENT_PROCESSING, { connection }),
};
