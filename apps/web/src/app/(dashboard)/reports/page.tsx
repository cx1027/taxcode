import { PageHeader } from "@/components/layout";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and view financial reports"
      />
      <div className="mt-6 rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">Reports coming soon.</p>
      </div>
    </div>
  );
}
