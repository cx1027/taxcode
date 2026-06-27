import type { FilingStatus, DocumentStatus } from "@/lib/schemas/filing";
import type { MockFiling, MockDocument } from "@/lib/schemas/filing";

export type { MockFiling, MockDocument, FilingStatus, DocumentStatus };

// ─── User Profile types ───────────────────────────────────────────────────────

export interface MockUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  irdNumber: string;
  filingStatus: string;
  createdAt: string;
}

export const MOCK_USER_PROFILE: MockUserProfile = {
  id: "user-001",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+64 21 123 4567",
  address: "123 Queen Street, Auckland 1010",
  irdNumber: "123-456-789",
  filingStatus: "single",
  createdAt: "2024-01-15T10:00:00Z",
};

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
    taxpayerType: "individual",
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
    taxpayerType: "individual",
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
    taxpayerType: "individual",
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
    taxpayerType: "individual",
  },
  {
    id: "fil-005",
    name: "2024 State Return — NY",
    taxYear: 2024,
    status: "draft",
    dueDate: "April 15, 2025",
    updatedAt: "3 days ago",
    progress: 10,
    taxpayerType: "individual",
  },
  {
    id: "fil-006",
    name: "2024 Business Return — LLC",
    taxYear: 2024,
    status: "submitted",
    dueDate: "March 15, 2025",
    updatedAt: "2 weeks ago",
    progress: 100,
    amountOwed: 3200,
    taxpayerType: "business",
  },
  {
    id: "fil-007",
    name: "2023 Business Return — S-Corp",
    taxYear: 2023,
    status: "rejected",
    dueDate: "March 15, 2024",
    updatedAt: "3 months ago",
    progress: 100,
    amountOwed: 1500,
    taxpayerType: "business",
  },
  {
    id: "fil-008",
    name: "2022 State Return — CA",
    taxYear: 2022,
    status: "completed",
    dueDate: "April 15, 2023",
    updatedAt: "1 year ago",
    progress: 100,
    refund: 890,
    taxpayerType: "individual",
  },
  {
    id: "fil-009",
    name: "2024 Federal Return — Amended",
    taxYear: 2023,
    status: "needs_attention",
    dueDate: "June 30, 2025",
    updatedAt: "1 day ago",
    progress: 80,
    amountOwed: 220,
    taxpayerType: "individual",
  },
  {
    id: "fil-010",
    name: "2021 Federal Return",
    taxYear: 2021,
    status: "error",
    dueDate: "April 15, 2022",
    updatedAt: "2 days ago",
    progress: 95,
    taxpayerType: "individual",
  },
  {
    id: "fil-011",
    name: "2024 Estimated Tax — Q1",
    taxYear: 2024,
    status: "completed",
    dueDate: "April 15, 2024",
    updatedAt: "4 months ago",
    progress: 100,
    refund: 0,
    taxpayerType: "individual",
  },
  {
    id: "fil-012",
    name: "2023 State Return — TX",
    taxYear: 2023,
    status: "in_progress",
    dueDate: "March 1, 2024",
    updatedAt: "5 days ago",
    progress: 45,
    refund: 560,
    taxpayerType: "individual",
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

// ─── Document types ───────────────────────────────────────────────────────────

export const MOCK_DOCUMENTS: MockDocument[] = [
  {
    id: "doc-001",
    filingId: "fil-001",
    filingName: "2024 Federal Return",
    fileName: "W-2_Employer_2024.pdf",
    documentType: "W-2",
    size: 245760,
    status: "verified",
    uploadedAt: "2025-03-15T10:30:00Z",
  },
  {
    id: "doc-002",
    filingId: "fil-001",
    filingName: "2024 Federal Return",
    fileName: "1099_Freelance.pdf",
    documentType: "1099",
    size: 180224,
    status: "uploaded",
    uploadedAt: "2025-03-16T14:20:00Z",
  },
  {
    id: "doc-003",
    filingId: "fil-002",
    filingName: "2023 State Return — CA",
    fileName: "W-2_State_CA_2023.pdf",
    documentType: "W-2",
    size: 312456,
    status: "verified",
    uploadedAt: "2024-02-20T09:15:00Z",
  },
  {
    id: "doc-004",
    filingId: "fil-003",
    filingName: "2023 Federal Return",
    fileName: "Receipt_Donation_Charity.pdf",
    documentType: "Receipt",
    size: 156890,
    status: "verified",
    uploadedAt: "2024-04-10T16:45:00Z",
  },
  {
    id: "doc-005",
    filingId: "fil-005",
    filingName: "2024 State Return — NY",
    fileName: "ID_Scan_DriversLicense.jpg",
    documentType: "ID",
    size: 2048000,
    status: "processing",
    uploadedAt: "2025-06-20T11:00:00Z",
  },
  {
    id: "doc-006",
    filingId: "fil-001",
    filingName: "2024 Federal Return",
    fileName: "1099_Interest_Bank.pdf",
    documentType: "1099",
    size: 98304,
    status: "pending",
    uploadedAt: "2025-06-25T08:30:00Z",
  },
  {
    id: "doc-007",
    filingId: "fil-006",
    filingName: "2024 Business Return — LLC",
    fileName: "Receipt_Office_Supplies.pdf",
    documentType: "Receipt",
    size: 456789,
    status: "rejected",
    uploadedAt: "2025-05-10T13:20:00Z",
  },
  {
    id: "doc-008",
    filingId: "fil-009",
    filingName: "2024 Federal Return — Amended",
    fileName: "1098_Mortgage_Interest.pdf",
    documentType: "1098",
    size: 276480,
    status: "verified",
    uploadedAt: "2025-06-01T10:00:00Z",
  },
  {
    id: "doc-009",
    filingId: "fil-012",
    filingName: "2023 State Return — TX",
    fileName: "W-2_TX_2023.pdf",
    documentType: "W-2",
    size: 192000,
    status: "uploaded",
    uploadedAt: "2024-01-15T15:30:00Z",
  },
  {
    id: "doc-010",
    filingId: "",
    filingName: "",
    fileName: "Tax_Summary_2022.pdf",
    documentType: "Other",
    size: 512000,
    status: "verified",
    uploadedAt: "2023-12-20T09:00:00Z",
  },
];
