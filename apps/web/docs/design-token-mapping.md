# Design Token Mapping

> **Source**: Figma file (`FigmaFile.fig`) — binary format, read via existing CSS tokens in `globals.css` + `tailwind.config.ts`.
> **Note**: Figma MCP was not available. All hex/hsl values below are derived from the implemented CSS variable tokens, which were created to match the Figma visual reference. Values marked ⚠️ are inferred from design-system.md semantics rather than extracted from Figma.
>
> **Reference**: `design-system.md` (semantic roles), `.cursor/rules/design-system-rules.mdc`, `.cursor/rules/ui-ux-rules.mdc`

---

## Part A: Design Token Reference

### 1. Color Tokens

#### Surface & Background

| Token | Role | HSL | Hex (approx) | Usage |
|---|---|---|---|---|
| `--bg` | Page background | `210 20% 98%` | `#F4F6F9` | Root page background |
| `--surface` | Primary card/panel | `0 0% 100%` | `#FFFFFF` | All cards, modals |
| `--surface-subtle` | Secondary inner panel | `210 15% 97%` | `#F7F8FA` | Nested areas, table headers |
| `--surface-muted` | Subdued surface | `210 15% 95%` | `#F2F4F7` | Hover states, subtle fills |
| `--background` | Legacy alias for `--bg` | `210 20% 98%` | `#F4F6F9` | Backwards-compatible |

#### Border & Dividers

| Token | Role | HSL | Hex (approx) |
|---|---|---|---|
| `--border` | Default border | `210 13% 88%` | `#DDE1E9` |
| `--input` | Input borders | `210 13% 88%` | `#DDE1E9` |
| `--ring` | Focus ring | `213 85% 55%` | `#3B82F6` |

#### Text

| Token | Role | HSL | Hex (approx) | Usage |
|---|---|---|---|---|
| `--foreground` | Primary text | `215 16% 18%` | `#272E38` | All primary text |
| `--text` | Alias for foreground | `215 16% 18%` | `#272E38` | CSS var alias |
| `--text-muted` | Secondary text | `215 10% 45%` | `#6B7280` | Meta, helper, captions |
| `--text-faint` | Tertiary/placeholder | ⚠️ `215 8% 60%` | `#8C95A3` | Placeholder only |

#### Primary

| Token | Role | HSL | Hex (approx) |
|---|---|---|---|
| `--primary` | Primary action | `213 85% 55%` | `#3B82F6` |
| `--primary-foreground` | On primary | `0 0% 100%` | `#FFFFFF` |

#### Status Colors

| Token | Role | HSL | Hex (approx) | Usage |
|---|---|---|---|---|
| `--success` | Completed / valid | `142 71% 45%` | `#22C55E` | Status badges, checkmarks |
| `--success-foreground` | On success | `0 0% 100%` | `#FFFFFF` |
| `--warning` | Caution / incomplete | `38 92% 50%` | `#F59E0B` | Warnings, attention |
| `--warning-foreground` | On warning | `0 0% 100%` | `#FFFFFF` |
| `--destructive` | Blocking / error | `0 84% 60%` | `#EF4444` | Errors, destructive actions |
| `--destructive-foreground` | On destructive | `0 0% 100%` | `#FFFFFF` |
| `--info` | Neutral informational | `213 85% 55%` | `#3B82F6` | Info badges (same as primary) |
| `--info-foreground` | On info | `0 0% 100%` | `#FFFFFF` |

#### Sidebar

| Token | Role | HSL | Hex (approx) |
|---|---|---|---|
| `--sidebar` | Sidebar background | `215 16% 16%` | `#252C37` |
| `--sidebar-foreground` | Sidebar default text | `210 15% 85%` | `#D1D5DB` |
| `--sidebar-accent` | Active nav highlight | `213 85% 55%` | `#3B82F6` |
| `--sidebar-accent-foreground` | On sidebar accent | `0 0% 100%` | `#FFFFFF` |
| `--sidebar-border` | Sidebar dividers | `215 12% 22%` | `#323B4B` |
| `--sidebar-ring` | Focus ring in sidebar | `213 85% 55%` | `#3B82F6` |

---

### 2. Typography Tokens

| Role | Tailwind class | Font Size | Line Height | Weight | Usage |
|---|---|---|---|---|---|
| `page-title` | `text-page-title` | 30px / 1.875rem | 36px / 2.25rem | 700 | Page-level headings |
| `section-title` | `text-section-title` | 20px / 1.25rem | 28px / 1.75rem | 600 | Panel / section headings |
| `card-title` | `text-card-title` | 16px / 1rem | 24px / 1.5rem | 600 | Card headings |
| `body` | `text-body` | 15px / 0.9375rem | 26px / 1.625rem | 400 | Default paragraph |
| `helper` | `text-helper` | 13px / 0.8125rem | 22px / 1.375rem | 400 | Supporting text, meta |
| `label` | `text-label` | 14px / 0.875rem | 20px / 1.25rem | 500 | Form labels |
| `status` | `text-status` | 12px / 0.75rem | 16px / 1rem | 500 | Status badge text |
| `table` | `text-table` | 14px / 0.875rem | 20px / 1.25rem | 400 | Table cells |

