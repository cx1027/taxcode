import type { FilingStatus } from "@taxcode/shared-types";

// ─── Filing types ──────────────────────────────────────────────────────────────

export interface MockFiling {
  id: string;
  name: string;
  taxYear: number;
  status: FilingStatus;
  dueDate: string;
  updatedAt: string;
  progress?: number; // 0–100
  amountOwed?: number;
  refund?: number;
}

// ─── Activity types ────────────────────────────────────────────────────────────

export interface MockActivity {
  id: number;
  text: string;
  time: string;
}

// ─── Task types ───────────────────────────────────────────────────────────────

export type TaskPriority = "high" | "medium" | "low";

export interface MockTask {
  id: string;
  filingId: string;
  filingName: string;
  description: string;
  priority: TaskPriority;
  dueDate?: string;
  actionLabel: string;
}

// ─── Reminder types ───────────────────────────────────────────────────────────

export type ReminderType = "deadline" | "document" | "review" | "payment";

export interface MockReminder {
  id: string;
  type: ReminderType;
  title: string;
  description: string;
  dueDate: string;
  urgency: "urgent" | "soon" | "later";
}

// ─── Quick action types ───────────────────────────────────────────────────────

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  href: string;
  variant: "default" | "secondary";
}

// ─── KPI card types ───────────────────────────────────────────────────────────

export interface KpiStat {
  id: string;
  title: string;
  value: string | number;
  description: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  icon: string; // Lucide icon name
  variant?: "default" | "highlight";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_FILINGS: MockFiling[] = [
  {
    id: "fil-001",
    name: "2024 Federal Return",
    taxYear: 2024,
    status: "in_progress",
    dueDate: "April 15, 2025",
    updatedAt: "2 days ago",
    progress: 65,
    refund: 1240,
  },
  {
    id: "fil-002",
    name: "2023 State Return — CA",
    taxYear: 2023,
    status: "ready_for_review",
    dueDate: "March 1, 2024",
    updatedAt: "1 week ago",
    progress: 100,
    refund: 380,
  },
  {
    id: "fil-003",
    name: "2023 Federal Return",
    taxYear: 2023,
    status: "completed",
    dueDate: "April 18, 2024",
    updatedAt: "6 months ago",
    progress: 100,
    refund: 2100,
  },
  {
    id: "fil-004",
    name: "2022 Federal Return",
    taxYear: 2022,
    status: "completed",
    dueDate: "April 15, 2023",
    updatedAt: "1 year ago",
    progress: 100,
    amountOwed: 450,
  },
];

export const MOCK_ACTIVITIES: MockActivity[] = [
  { id: 1, text: "2024 Federal Return: W-2 document uploaded", time: "10 min ago" },
  { id: 2, text: "2024 Federal Return: Deduction section completed", time: "1 hour ago" },
  { id: 3, text: "2023 State Return (CA) marked Ready for Review", time: "3 hours ago" },
  { id: 4, text: "2023 Federal Return: Filing accepted by IRS", time: "2 days ago" },
  { id: 5, text: "New filing created: 2024 Federal Return", time: "1 week ago" },
];

export const MOCK_TASKS: MockTask[] = [
  {
    id: "task-001",
    filingId: "fil-001",
    filingName: "2024 Federal Return",
    description: "Upload W-2 or 1099 to continue",
    priority: "high",
    actionLabel: "Upload Document",
  },
  {
    id: "task-002",
    filingId: "fil-002",
    filingName: "2023 State Return — CA",
    description: "1 required document missing",
    priority: "medium",
    dueDate: "Due in 3 days",
    actionLabel: "Review",
  },
  {
    id: "task-003",
    filingId: "fil-001",
    filingName: "2024 Federal Return",
    description: "Review and confirm income entries",
    priority: "low",
    actionLabel: "Review",
  },
];

export const MOCK_REMINDERS: MockReminder[] = [
  {
    id: "rem-001",
    type: "deadline",
    title: "2024 Federal Return due",
    description: "Federal tax filing deadline",
    dueDate: "April 15, 2025",
    urgency: "soon",
  },
  {
    id: "rem-002",
    type: "document",
    title: "W-2 documents needed",
    description: "2 W-2s not yet uploaded",
    dueDate: "Before filing",
    urgency: "urgent",
  },
  {
    id: "rem-003",
    type: "payment",
    title: "Q4 estimated tax payment",
    description: "Optional quarterly payment",
    dueDate: "January 15, 2025",
    urgency: "later",
  },
];

export const MOCK_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "qa-001",
    label: "Start New Filing",
    description: "Begin a new tax return for 2024",
    icon: "Plus",
    href: "/filings/new",
    variant: "default",
  },
  {
    id: "qa-002",
    label: "Upload Documents",
    description: "Add W-2s, 1099s, and receipts",
    icon: "Upload",
    href: "/documents",
    variant: "secondary",
  },
  {
    id: "qa-003",
    label: "View Tax Summary",
    description: "Review estimated tax liability",
    icon: "Receipt",
    href: "/filings/fil-001/summary",
    variant: "secondary",
  },
];

export const MOCK_KPI_STATS: KpiStat[] = [
  {
    id: "kpi-active",
    title: "Active Filings",
    value: 2,
    description: "In progress this year",
    icon: "FileText",
    variant: "default",
  },
  {
    id: "kpi-completed",
    title: "Completed",
    value: 8,
    description: "Filed in past 12 months",
    trend: { value: 12, label: "vs last year" },
    icon: "CheckCircle",
    variant: "default",
  },
  {
    id: "kpi-pending",
    title: "Pending Review",
    value: 1,
    description: "Awaiting your action",
    trend: { value: -1, label: "vs last month", positive: false },
    icon: "Clock",
    variant: "highlight",
  },
  {
    id: "kpi-savings",
    title: "Tax Savings",
    value: "$4,280",
    description: "Total deductions claimed",
    trend: { value: 8, label: "vs last year" },
    icon: "TrendingUp",
    variant: "default",
  },
];
