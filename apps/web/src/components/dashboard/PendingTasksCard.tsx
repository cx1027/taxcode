"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { FileCheck, Users, AlertTriangle, FileText, ChevronRight } from "lucide-react";
import { MOCK_TASKS } from "@/lib/mock-data";

const PRIORITY_CONFIG = {
  high: {
    icon: AlertTriangle,
    iconClass: "text-destructive",
    bgClass: "bg-destructive/5",
    borderClass: "border-destructive/20",
    textClass: "text-destructive",
  },
  medium: {
    icon: Users,
    iconClass: "text-warning",
    bgClass: "bg-warning/5",
    borderClass: "border-warning/20",
    textClass: "text-warning",
  },
  low: {
    icon: FileCheck,
    iconClass: "text-primary",
    bgClass: "bg-primary/5",
    borderClass: "border-primary/20",
    textClass: "text-primary",
  },
};

export function PendingTasksCard() {
  return (
    <div className="rounded-card border border-warning/30 bg-warning/5 p-lg">
      <div className="flex items-center gap-sm">
        <AlertTriangle className="h-4 w-4 text-warning" strokeWidth={2} />
        <h2 className="text-card-title text-foreground">Needs Your Attention</h2>
      </div>
      <div className="mt-md flex flex-col gap-sm">
        {MOCK_TASKS.map((task) => {
          const config = PRIORITY_CONFIG[task.priority];
          const Icon = config.icon;
          return (
            <div
              key={task.id}
              className={cn(
                "flex items-start gap-sm rounded-lg border bg-card p-sm",
                config.borderClass,
                config.bgClass
              )}
            >
              <Icon
                className={cn("mt-0.5 h-4 w-4 flex-shrink-0", config.iconClass)}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground">
                  {task.filingName}
                </p>
                <p className="text-helper text-text-muted">{task.description}</p>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-xs">
                <Link
                  href={`/filings/${task.filingId}`}
                  className={cn(
                    "text-status flex items-center gap-0.5 font-medium transition-colors",
                    config.textClass,
                    "hover:underline"
                  )}
                >
                  {task.actionLabel}
                  <ChevronRight className="h-3 w-3" />
                </Link>
                {task.dueDate && (
                  <span className="text-xs text-text-muted">{task.dueDate}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