**Font family**: Not yet specified in tokens. Recommended: Inter (UI), with system-ui fallback. Tabular numerals (`font-variant-numeric: tabular-nums`) should be applied via `.tabular-nums` utility class for all financial/numeric values.

---

### 3. Spacing Tokens (4px grid)

| Token | Value | Equivalent | Usage |
|---|---|---|---|
| `xs` | 0.5rem | 8px | Tight inline gaps, chip padding |
| `sm` | 0.75rem | 12px | Compact padding, small gaps |
| `md` | 1rem | 16px | Default padding, card inner gap |
| `lg` | 1.5rem | 24px | Section spacing, card padding |
| `xl` | 2rem | 32px | Major section gaps, page gutters |
| `2xl` | 3rem | 48px | Page-level spacing |

**Usage in Tailwind**: `gap-xs`, `gap-sm`, `gap-md`, `gap-lg`, `gap-xl`, `gap-2xl`. Padding: `p-xs` through `p-2xl`, `px-xs` through `px-2xl`, `py-xs` through `py-2xl`.

---

### 4. Border Radius Tokens

| Token | Value | Equivalent | Usage |
|---|---|---|---|
| `--radius-card` | 0.75rem | 12px | Primary card surfaces |
| `--radius-input` | 0.5rem | 8px | Form inputs, form fields |
| `--radius-button` | 0.5rem | 8px | Action buttons |
| `--radius-badge` | 0.375rem | 6px | Status badges |
| `--radius-chip` | 9999px | full pill | Tags, chips, pills |

**Tailwind classes**: `rounded-card`, `rounded-input`, `rounded-button`, `rounded-badge`, `rounded-chip`.

---

### 5. Shadow Tokens

| Token | Tailwind class | Elevation | Usage |
|---|---|---|---|
| `--shadow-sm` (via `shadow-soft-sm`) | `shadow-soft-sm` | Lowest | Default card at rest |
| `--shadow-md` (via `shadow-soft`) | `shadow-soft` | Default | Standard card shadow |
| `--shadow-hover` (via `shadow-soft-md`) | `shadow-soft-md` | Medium | Hovered / highlighted card |
| `--shadow-lg` (via `shadow-soft-lg`) | `shadow-soft-lg` | High | Modal, dropdown, popover |
| `--shadow-xl` (via `shadow-soft-xl`) | `shadow-soft-xl` | Highest | Tooltip, nested popover |

---

## Part B: Mobile → Web Component Mapping

### Navigation

| Figma (Mobile) | Web Equivalent | Icon Mapping | Interaction Difference |
|---|---|---|---|
| Bottom tab: Dashboard | Sidebar item: Dashboard | `Home` → `LayoutDashboard` (Lucide) | Desktop: hover shows tooltip; tap → click |
| Bottom tab: Transactions | Sidebar item: Filings | `CreditCard` → `FileText` (Lucide) | Desktop: hover shows active state; click → navigate |
| Bottom tab: Cards | Sidebar item: Documents | `Wallet` → `FolderOpen` (Lucide) | Desktop: sidebar persists; mobile hides on scroll |
| Bottom tab: Reports | *(not a primary nav item — use topbar or secondary panel)* | — | — |
| Bottom tab: Settings | Sidebar item: Settings | `Settings` → `Settings` (Lucide) | Same pattern |

**Interaction translation**:
- Mobile tap → Desktop click (same)
- Mobile bottom tab active indicator → Desktop sidebar active background + accent left border
- Mobile swipe between tabs → Desktop sidebar click (no gesture needed on desktop)
- Mobile tab bar with badge → Desktop sidebar item with count badge (future)

### Card Components

| Figma (Mobile) | Web Component | Layout Transformation | Information Density |
|---|---|---|---|
| Mobile wallet KPI card (single column) | `StatCard` | Single column → 4-column responsive grid | Web can show trend + icon + value simultaneously |
| Mobile balance card | `TaxSummaryCard` | Hero top card → page-level summary panel | Web shows full breakdown, not just total |
| Mobile transaction row | `DataTable` row | Single column → multi-column table | Web shows date, type, amount, status in one row |
| Mobile reminder card | `ReminderCard` | Full-width card → dashboard widget | Web can show multiple reminders in grid |
| Mobile CTA banner | `PageHeader` actions prop | Inline banner → top-right action button | Desktop: button group at top, not bottom-fixed |

**Layout rule**: Mobile single-column card stack → Web 12-column grid. Cards span 1–4 columns depending on priority.

### List Components

| Figma (Mobile) | Web Component | Action Translation |
|---|---|---|
| Swipe-to-reveal actions | Row hover actions + kebab menu | Web: hover reveals action icons on the right |
| Pull-to-refresh | Auto-refresh + manual refresh button in topbar | Web: no pull gesture, use refresh icon in topbar |
| Mobile list item | `DataTable` row or `ActivityList` item | Web: keyboard navigable, hover state replaces swipe |
| Infinite scroll | Pagination or virtual scroll | Web: `DataTable` with pagination controls |

### Form Components

