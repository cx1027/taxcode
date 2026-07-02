import { PageHeader } from "@/components/layout";

export default function ExpensesPage() {
  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Track and manage your business expenses"
      />
      <div className="mt-6 rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">Expense tracking coming soon.</p>
      </div>
    </div>
  );
}
