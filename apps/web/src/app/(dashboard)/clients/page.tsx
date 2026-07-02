import { PageHeader } from "@/components/layout";

export default function ClientsPage() {
  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage your client relationships"
      />
      <div className="mt-6 rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">Client management coming soon.</p>
      </div>
    </div>
  );
}
