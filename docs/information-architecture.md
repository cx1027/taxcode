# Information Architecture

## Overview

This document describes the information architecture for the TaxCode web-first tax filing application. It is the single reference for:

- **Page structure and URL layout** — what pages exist, what they contain, and how they relate
- **Navigation design** — sidebar, topbar, and breadcrumb conventions
- **User flows** — the primary journeys through the product
- **Backend module boundaries** — how the Node.js API is organized
- **Data flows** — how data moves between frontend, API, database, and Rust tax engine

This document is **implementation-oriented**. It should be updated whenever pages, routes, modules, or flows change so it remains useful as a living map for engineers and designers.

For visual and interaction design, see `design-system.md`. For technical architecture decisions, see `architecture.md`.

---

## 1. User Roles

The product has three primary roles. Role-based access control gates which pages and actions each role can see.

### 1.1 Taxpayer (Individual Filer)

The primary end user. Files personal tax returns.

- Can create and manage their own filings
- Can upload documents associated with their filings
- Can view calculation results and summaries
- Can submit completed filings to IRD
- Cannot access other users' data or admin pages

### 1.2 Accountant / Tax Professional

A user who manages filings on behalf of clients.

- All taxpayer capabilities
- Can view and manage filings assigned to their organization
- Can invite or be assigned to multiple taxpayer accounts
- May have elevated access to draft editing and submission review

### 1.3 Administrator

Internal staff managing the platform.

- User management (invite, deactivate, assign roles)
- Organization management
- Audit log access
- System health and job status monitoring
- Tax rule version management

### Role Access Summary

| Area | Taxpayer | Accountant | Admin |
|---|---|---|---|
| Own filings | CRUD | CRUD | Read |
| Assigned filings | — | CRUD | Read |
| Documents | CRUD | CRUD | Read |
| Dashboard | Standard | Standard | Full |
| Admin / Settings | — | — | Full |
| Audit logs | — | — | Read |
| User management | — | — | CRUD |

---

## 2. Page Map (URL Paths)

### 2.1 Public Pages

No authentication required.

| Path | Page | Description |
|---|---|---|
| `/` | Landing / Marketing | Public homepage with hero, features, and sign-up CTA |
| `/login` | Sign In | Split-screen auth page |
| `/register` | Create Account | Split-screen registration with feature highlights |

### 2.2 Authenticated Pages — Dashboard Shell

All pages below live inside the `AppShell` (sidebar + topbar layout). They require an active session (JWT). Unauthenticated requests redirect to `/login`.

#### Overview

| Path | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard Home | KPI grid, filing progress, activity feed, quick actions |

#### Filings

| Path | Page | Description |
|---|---|---|
| `/filings` | Filings List | Paginated list of all filings with status filters |
| `/filings/new` | Create Filing | Wizard step 1 — select tax year, filing type, taxpayer context |
| `/filings/[id]` | Filing Wizard | Multi-step form editor (sections vary by tax type) |
| `/filings/[id]/review` | Filing Review | Pre-submission summary, validation panel, confirm and submit |
| `/filings/[id]/history` | Filing History | Audit log of status changes and edits for this filing |

#### Documents

| Path | Page | Description |
|---|---|---|
| `/documents` | Document Library | All uploaded documents across all filings |
| `/documents/[id]` | Document Detail | Preview, metadata, associated filings, download |

#### Settings

| Path | Page | Description |
|---|---|---|
| `/settings` | Account Settings | Profile, contact info, password |
| `/settings/organization` | Organization | Organization name, members, billing |
| `/settings/notifications` | Notification Preferences | Email and in-app alert settings |
| `/settings/security` | Security | Active sessions, 2FA management |

#### Admin (Admin role only)

| Path | Page | Description |
|---|---|---|
| `/admin/users` | User Management | List, invite, deactivate users; assign roles |
| `/admin/filings` | All Filings | Platform-wide filing list with status and user filters |
| `/admin/audit-log` | Audit Log | Searchable, filterable event log |
| `/admin/jobs` | Job Status | BullMQ job queue monitoring |
| `/admin/tax-rules` | Tax Rule Versions | View and manage active tax rule versions |

---

## 3. Primary Navigation

### 3.1 Sidebar (Left Navigation)

The sidebar is the **primary navigation surface** for all authenticated pages. It is fixed on desktop, collapsible on smaller screens, and never appears on public/auth pages.

