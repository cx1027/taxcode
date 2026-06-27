import Link from "next/link";
import { Plus, FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { StatCard } from "@/components/ui/StatCard";
import { FilingProgressCard } from "@/components/dashboard/FilingProgressCard";
import { RecentFilingsList } from "@/components/dashboard/RecentFilingsList";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { ReminderCard } from "@/components/dashboard/ReminderCard";
import { PendingTasksCard } from "@/components/dashboard/PendingTasksCard";

export default function DashboardPage() {
  return (
    <div className="space-y-xl">
      <PageHeader
        title="Dashboard"
        description="Your tax filing overview for 2024"
        actions={
          <Link
            href="/filings/new"
            className="inline-flex items-center gap-2 rounded-button border border-primary/20 bg-primary/5 px-md py-2 text-sm font-medium text-primary shadow-soft-sm transition-all hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New Filing
          </Link>
        }
      />

      {/* KPI Cards — 4-column grid on desktop, 2 on tablet */}
      <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-4">
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
          trend={{ value: -1, label: "vs last month", positive: false }}
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

      {/* Main 3-column grid */}
      <div className="grid gap-xl lg:grid-cols-3">
        {/* Left: Filing progress + recent filings */}
        <div className="space-y-xl lg:col-span-2">
          <FilingProgressCard />
          <RecentFilingsList />
        </div>

        {/* Right: Tasks, reminders, activity, quick actions */}
        <div className="space-y-xl">
          <PendingTasksCard />
          <ReminderCard />
          <RecentActivityCard />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}
