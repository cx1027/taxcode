import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { FilingTable } from "@/components/filings";

export default function FilingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Filings"
        description="Manage and track all your tax filings"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Filings" },
        ]}
        actions={
          <Link
            href="/filings/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft-sm transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New Filing
          </Link>
        }
      />

      <FilingTable />
    </div>
  );
}