#### Nav Items (order is intentional — most frequent tasks first)

| Label | Path | Icon | Roles |
|---|---|---|---|
| Dashboard | `/dashboard` | LayoutDashboard | All |
| Filings | `/filings` | FileText | All |
| Documents | `/documents` | FolderOpen | All |
| Settings | `/settings` | Settings | All |
| Admin | `/admin/*` | Shield | Admin only |

#### Sidebar Rules

- Items use icon + label, with active state highlighted
- Active path matches exact route or any sub-route (e.g., `/filings` highlights for `/filings/123`)
- Admin section appears only for admin-role users
- A "Help & Support" link at the bottom links to `/help`
- No bottom-tab bar, no mobile-first patterns

### 3.2 Topbar

The topbar sits above the main content area, below the sidebar. It contains:

| Element | Location | Behavior |
|---|---|---|
| Global search | Left | Placeholder: "Search filings, documents..." — opens a search overlay or dropdown |
| Notifications bell | Right | Shows unread count badge; opens notification panel |
| User avatar + name | Right | Opens a dropdown: Profile link, Sign out |

### 3.3 Breadcrumbs

Used on sub-pages to show location hierarchy:

- `/filings/abc123` → Dashboard / Filings / Filing #abc123
- `/settings/security` → Dashboard / Settings / Security
- `/admin/users` → Dashboard / Admin / Users

Breadcrumbs are rendered via the `PageHeader` component's `breadcrumbs` prop.

---

## 4. Dashboard vs Filing Workflow — The Fundamental Distinction

These two product surfaces have fundamentally different UX patterns. Conflating them is a common source of design debt.

### 4.1 Dashboard Surface

**Purpose:** At-a-glance overview. Answers "what is the current state?"

**Pattern:** Cards, KPIs, lists, activity feeds.

**Examples:**
- KPI cards showing "Active Filings: 3", "Completed: 12", "Pending Review: 1"
- Filing progress cards with status chips
- Activity feed showing recent filing events
- Reminder cards for upcoming deadlines
- Quick action buttons: "Start New Filing", "Upload Document"

**UX characteristics:**
- Read-heavy, low interaction density
- Designed to be glanced at quickly
- No multi-step forms; actions navigate to dedicated pages
- Data refreshes on navigation or on-demand

**Pages:** `/dashboard`

### 4.2 Filing Workflow Surface

**Purpose:** Task completion. Answers "I am doing my taxes right now."

**Pattern:** Multi-step form wizard, sectioned forms, sticky summary panels.

**Examples:**
- Step navigator: Personal Info → Income → Deductions → Credits → Review
- Form sections with field groups and inline validation
- Right-side summary panel showing running totals as the user fills in data
- Validation summary listing blocking issues and warnings
- "Save Draft" bar pinned to bottom or top

**UX characteristics:**
- Write-heavy, high interaction density
- Designed for focused, sustained work
- Auto-save on blur or explicit "Save Draft" action
- Long forms split into digestible steps
- State is persisted server-side between steps

**Pages:** `/filings/new`, `/filings/[id]`, `/filings/[id]/review`

### 4.3 Why This Distinction Matters

| Aspect | Dashboard | Filing Workflow |
|---|---|---|
| Primary goal | Awareness | Completion |
| Interaction style | Browse, scan | Fill, review |
| Persistence | On-demand / periodic | Auto-save + explicit save |
| Layout | Card grid | Form sections + summary panel |
| Validation | Aggregated status | Field-level + summary |

Mixing these patterns (e.g., embedding a full form inside a dashboard card) degrades both. Keep them separate.

---

## 5. Main User Flows

### 5.1 Core Filing Flow

The primary user journey from start to submission.

```
1.  Dashboard → "Start New Filing" button
2.  /filings/new → Select tax year + filing type
3.  /filings/[id] (Step 1: Personal Info)
    - Fill in taxpayer details
    - Save Draft (auto-saves on field blur)
4.  /filings/[id] (Step 2: Income)
    - Enter income sources
    - System validates totals
5.  /filings/[id] (Step 3: Deductions)
    - Enter eligible deductions
    - View running deduction totals
6.  /filings/[id] (Step 4: Credits)
    - Select applicable tax credits
    - View credit impact on estimate
7.  /filings/[id] (Step 5: Review)
    - View full filing summary
    - Read validation warnings and errors
    - Upload any required supporting documents
    - "Calculate" triggers Rust engine for final estimate
8.  /filings/[id]/review
    - Final confirmation screen
    - "Submit to IRD" button
9.  Backend transitions filing to "submitted" state
10. Confirmation screen + confirmation number
```

