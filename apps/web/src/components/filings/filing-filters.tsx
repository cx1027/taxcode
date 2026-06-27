"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilingStatus } from "@/lib/schemas/filing";
import { ALL_FILING_STATUSES, getStatusLabel } from "./filing-status-badge";

interface FilingFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: FilingStatus | "all";
  onStatusChange: (status: FilingStatus | "all") => void;
  resultCount: number;
  className?: string;
}

export function FilingFilters({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  resultCount,
  className,
}: FilingFiltersProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search filings by name or year..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-input border border-border bg-surface py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Search filings"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="status-filter"
            className="text-xs font-medium text-muted-foreground"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as FilingStatus | "all")
            }
            className="rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All</option>
            {ALL_FILING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        {resultCount} {resultCount === 1 ? "filing" : "filings"} found
      </p>
    </div>
  );
}
