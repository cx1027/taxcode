"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MOCK_FILINGS } from "@/lib/mock-data";

export function RecentFilingsList() {
  return (
    <div className="rounded-card border border-border bg-card shadow-soft-sm">
      <div className="flex items-center justify-between border-b border-border px-lg py-md">
        <h2 className="text-card-title text-foreground">Recent Filings</h2>
        <Link
          href="/filings"
          className="text-status flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {MOCK_FILINGS.map((filing) => (
          <Link
            key={filing.id}
            href={`/filings/${filing.id}`}
            className="flex items-center justify-between px-lg py-md transition-colors hover:bg-secondary/40"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {filing.name}
              </p>
              <p className="text-helper text-text-muted">
                Updated {filing.updatedAt}
              </p>
            </div>
            <div className="ml-md flex flex-shrink-0 flex-col items-end gap-sm">
              <StatusBadge status={filing.status} size="sm" />
              <span className="text-xs text-text-muted">
                Due {filing.dueDate}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
