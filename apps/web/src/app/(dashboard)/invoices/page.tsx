import { PageHeader } from "@/components/layout";

export default function InvoicesPage() {
  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Create and manage client invoices"
      />
      <div className="mt-6 rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">Invoice management coming soon.</p>
      </div>
    </div>
  );
}
