import { queues, type RecalculationJobData, type ExportJobData, type NotificationJobData, type ReminderJobData, type DocumentProcessingJobData } from "./queue";

// ─── Producers ─────────────────────────────────────────────────────────────────

export const jobProducers = {
  /** Trigger a tax recalculation for a filing */
  async recalculate(data: RecalculationJobData) {
    return queues.recalculation.add("recalculate", data, {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: true,
    });
  },

  /** Generate an export for a filing */
  async generateExport(data: ExportJobData) {
    return queues.export.add("export", data, {
      attempts: 2,
      backoff: { type: "fixed", delay: 5000 },
      removeOnComplete: true,
    });
  },

  /** Send a notification to a user */
  async sendNotification(data: NotificationJobData) {
    return queues.notification.add("notify", data, {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: true,
    });
  },

  /** Schedule a deadline reminder */
  async scheduleReminder(data: ReminderJobData, delayMs: number) {
    return queues.reminder.add("remind", data, {
      delay: delayMs,
      attempts: 2,
      removeOnComplete: true,
    });
  },

  /** Process an uploaded document */
  async processDocument(data: DocumentProcessingJobData) {
    return queues.documentProcessing.add("process", data, {
      attempts: 3,
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: true,
    });
  },
};
