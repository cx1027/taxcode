import { eq } from "drizzle-orm";
import { db } from "../../db";
import { filings, auditLogs } from "../../db/schema";

// ─── Filing State Machine ─────────────────────────────────────────────────────

type FilingStatus =
  | "draft"
  | "in_progress"
  | "needs_attention"
  | "ready_for_review"
  | "submitted"
  | "completed"
  | "rejected"
  | "error";

const TRANSITIONS: Record<FilingStatus, FilingStatus[]> = {
  draft: ["in_progress"],
  in_progress: ["needs_attention", "ready_for_review", "draft"],
  needs_attention: ["in_progress", "draft"],
  ready_for_review: ["submitted", "in_progress"],
  submitted: ["completed", "rejected"],
  completed: [],
  rejected: ["draft"],
  error: ["draft"],
};

export function canTransition(from: FilingStatus, to: FilingStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export class FilingStateError extends Error {
  constructor(
    public from: FilingStatus,
    public to: FilingStatus
  ) {
    super(`Cannot transition from "${from}" to "${to}"`);
    this.name = "FilingStateError";
  }
}

export async function transitionFilingStatus(
  filingId: string,
  to: FilingStatus,
  userId: string
): Promise<void> {
  const filing = await db.query.filings.findFirst({
    where: eq(filings.id, filingId),
  });

  if (!filing) {
    throw new Error("Filing not found");
  }

  if (!canTransition(filing.status, to)) {
    throw new FilingStateError(filing.status, to);
  }

  await db
    .update(filings)
    .set({
      status: to,
      updatedAt: new Date().toISOString(),
      ...(to === "submitted" ? { filedAt: new Date().toISOString() } : {}),
    })
    .where(eq(filings.id, filingId));

  // Audit log
  await db.insert(auditLogs).values({
    userId,
    action: "filing.status_changed",
    resourceType: "filing",
    resourceId: filingId,
    metadata: { from: filing.status, to },
  });
}
