import Link from "next/link";
import {
  FileText,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Users,
  FileCheck,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout";
import { StatCard } from "@/components/ui";
import { StatusBadge } from "@/components/ui/StatusBadge";

const MOCK_FILINGS = [
  {
    id: "fil-001",
    name: "2024 Federal Return",
    taxYear: 2024,
    status: "in_progress" as const,
    dueDate: "April 15, 2025",
    updatedAt: "2 days ago",
  },
  {
    id: "fil-002",
    name: "2023 State Return - CA",
    taxYear: 2023,
    status: "ready_for_review" as const,
    dueDate: "March 1, 2024",
    updatedAt: "1 week ago",
  },
  {
    id: "fil-003",
    name: "2023 Federal Return",
    taxYear: 2023,
    status: "completed" as const,
    dueDate: "April 18, 2024",
    updatedAt: "6 months ago",
  },
];

const MOCK_ACTIVITIES = [
  { id: 1, text: "2024 Federal Return: W-2 document uploaded", time: "10 min ago" },
  { id: 2, text: "2024 Federal Return: Deduction section completed", time: "1 hour ago" },
  { id: 3, text: "2023 State Return marked Ready for Review", time: "3 hours ago" },
  { id: 4, text: "2023 Federal Return: Filing accepted by IRS", time: "2 days ago" },
];

const MOCK_INCOME = [
  { id: 1, category: "Salaries & Wages", amount: "$48,500.00", icon: "💼" },
  { id: 2, category: "Self-Employment", amount: "$12,000.00", icon: "💻" },
  { id: 3, category: "Interest", amount: "$320.50", icon: "🏦" },
  { id: 4, category: "Dividends", amount: "$1,200.00", icon: "📈" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your tax filing overview for 2024"
        actions={
          <Link
            href="/filings/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New Filing
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Filings"
          value={2}
          description="In progress this year"
          icon={<FileText className="h-5 w-5" strokeWidth={1.75} />}
        />
        <StatCard
          title="Completed"
          value={8}
          description="Filed in past 12 months"
          trend={{ value: 12, label: "vs last year" }}
          icon={<CheckCircle className="h-5 w-5" strokeWidth={1.75} />}
        />
        <StatCard
          title="Pending Review"
          value={1}
          description="Awaiting your action"
          icon={<Clock className="h-5 w-5" strokeWidth={1.75} />}
          variant="highlight"
        />
        <StatCard
          title="Tax Savings"
          value="$4,280"
          description="Total deductions claimed"
          trend={{ value: 8, label: "vs last year" }}
          icon={<TrendingUp className="h-5 w-5" strokeWidth={1.75} />}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Filings */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">Recent Filings</h2>
              <Link
                href="/filings"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {MOCK_FILINGS.map((filing) => (
                <Link
                  key={filing.id}
                  href={`/filings/${filing.id}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-secondary/40"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {filing.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Updated {filing.updatedAt}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0 flex-col items-end gap-1.5">
                    <StatusBadge status={filing.status} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      Due {filing.dueDate}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Income summary */}
          <div className="rounded-xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">Income</h2>
              <Link
                href="/income"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {MOCK_INCOME.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-base">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <DollarSign className="h-4 w-4" strokeWidth={2.5} />
                  Total Income
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-foreground">
                    $62,020.50
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5">
                    <TrendingUp className="h-3 w-3 text-success" strokeWidth={2.5} />
                    <span className="text-xs font-medium text-success">+8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attention needed */}
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" strokeWidth={2} />
              <h2 className="text-sm font-semibold text-foreground">
                Needs Your Attention
              </h2>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2 rounded-lg bg-card p-3">
                <FileCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    2024 Federal Return
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload W-2 or 1099 to continue
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-card p-3">
                <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    2023 State Return
                  </p>
                  <p className="text-xs text-muted-foreground">
                    1 required document missing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-xl border border-border bg-card shadow-soft">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">
                Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-border">
              {MOCK_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="px-5 py-3">
                  <p className="text-xs text-foreground">{activity.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
