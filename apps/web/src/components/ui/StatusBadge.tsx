import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { FilingStatus } from "@taxcode/shared-types";

interface StatusBadgeProps {
  status: FilingStatus;
  className?: string;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<
  FilingStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className:
      "bg-muted text-muted-foreground border border-border",
  },
  in_progress: {
    label: "In Progress",
    className:
      "bg-info/10 text-info border border-info/20",
  },
  needs_attention: {
    label: "Needs Attention",
    className:
      "bg-warning/10 text-warning border border-warning/20",
  },
  ready_for_review: {
    label: "Ready for Review",
    className:
      "bg-primary/10 text-primary border border-primary/20",
  },
  submitted: {
    label: "Submitted",
    className:
      "bg-info/10 text-info border border-info/20",
  },
  completed: {
    label: "Completed",
    className:
      "bg-success/10 text-success border border-success/20",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-destructive/10 text-destructive border border-destructive/20",
  },
  error: {
    label: "Error",
    className:
      "bg-destructive/10 text-destructive border border-destructive/20",
  },
};

export function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
        )}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}

interface DocumentStatusBadgeProps {
  status: "pending" | "processing" | "uploaded" | "verified" | "rejected";
  className?: string;
}

const DOC_STATUS_CONFIG: Record<
  DocumentStatusBadgeProps["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border border-border",
  },
  processing: {
    label: "Processing",
    className: "bg-info/10 text-info border border-info/20",
  },
  uploaded: {
    label: "Uploaded",
    className: "bg-info/10 text-info border border-info/20",
  },
  verified: {
    label: "Verified",
    className: "bg-success/10 text-success border border-success/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border border-destructive/20",
  },
};

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  const config = DOC_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span className="h-2 w-2 rounded-full" aria-hidden="true" />
      {config.label}
    </span>
  );
}
