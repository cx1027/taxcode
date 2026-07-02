import { PageHeader } from "@/components/layout";

export default function BankFeedsPage() {
  return (
    <div>
      <PageHeader
        title="Bank Feeds"
        description="Connect and manage your bank accounts"
      />
      <div className="mt-6 rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">Bank feeds coming soon.</p>
      </div>
    </div>
  );
}
