"use client";

import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ValidationSummaryProps {
  errors: Record<string, string>;
  title?: string;
  className?: string;
}

export function ValidationSummary({
  errors,
  title = "Please fix the following errors:",
  className,
}: ValidationSummaryProps) {
  const [dismissed, setDismissed] = useState(false);

  const entries = Object.entries(errors);

  if (entries.length === 0 || dismissed) return null;

  return (
    <div
      className={cn(
        "rounded-card border border-destructive/30 bg-destructive/5 p-4",
        className
      )}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">{title}</p>
            <ul className="mt-2 space-y-1">
              {entries.map(([field, message]) => (
                <li key={field} className="text-xs text-destructive/80">
                  <span className="font-mono font-medium">{field}</span>: {message}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-destructive/60 transition-colors hover:text-destructive"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface InlineFieldErrorProps {
  message?: string;
  className?: string;
}

export function InlineFieldError({ message, className }: InlineFieldErrorProps) {
  if (!message) return null;

  return (
    <p
      className={cn("mt-1 flex items-center gap-1 text-xs text-destructive", className)}
      role="alert"
    >
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {message}
    </p>
  );
}
