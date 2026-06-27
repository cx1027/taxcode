"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/lib/schemas/filing";
import { ALL_DOC_STATUS, getDocStatusLabel } from "./document-status-badge";

interface DocumentFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: DocumentStatus | "all";
  onStatusChange: (status: DocumentStatus | "all") => void;
  typeFilter: string;
  onTypeChange: (type: string) => void;
  resultCount: number;
  className?: string;
}

const DOC_TYPES = ["all", "W-2", "1099", "1098", "Receipt", "ID", "Other"] as const;

export function DocumentFilters({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  resultCount,
  className,
}: DocumentFiltersProps) {
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
            placeholder="Search documents..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-input border border-border bg-surface py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Search documents"
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
            htmlFor="doc-status-filter"
            className="text-xs font-medium text-muted-foreground whitespace-nowrap"
          >
            Status
          </label>
          <select
            id="doc-status-filter"
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as DocumentStatus | "all")
            }
            className="rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All</option>
            {ALL_DOC_STATUS.map((status) => (
              <option key={status} value={status}>
                {getDocStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="doc-type-filter"
            className="text-xs font-medium text-muted-foreground whitespace-nowrap"
          >
            Type
          </label>
          <select
            id="doc-type-filter"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {DOC_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        {resultCount} {resultCount === 1 ? "document" : "documents"} found
      </p>
    </div>
  );
}
