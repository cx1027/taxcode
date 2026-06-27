import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  icon?: ReactNode;
  className?: string;
  variant?: "default" | "highlight" | "compact";
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
  variant = "default",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border border-border bg-card shadow-soft-sm transition-shadow duration-200 hover:shadow-soft",
        variant === "highlight" && "border-primary/20 bg-primary/[0.02]",
        className
      )}
    >
      <div className="p-lg">
        <div className="flex items-start justify-between gap-md">
          <div className="space-y-sm min-w-0">
            <p className="text-helper text-text-muted truncate">
              {title}
            </p>
            <p
              className={cn(
                "text-3xl font-semibold tracking-tight tabular-nums",
                variant === "highlight"
                  ? "text-primary"
                  : "text-foreground"
              )}
            >
              {value}
            </p>
            {description && (
              <p className="text-helper text-text-muted">{description}</p>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
                variant === "highlight"
                  ? "bg-primary/10 text-primary"
                  : "bg-surface-subtle text-text-muted"
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className="mt-md flex items-center gap-xs">
            <span
              className={cn(
                "inline-flex items-center text-xs font-medium",
                trend.positive !== false
                  ? "text-success"
                  : "text-destructive"
              )}
            >
              <svg
                className={cn(
                  "mr-0.5 h-3 w-3",
                  trend.positive === false && "rotate-180"
                )}
                fill="currentColor"
                viewBox="0 0 12 12"
                aria-hidden="true"
              >
                <path d="M6 2.5L10.5 8H1.5L6 2.5Z" />
              </svg>
              {trend.value > 0 ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-helper text-text-muted">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
