import { cn } from "@/lib/utils";
import type { FilingStatus } from "@/lib/schemas/filing";
import {
  FileEdit,
  Loader2,
  AlertTriangle,
  Eye,
  Send,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  type LucideIcon,
} from "lucide-react";

interface FilingStatusBadgeProps {
  status: FilingStatus;
  className?: string;
  size?: "sm" | "md";
}

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  className: string;
  iconClassName?: string;
}

const STATUS_CONFIG: Record<FilingStatus, StatusConfig> = {
  draft: {
    label: "Draft",
    icon: FileEdit,
    className: "bg-muted text-muted-foreground border border-border",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    className: "bg-info/10 text-info border border-info/20",
    iconClassName: "animate-spin",
  },
  needs_attention: {
    label: "Needs Attention",
    icon: AlertTriangle,
    className: "bg-warning/10 text-warning border border-warning/20",
  },
  ready_for_review: {
    label: "Ready for Review",
    icon: Eye,
    className: "bg-primary/10 text-primary border border-primary/20",
  },
  submitted: {
    label: "Submitted",
    icon: Send,
    className: "bg-info/10 text-info border border-info/20",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border border-success/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border border-destructive/20",
  },
  error: {
    label: "Error",
    icon: AlertOctagon,
    className: "bg-destructive/10 text-destructive border border-destructive/20",
  },
};

export function FilingStatusBadge({
  status,
  className,
  size = "md",
}: FilingStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.className,
        className
      )}
    >
      <Icon
        className={cn(
          size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
          config.iconClassName
        )}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}

/** All status options for filter dropdowns */
export const ALL_FILING_STATUSES: FilingStatus[] = [
  "draft",
  "in_progress",
  "needs_attention",
  "ready_for_review",
  "submitted",
  "completed",
  "rejected",
  "error",
];

export function getStatusLabel(status: FilingStatus): string {
  return STATUS_CONFIG[status].label;
}
