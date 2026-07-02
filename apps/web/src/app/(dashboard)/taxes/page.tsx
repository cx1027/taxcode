import { PageHeader } from "@/components/layout";

export default function TaxesPage() {
  return (
    <div>
      <PageHeader
        title="Taxes"
        description="View and manage your tax obligations"
      />
      <div className="mt-6 rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">Tax management coming soon.</p>
      </div>
    </div>
  );
}