**Backend steps for submission:**
1. Validate request + permissions
2. Request final calculation from Rust engine
3. If validation passes, transition status to `submitted`
4. Record audit event
5. Enqueue confirmation email via BullMQ

### 5.2 Document Upload Flow

```
1.  /documents → "Upload Document" button
    OR from within a filing: upload panel in the relevant step
2.  Select file (PDF, image, etc.)
3.  Frontend shows upload progress
4.  Backend stores file metadata (name, type, size, associated filing)
5.  File stored in object storage (presigned URL or direct upload)
6.  Document appears in document library
7.  Filing wizard detects associated documents and updates completeness indicator
```

### 5.3 Accountant Client Management Flow

```
1.  Accountant logs in → sees dashboard
2.  /settings/organization → invites client via email
3.  Client accepts invite and registers
4.  Accountant sees client under their organization
5.  Accountant creates filing on behalf of client
6.  Client receives notification and can review/edit
7.  Accountant reviews and submits
```

### 5.4 Admin User Management Flow

```
1.  Admin logs in → Admin nav appears in sidebar
2.  /admin/users → List of all users
3.  "Invite User" → enter email + role
4.  System sends invite email
5.  New user appears as "Pending"
6.  Admin can deactivate or change role at any time
7.  /admin/audit-log → all user management events recorded
```

---

## 6. Page Responsibilities

### 6.1 `/dashboard` — Dashboard Home

**Responsibility:** At-a-glance summary of the user's tax situation.

**Components on this page:**
- KPI row: Active Filings, Completed, Pending Review, Tax Savings (or Tax Owed)
- FilingProgressCard: current filing progress with step indicator
- RecentFilingsList: last 5 filings with status chips
- ReminderCard: upcoming deadlines
- QuickActionsCard: "Start Filing", "Upload Document", "View History"
- RecentActivityCard: recent events across all filings

**Data loaded:** Current user's filings, notifications, recent activity. No filing form data.

**Empty state:** Friendly prompt to start the first filing with a "Start Filing" CTA.

### 6.2 `/filings` — Filings List

**Responsibility:** Browse and manage all filings.

**Components:**
- Filter bar: status filter (All, Draft, In Progress, Submitted, Completed), tax year filter
- Filing table/list: filing ID, taxpayer name, tax year, type, status chip, last modified date, actions column
- "New Filing" primary action button
- Pagination

**Data loaded:** Paginated filing list from the API.

**Empty state:** "No filings yet. Start your first filing to get started."

### 6.3 `/filings/[id]` — Filing Wizard

**Responsibility:** Multi-step form for entering all filing data.

**Layout:** Two-column on desktop.
- Left: current step form (scrollable if long)
- Right: sticky summary panel showing running totals and completeness

**Step structure (example for income tax):**
1. Personal Information
2. Income Sources
3. Deductions
4. Tax Credits
5. Review & Submit

**Per step:**
- Section header with step title and description
- Field groups with labels and inline validation
- "Previous" / "Save Draft" / "Next" navigation
- Step completion checkmark in the step navigator
- Validation errors shown inline and in the summary panel

**Auto-save:** On field blur, a background `PUT /api/filings/:id` request saves the current state.

**Progression guard:** Users cannot advance to the next step until required fields in the current step are valid.

### 6.4 `/filings/[id]/review` — Filing Review

**Responsibility:** Final review and submission.

**Components:**
- Full filing summary (collapsible sections matching each wizard step)
- Validation summary panel: errors (blocking), warnings (non-blocking)
- Associated documents panel
- "Calculate Final Estimate" button → calls Rust engine
- Final tax estimate display
- "Submit to IRD" button (only shown when all validations pass)
- Confirmation dialog before submission

**Backend calls:**
1. `POST /api/tax-engine/calculate` with full filing payload → returns final estimate
2. `POST /api/filings/:id/submit` → triggers submission workflow

### 6.5 `/filings/[id]/history` — Filing History

