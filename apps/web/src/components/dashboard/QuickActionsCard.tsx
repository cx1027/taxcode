"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Plus,
  Upload,
  Receipt,
  FileText,
  ArrowRight,
} from "lucide-react";
import { MOCK_QUICK_ACTIONS } from "@/lib/mock-data";
import type { QuickAction } from "@/lib/mock-data";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Plus,
  Upload,
  Receipt,
  FileText,
};

function QuickActionButton({ action }: { action: QuickAction }) {
  const Icon = ICON_MAP[action.icon] ?? FileText;
  const isPrimary = action.variant === "default";

  return (
    <Link
      href={action.href}
      className={cn(
        "group flex items-center gap-sm rounded-button border px-md py-sm text-sm font-medium transition-all",
        isPrimary
          ? "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
          : "border-border bg-surface text-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
      )}
    >
      <Icon
        className={cn("h-4 w-4 flex-shrink-0", isPrimary ? "text-primary" : "text-text-muted group-hover:text-primary")}
        strokeWidth={1.75}
      />
      <span className="flex-1">{action.label}</span>
      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

export function QuickActionsCard() {
  return (
    <div className="rounded-card border border-border bg-card p-lg">
      <div className="mb-md">
        <h2 className="text-card-title text-foreground">Quick Actions</h2>
        <p className="text-helper text-text-muted">Common tasks at a glance</p>
      </div>
      <div className="flex flex-col gap-xs">
        {MOCK_QUICK_ACTIONS.map((action) => (
          <QuickActionButton key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
}