| Figma (Mobile) | Web Component | Keyboard Difference |
|---|---|---|
| Number pad (mobile) | Full keyboard input | Web: `<input type="number">` with increment/decrement where appropriate |
| Single-step mobile form | `FormSection` with `StepNavigator` | Web: Wizard with step indicator at top |
| Mobile floating label input | Standard label above input | Web: label always visible (no floating label) |
| Multi-step wizard (mobile) | `StepNavigator` with step dots/labels at top | Web: step progress visible, previous steps accessible |

### Action Patterns

| Figma (Mobile) | Web Equivalent | Note |
|---|---|---|
| Primary CTA button (bottom fixed) | `Button` variant="default" in page header or footer | Desktop: not fixed-bottom; inline in layout |
| FAB (Floating Action Button) | Header action button or `PageHeader.actions` prop | Desktop: no floating button; use prominent header button |
| Swipe-to-dismiss / swipe-to-action | Confirmation dialog + row action button | Web: explicit confirmation dialog for destructive actions |
| Bottom sheet | Modal or side panel | Desktop: `Dialog` or `SecondaryPanel` instead of bottom sheet |
| Destructive swipe | Red "Delete" row action button + confirmation dialog | Desktop: requires explicit click + confirm |

---

## Part C: Verification & Alignment

### Alignment with `design-system.md`

| design-system.md Requirement | Status | Notes |
|---|---|---|
| Semantic color roles: bg, surface, border, text, text-muted, text-faint, primary, success, warning, danger, info | ✅ Done | `--text-faint` added as inferred value |
| Per-component radius: card, input, button, chip, badge | ✅ Done | Per-component radius CSS vars added |
| Shadow hierarchy: sm / md / lg | ✅ Done | `shadow-soft-sm`, `shadow-soft-md`, `shadow-soft-lg` defined |
| Spacing tokens: xs, sm, md, lg, xl, 2xl | ✅ Done | Added as Tailwind spacing tokens |
| 4px grid base | ✅ Done | All spacing values are multiples of 4px |
| Typography roles: page-title, section-title, card-title, body, helper, label, status, table | ✅ Done | All defined as Tailwind fontSize tokens |
| Tabular numerals for financial data | ✅ Done | `.tabular-nums` utility class in globals.css |
| Sidebar navigation (not bottom nav) | ✅ Done | Implemented in `Sidebar.tsx` |
| Dashboard grid (not single-column) | ✅ Done | `DashboardPage` uses `grid-cols-4` for stats |

### Contradictions & Resolutions

| Item | Design-system says | Implementation does | Resolution |
|---|---|---|---|
| `--surface-subtle` | Defined in design-system.md | Not in original `globals.css` | Added as `210 15% 97%` — slightly lighter than `--secondary` |
| Per-component radius | Mandates card/input/button/chip/badge distinction | Original only had `--radius` (0.75rem) | Added per-component radius CSS vars |
| `text-faint` token | Defined in design-system.md | Not in original `globals.css` | Added as inferred value `215 8% 60%` |

### Figma → Code Gaps (requires Figma MCP)

| Value | Status | How to fill |
|---|---|---|
| Exact color hex values from Figma Color Styles | ⚠️ Not extracted | Enable Figma MCP, or update tokens from Figma screenshot |
| Typography line-height / letter-spacing exact values | ⚠️ Not extracted | Use the values defined above — they are aligned with design-system.md |
| Exact radius px values from Figma corner radius | ⚠️ Not extracted | Values above are reasonable defaults based on 12px card / 8px input / 6px badge |
| Exact shadow blur / spread from Figma Effects | ⚠️ Not extracted | Current soft shadow values are visually aligned with the Figma reference |

---

## Usage Guide

### Using Color Tokens

```tsx
// Use semantic Tailwind classes first
<div className="bg-surface text-foreground border-border">

// For status, use status tokens
<span className="bg-success/10 text-success">Completed</span>
<span className="bg-warning/10 text-warning">Needs Attention</span>
<span className="bg-destructive/10 text-destructive">Error</span>
<span className="bg-info/10 text-info">Info</span>
```

### Using Spacing Tokens

```tsx
// Prefer semantic spacing tokens
<div className="p-lg gap-md">
  <div className="p-sm">Compact</div>
  <div className="p-md">Default</div>
  <div className="p-xl">Major section</div>
</div>
```

### Using Border Radius

```tsx
// Use semantic radius classes
<div className="rounded-card">Primary card</div>
<input className="rounded-input border border-border" />
<button className="rounded-button">Action</button>
<span className="rounded-badge bg-success text-success-foreground">Badge</span>
<span className="rounded-chip">Chip / Pill</span>
```

### Using Typography

```tsx
// Use semantic text classes
<h1 className="text-page-title">Page Title</h1>
<h2 className="text-section-title">Section Title</h2>
<h3 className="text-card-title">Card Title</h3>
<p className="text-body">Body text</p>
<p className="text-helper">Helper / supporting text</p>
<label className="text-label">Form label</label>
<span className="text-status">Status</span>

// For financial values, always use tabular numerals
<span className="tabular-nums">$4,280.00</span>
```
