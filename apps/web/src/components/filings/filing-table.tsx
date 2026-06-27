"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, type Column } from "@/components/ui/data-table";
import { FilingStatusBadge } from "./filing-status-badge";
import { FilingFilters } from "./filing-filters";
import { MOCK_FILINGS, type MockFiling, type FilingStatus } from "@/lib/mock-data";

const PAGE_SIZE = 10;

function formatAmount(amount: number, type: "refund" | "owed"): string {
  const formatted = `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  return type === "refund" ? `+${formatted}` : `-${formatted}`;
}

export function FilingTable() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilingStatus | "all">("all");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    return MOCK_FILINGS.filter((filing) => {
      // Status filter
      if (statusFilter !== "all" && filing.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        return (
          filing.name.toLowerCase().includes(query) ||
          filing.taxYear.toString().includes(query)
        );
      }
      return true;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: FilingStatus | "all") => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handleRowClick = useCallback(
    (filing: MockFiling) => {
      router.push(`/filings/${filing.id}`);
    },
    [router]
  );

  const columns: Column<MockFiling>[] = [
    {
      key: "name",
      header: "Filing Name",
      className: "w-[35%]",
      render: (filing) => (
        <div>
          <p className="text-sm font-medium text-foreground truncate">
            {filing.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filing.taxYear}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-[18%]",
      render: (filing) => <FilingStatusBadge status={filing.status} size="sm" />,
    },
    {
      key: "dueDate",
      header: "Due Date",
      className: "w-[15%]",
      render: (filing) => (
        <span className="text-sm text-foreground">{filing.dueDate}</span>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      className: "w-[15%]",
      render: (filing) => (
        <span className="text-sm text-muted-foreground">{filing.updatedAt}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      className: "w-[17%]",
      cellClassName: "text-right",
      render: (filing) => {
        if (filing.refund && filing.refund > 0) {
          return (
            <span className="text-sm font-medium text-success tabular-nums">
              {formatAmount(filing.refund, "refund")}
            </span>
          );
        }
        if (filing.amountOwed && filing.amountOwed > 0) {
          return (
            <span className="text-sm font-medium text-destructive tabular-nums">
              {formatAmount(filing.amountOwed, "owed")}
            </span>
          );
        }
        return (
          <span className="text-sm text-muted-foreground">—</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <FilingFilters
        searchValue={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        resultCount={filteredData.length}
      />

      <DataTable
        columns={columns}
        data={paginatedData}
        keyExtractor={(filing) => filing.id}
        onRowClick={handleRowClick}
        emptyMessage="No filings match your filters."
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filteredData.length)} of{" "}
            {filteredData.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors",
                currentPage === 1
                  ? "cursor-not-allowed opacity-40"
                  : "hover:bg-secondary"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors",
                  p === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:bg-secondary"
                )}
                aria-current={p === currentPage ? "page" : undefined}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors",
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-40"
                  : "hover:bg-secondary"
              )}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
