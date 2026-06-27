"use client";

import { cn } from "@/lib/utils";
import { Calendar, FileText, CreditCard, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { MOCK_REMINDERS } from "@/lib/mock-data";
import type { ReminderType } from "@/lib/mock-data";

const REMINDER_TYPE_CONFIG: Record<
  ReminderType,
  { icon: typeof Calendar; bgClass: string; iconClass: string }
> = {
  deadline: {
    icon: Calendar,
    bgClass: "bg-primary/5",
    iconClass: "text-primary",
  },
  document: {
    icon: FileText,
    bgClass: "bg-warning/5",
    iconClass: "text-warning",
  },
  review: {
    icon: Clock,
    bgClass: "bg-info/5",
    iconClass: "text-info",
  },
  payment: {
    icon: CreditCard,
    bgClass: "bg-success/5",
    iconClass: "text-success",
  },
};

const URGENCY_CONFIG = {
  urgent: { label: "Urgent", dotClass: "bg-destructive", borderClass: "border-destructive/30" },
  soon: { label: "Soon", dotClass: "bg-warning", borderClass: "border-warning/30" },
  later: { label: "Later", dotClass: "bg-muted-foreground", borderClass: "border-border" },
};

export function ReminderCard() {
  return (
    <div className="rounded-card border border-border bg-card p-lg">
      <div className="mb-md">
        <h2 className="text-card-title text-foreground">Upcoming Reminders</h2>
      </div>
      <div className="flex flex-col gap-sm">
        {MOCK_REMINDERS.map((reminder) => {
          const typeConfig = REMINDER_TYPE_CONFIG[reminder.type];
          const urgencyConfig = URGENCY_CONFIG[reminder.urgency];
          const Icon = typeConfig.icon;
          return (
            <div
              key={reminder.id}
              className={cn(
                "flex items-start gap-sm rounded-lg border bg-surface-subtle p-sm",
                urgencyConfig.borderClass
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                  typeConfig.bgClass
                )}
              >
                <Icon
                  className={cn("h-4 w-4", typeConfig.iconClass)}
                  strokeWidth={1.75}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-xs">
                  <p className="text-xs font-medium text-foreground truncate">
                    {reminder.title}
                  </p>
                  <span
                    className={cn(
                      "flex h-1.5 w-1.5 flex-shrink-0 rounded-full",
                      urgencyConfig.dotClass
                    )}
                    title={urgencyConfig.label}
                  />
                </div>
                <p className="text-helper text-text-muted">{reminder.description}</p>
                <p className="text-helper text-text-muted">{reminder.dueDate}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
