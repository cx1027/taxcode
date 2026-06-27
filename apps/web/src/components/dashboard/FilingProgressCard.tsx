"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MOCK_FILINGS } from "@/lib/mock-data";
import type { FilingStatus } from "@/lib/schemas/filing";

const STATUS_STEP_ORDER: FilingStatus[] = [
  "draft",
  "in_progress",
  "needs_attention",
  "ready_for_review",
  "submitted",
  "completed",
];

const STATUS_STEP_CONFIG: Record<
  FilingStatus,
  { label: string; icon: typeof CheckCircle2; color: string }
> = {
  draft: {
    label: "Draft",
    icon: Clock,
    color: "bg-muted text-muted-foreground",
  },
  in_progress: {
    label: "In Progress",
    icon: Clock,
    color: "bg-info/10 text-info",
  },
  needs_attention: {
    label: "Needs Attention",
    icon: AlertCircle,
    color: "bg-warning/10 text-warning",
  },
  ready_for_review: {
    label: "Ready for Review",
    icon: CheckCircle2,
    color: "bg-primary/10 text-primary",
  },
  submitted: {
    label: "Submitted",
    icon: CheckCircle2,
    color: "bg-info/10 text-info",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "bg-success/10 text-success",
  },
  rejected: {
    label: "Rejected",
    icon: AlertCircle,
    color: "bg-destructive/10 text-destructive",
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    color: "bg-destructive/10 text-destructive",
  },
};

function FilingProgressRow({ filing }: { filing: (typeof MOCK_FILINGS)[0] }) {
  const currentStep = STATUS_STEP_ORDER.indexOf(filing.status);
  const config = STATUS_STEP_CONFIG[filing.status];
  const Icon = config.icon;

  const monetaryDisplay =
    filing.refund
      ? `+$${filing.refund.toLocaleString()}`
      : filing.amountOwed
      ? `-$${filing.amountOwed.toLocaleString()}`
      : null;

  return (
    <Link
            href={`/filings/${filing.id}`}
      className="flex items-center gap-md rounded-lg border border-border bg-card p-md transition-all hover:border-primary/20 hover:shadow-soft-sm"
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-surface-subtle">
        <Icon className={cn("h-4 w-4", config.color.replace("bg-", "text-"))} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{filing.name}</p>
        <div className="mt-xs flex items-center gap-sm">
          <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-border">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
              style={{ width: `${filing.progress ?? 0}%` }}
            />
          </div>
          <span className="text-xs text-text-muted">{filing.progress ?? 0}%</span>
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-col items-end gap-xs">
        <StatusBadge status={filing.status} size="sm" />
        {monetaryDisplay && (
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              filing.refund ? "text-success" : "text-destructive"
            )}
          >
            {monetaryDisplay}
          </span>
        )}
        <ArrowRight className="h-3 w-3 text-text-muted" />
      </div>
    </Link>
  );
}

export function FilingProgressCard() {
  const activeFilings = MOCK_FILINGS.filter(
    (f) => f.status !== "completed" && f.status !== "rejected"
  );

  return (
    <div className="rounded-card border border-border bg-card p-lg">
      <div className="mb-md flex items-center justify-between">
        <h2 className="text-card-title text-foreground">Filing Progress</h2>
        <Link
          href="/filings"
          className="text-status flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="flex flex-col gap-sm">
        {activeFilings.map((filing) => (
          <FilingProgressRow key={filing.id} filing={filing} />
        ))}
      </div>
    </div>
  );
}
