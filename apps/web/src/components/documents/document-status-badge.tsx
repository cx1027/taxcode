"use client";

import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/lib/schemas/filing";
import {
  Clock,
  Upload,
  CheckCircle2,
  AlertCircle,
  XCircle,
  type LucideIcon,
} from "lucide-react";

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
  size?: "sm" | "md";
}

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  className: string;
}

const STATUS_CONFIG: Record<DocumentStatus, StatusConfig> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-muted text-muted-foreground border border-border",
  },
  processing: {
    label: "Processing",
    icon: Upload,
    className: "bg-info/10 text-info border border-info/20",
  },
  uploaded: {
    label: "Uploaded",
    icon: Upload,
    className: "bg-info/10 text-info border border-info/20",
  },
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border border-success/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border border-destructive/20",
  },
};

export function DocumentStatusBadge({
  status,
  className,
  size = "md",
}: DocumentStatusBadgeProps) {
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
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden="true" />
      {config.label}
    </span>
  );
}

export const ALL_DOC_STATUS: DocumentStatus[] = [
  "pending",
  "processing",
  "uploaded",
  "verified",
  "rejected",
];

export function getDocStatusLabel(status: DocumentStatus): string {
  return STATUS_CONFIG[status].label;
}
