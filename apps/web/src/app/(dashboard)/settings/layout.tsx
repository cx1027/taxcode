import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Sidebar navigation */}
      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-card border border-border bg-card p-4">
          <h2 className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            Settings
          </h2>
          <SettingsNav />
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden">
        <SettingsNav />
      </div>

      {/* Main content */}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