**Responsibility:** Audit log of this specific filing.

**Components:**
- Chronological event list: who did what and when
- Status change events
- Document upload events
- Calculation events
- Submission and confirmation events

### 6.6 `/documents` — Document Library

**Responsibility:** Central view of all uploaded documents.

**Components:**
- Filter: associated filing, document type, upload date
- Document table: filename, type, size, associated filing, upload date, actions
- "Upload Document" button
- Bulk delete action (with confirmation)

**Empty state:** "No documents uploaded yet. Upload your first document to get started."

### 6.7 `/documents/[id]` — Document Detail

**Responsibility:** Single document view and management.

**Components:**
- File preview (PDF/images inline; others show icon + download)
- Metadata panel: filename, type, size, upload date, uploader
- Associated filings list
- "Download" button
- "Delete" button (with confirmation dialog)

### 6.8 `/settings` — Account Settings

**Responsibility:** Manage personal account.

**Components:**
- Profile section: name, email, phone
- Password change form
- Connected accounts (future)

### 6.9 `/settings/organization` — Organization Settings

**Responsibility:** Manage organization and members (for Accountant/Admin roles).

**Components:**
- Organization name and details
- Members table: name, email, role, status
- "Invite Member" button
- Remove / deactivate member actions

### 6.10 `/settings/notifications` — Notification Preferences

**Responsibility:** Control alert settings.

**Components:**
- Toggle switches for: filing status changes, document uploads, deadlines, system announcements
- Email / in-app per category

### 6.11 `/settings/security` — Security Settings

**Responsibility:** Manage session and authentication security.

**Components:**
- Active sessions list: device, location, last active
- "Revoke session" per entry
- Two-factor authentication setup (future)
- API keys list (future, for accountant integrations)

### 6.12 Admin Pages

**Responsibility:** Platform-wide management for admins only.

| Page | Responsibility |
|---|---|
| `/admin/users` | List all users, invite, deactivate, change roles |
| `/admin/filings` | Filterable list of all filings across all users and organizations |
| `/admin/audit-log` | Searchable event log with filters: event type, user, date range, entity |
| `/admin/jobs` | BullMQ job queue status: pending, active, completed, failed counts; retry failed jobs |
| `/admin/tax-rules` | View tax rule versions, active rule set, rule set change history |

---

## 7. Backend Module Map

The API (`apps/api/src/modules/`) is organized as a **modular monolith**. Each module owns a domain and exposes a Fastify plugin. Plugins are registered at the app level with a route prefix.

### 7.1 Module Overview

| Module | Prefix | Responsibility |
|---|---|---|
| `auth` | `/api/auth` | Login, register, JWT issuance, session validation, `/me` endpoint |
| `users` | `/api/users` | User CRUD, profile updates, organization membership |
| `filings` | `/api/filings` | Filing lifecycle: create, read, update, submit, status transitions |
| `documents` | `/api/documents` | Document metadata CRUD, upload URL generation, file association |
| `notifications` | `/api/notifications` | Notification preferences, in-app notification delivery |
| `audit` | `/api/audit` | Audit event logging and retrieval |
| `tax-engine` | `/api/tax-engine` | Gateway: proxies requests to the Rust tax engine |
| `jobs` | `/api/jobs` | BullMQ job queue status and management |
| `health` | `/` | Health checks and readiness probes (no `/api` prefix) |

### 7.2 Module Layer Separation

Each module follows a layered structure:

```
src/modules/<name>/
├── <name>.routes.ts     # HTTP layer: validate request, call service, return response
├── <name>.service.ts    # Application logic: orchestrates domain operations
├── <name>.repository.ts # Data access: Drizzle queries against PostgreSQL
└── <name>.types.ts      # Domain types and request/response schemas
```

**Current state:** Modules are currently flat (only `.routes.ts` files exist). The layered structure should be introduced incrementally as modules gain business logic beyond what fits in a route handler.

### 7.3 Key API Contracts

#### Filings

```
POST   /api/filings              → Create filing draft
GET    /api/filings              → List filings (filtered by user/org)
GET    /api/filings/:id          → Get filing detail + sections
PUT    /api/filings/:id          → Update filing (partial or full)
POST   /api/filings/:id/submit   → Submit filing to IRD
GET    /api/filings/:id/history  → Audit log for this filing
```

