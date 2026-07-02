import { PageHeader } from "@/components/layout";

export default function AssetsPage() {
  return (
    <div>
      <PageHeader
        title="Assets"
        description="Manage your business and personal assets"
      />
      <div className="mt-6 rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">Asset management coming soon.</p>
      </div>
    </div>
  );
}