#### Tax Engine Gateway

```
POST   /api/tax-engine/calculate  → Run full tax calculation
POST   /api/tax-engine/validate   → Validate filing data without calculating
```

Both proxy to the Rust engine. The Node.js layer normalizes the request shape and handles errors.

### 7.4 Jobs Module

The jobs module is both an API (for monitoring) and a producer of background work:

**Produced job types:**
- `tax-recalculate` — triggered when a filing draft changes or on explicit request
- `send-notification` — triggered by workflow events
- `export-filing` — triggered on submission for confirmation PDF generation
- `document-process` — triggered when a document is uploaded (virus scan, OCR, etc.)

**Job queue:** Redis + BullMQ. Workers are defined in `src/jobs/worker.ts`.

---

## 8. Core Data Flows

### 8.1 Frontend → Fastify → PostgreSQL (Durable State)

```
Browser (Next.js)
  │
  │  REST / fetch
  ▼
Fastify API (apps/api)
  │
  ├─── auth plugin      → validates JWT → attaches user context
  │
  ├─── filing.routes   → validates request → service → repository → Drizzle ORM
  │                                                                       │
  │                                                                       ▼
  │                                                           PostgreSQL
  │                                                           (filings,
  │                                                            users,
  │                                                            documents,
  │                                                            audit_logs,
  │                                                            job_runs)
  │
  └─── document.routes → validates request → service → object storage (S3/R2)
                                                                  │
                                                                  ▼
                                                           Presigned URL
                                                           returned to
                                                           frontend
```

### 8.2 Frontend → Fastify → Rust Tax Engine (Calculation)

```
Browser
  │
  │  POST /api/tax-engine/calculate
  ▼
Fastify API
  │
  ├─── validates request shape (Zod)
  ├─── loads filing draft from PostgreSQL (or receives full payload)
  ├─── normalizes payload to engine input schema
  │
  │  HTTP call to Rust engine (env: TAX_ENGINE_URL)
  │
  ▼
Rust Tax Engine
  │
  ├─── applies tax rules for the specified tax year
  ├─── calculates taxable income, deductions, credits, tax owed
  ├─── generates warnings and validation issues
  └─── returns: { summary, breakdown[], issues[], warnings[] }
              │
              ▼
Fastify API
  │
  ├─── stores calculation result against the filing record
  ├─── enqueues follow-up jobs if needed
  └─── returns response to frontend
  │
  ▼
Browser
  │
  └─── displays TaxSummaryCard and validation panel
```

### 8.3 Fastify → Redis/BullMQ → Worker (Async Jobs)

```
Fastify API                         Redis / BullMQ               Worker (jobs/worker.ts)
  │                                        │                              │
  │  queue.add('job-type', payload)         │                              │
  │ ──────────────────────────────────────► │                              │
  │                                        │                              │
  │                                        │  Job pulled from queue        │
  │                                        │ ─────────────────────────────► │
  │                                        │                              │
  │                                        │                   │ processes payload
  │                                        │                   │ calls Rust engine,
  │                                        │                   │ sends notifications,
  │                                        │                   │ updates filing state
  │                                        │                              │
  │                                        │  Job completed / failed       │
  │                                        │ ◄─────────────────────────────│
  │                                        │                              │
  │  GET /api/jobs/:id                     │                              │
  │ ◄──────────────────────────────────────│                              │
```

---

## 9. Filing Status State Machine

Filing status is the authoritative state of a filing. Transitions are **always initiated by the backend** — the frontend only displays status, never mutates it directly.

### 9.1 Status Values

| Status | Meaning |
|---|---|
| `draft` | Created but no data entered yet, or partially completed |
| `in_progress` | Active editing; at least one field has been saved |
| `needs_attention` | Validation errors exist; user must resolve before submitting |
| `ready_for_review` | All required fields complete; ready for user to review and submit |
| `submitted` | Successfully submitted to IRD |
| `completed` | IRD has confirmed receipt and processing |
| `rejected` | IRD rejected the filing; user must revise and resubmit |

### 9.2 Valid Transitions

```
draft ──────────► in_progress
in_progress ───► needs_attention   (validation errors detected)
in_progress ───► ready_for_review  (all required fields valid)
needs_attention ──► in_progress    (user makes corrections)
ready_for_review ──► in_progress   (user edits again)
ready_for_review ──► submitted      (user confirms submission)
submitted ───────► completed       (IRD confirmation received)
submitted ───────► rejected        (IRD rejection received)
rejected ────────► in_progress     (user starts revision)
```

### 9.3 Transition Rules

- Any transition that changes status must be logged as an audit event
- The `needs_attention` state is entered automatically when the Rust engine returns blocking errors during calculation
- Only `ready_for_review` filings can be submitted
- Rejected filings return to `in_progress` with a new revision number

---

## 10. Empty / Loading / Error States

Every surface in the product must handle these three states explicitly.

### 10.1 Empty State

Shown when there is no data to display.

| Page | Empty State Message | CTA |
|---|---|---|
| `/dashboard` | "Your tax dashboard is ready. Start your first filing to get going." | "Start Filing" |
| `/filings` | "No filings yet." | "Start Filing" |
| `/documents` | "No documents uploaded yet." | "Upload Document" |
| `/admin/users` | "No users found." | "Invite User" |
| `/admin/filings` | "No filings match your filters." | Clear filters |

Empty states use the `EmptyState` component with: icon, title, description, and primary action button.

### 10.2 Loading State

Shown while fetching data.

| Surface | Loading Approach |
|---|---|
| Dashboard KPIs | Skeleton cards matching the KPI layout |
| Filing list | Skeleton rows matching table columns |
| Filing wizard | Skeleton form sections |
| Document list | Skeleton rows |
| Admin tables | Skeleton rows with column headers visible |

Use the `Skeleton` component. Do not show full-page spinners for partial loads. Match the skeleton shape to the real content it replaces.

### 10.3 Error State

Shown when a fetch fails.

| Severity | Treatment |
|---|---|
| Non-blocking (e.g., stale activity feed) | Inline banner: "Couldn't load recent activity. [Retry]" |
| Blocking (e.g., filing list failed to load) | Full-surface error: icon + message + "Try again" button |
| Submission failure | Modal dialog with specific error message and instructions |

Errors must be:
- Specific, not generic ("Failed to load filings" vs "Error")
- Actionable ("Try again", "Contact support", "Fix [field]")
- Non-technical for end users
- Visible without relying on color alone

Use `InlineAlert`, `Banner`, or `ConfirmationDialog` depending on context.

---

## 11. Conventions and Notes

### 11.1 URL Naming Conventions

- Use lowercase kebab-case: `/filings`, `/tax-credits`, not `/filingsList` or `/TaxCredits`
- Use plural nouns for collections: `/filings`, `/documents`, `/users`
- Use singular nouns for singular resources: `/documents/[id]`, `/settings`
- Do not use verbs in page routes: use `POST /api/filings` for creation, not `/api/create-filing`

### 11.2 Route Grouping in Next.js

- `(auth)` group: no AppShell, no sidebar, no auth required (except `/login`, `/register`)
- `(dashboard)` group: AppShell layout wrapper, auth required
- Admin pages: same `(dashboard)` group but route-gated by admin role

### 11.3 Known Inconsistencies

These items should be resolved as the product matures:

1. **Duplicate dashboard page:** Both `/(dashboard)/page.tsx` and `/(dashboard)/dashboard/page.tsx` render dashboard content. They should be consolidated. Recommended fix: redirect `/(dashboard)/dashboard/page.tsx` to `/(dashboard)/page.tsx` or make one a 404.

2. **Module flat structure:** All backend modules currently have only a `.routes.ts` file. As business logic grows, introduce `.service.ts` and `.repository.ts` layers per the module separation rules.

3. **Document upload:** Currently a stub. The document upload flow requires a defined object storage strategy (S3, R2, or similar) and presigned URL generation.

4. **Tax engine integration:** `tax-engine.routes.ts` contains `TODO` stubs. The Rust engine service must be stood up and the integration completed before the calculation flow works.

5. **Auth registration:** `POST /register` is a stub. Email verification and organization assignment should be designed before enabling self-registration.

### 11.4 Updating This Document

This IA document should be updated when:
- A new page or route is added
- A backend module is introduced or renamed
- A user flow changes significantly
- A new role is added
- Filing status values or transitions change

It should NOT be updated for:
- CSS class changes
- Component internal refactors that don't change page structure
- Bug fixes that don't change user-facing behavior
