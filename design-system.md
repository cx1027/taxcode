# Design System

## Overview

This design system defines the visual and interaction rules for the web-first tax filing application.

The initial visual inspiration comes from a wallet-style mobile Figma reference with:
- soft pale background
- white cards
- large rounded corners
- subtle shadows
- modular dashboard surfaces [file:1]

However, this product is **not** a mobile wallet app.  
It is a **web-first tax workflow product**.

This means the design system must:

- preserve the visual tone of the Figma reference
- translate mobile card aesthetics into desktop web layouts
- support form-heavy tax workflows
- support tables, step flows, summaries, and validation panels
- prioritize clarity, usability, and trust over decorative UI

This document is the single reference for:
- visual foundations
- interaction rules
- component usage
- pattern guidance
- implementation direction for frontend engineers

---

## Design Principles

### 1. Web-first, not mobile-first

The product is primarily used in a browser.
Layouts, navigation, and interactions must be optimized for desktop and large tablet experiences first.

### 2. Calm and trustworthy

Tax filing is high-friction and high-trust.
The UI should feel calm, predictable, spacious, and reliable.

### 3. Clear over clever

The system should make it obvious:
- what the user is doing
- where they are in the filing process
- what is missing
- what is complete
- what requires action

### 4. Modular, not cluttered

Use modular cards and panels for grouping information, but do not turn every screen into a pile of unrelated boxes.

### 5. Beauty must support function

The wallet-inspired visual language is welcome, but aesthetics must never reduce form clarity, table readability, or status visibility.

---

## Figma Translation Rules

The attached Figma/image is a **style reference**, not a web layout blueprint. [file:1]

### Preserve from the Figma

- soft background tone
- white cards
- gentle shadows
- rounded containers
- light, airy spacing
- visual modularity
- restrained accent colors
- clean data cards

### Translate for Web

- bottom navigation becomes left sidebar
- narrow phone cards become dashboard panels
- single-column flows become multi-column desktop layouts
- wallet balance cards become filing summary or tax status cards
- mobile lists become desktop tables or split-panel lists
- tap-first interactions become keyboard- and mouse-friendly interactions

### Do not copy directly

Do not reproduce:
- phone-width centered app shells
- fake mobile device framing
- default bottom tab navigation
- long mobile-style endless card stacks as the main desktop pattern
- “wallet app” naming, labels, or information architecture unless functionally relevant

---

## Product Surfaces

The interface is composed of these primary surface types:

### 1. App Shell

Persistent structural layout for:
- sidebar
- topbar
- content container
- optional secondary panel

### 2. Cards

Used for:
- tax summary
- filing status
- deadlines
- quick actions
- alerts
- small analytics

### 3. Forms

Used for:
- taxpayer data
- income inputs
- deduction inputs
- supporting details
- review and confirmation

### 4. Tables / Lists

Used for:
- filing history
- uploaded documents
- notifications
- audit-like activity views
- accountant/admin workflows

### 5. Summary Panels

Used for:
- current tax result
- warnings
- completeness state
- next-step guidance

---

## Foundations

## Color

The palette should feel light, calm, and trustworthy.

### Color roles

Use semantic roles rather than arbitrary colors:

- `bg` — application background
- `surface` — primary card background
- `surface-subtle` — secondary panel background
- `border` — dividers and input borders
- `text` — primary text
- `text-muted` — secondary text
- `text-faint` — tertiary text
- `primary` — key action color
- `success` — completed/valid states
- `warning` — caution/incomplete states
- `danger` — blocking/error states
- `info` — neutral informational states

### Palette direction

Recommended palette behavior:

- background: pale cool neutral
- surfaces: white / near white
- primary accent: soft blue or blue-teal
- warning: warm amber
- success: muted green
- danger: restrained rose/red

### Rules

- use color sparingly
- reserve strong color for state, action, or emphasis
- do not flood dashboards with too many competing accent colors
- state colors must remain accessible and readable
- avoid neon, harsh gradients, or overly glossy fintech styling

---

## Typography

Typography should feel modern, readable, and neutral.

### Roles

- Page title
- Section title
- Card title
- Body text
- Helper text
- Label text
- Status text
- Table text

### Typography rules

- prioritize readability over personality
- use strong hierarchy between title, section, body, and metadata
- keep numeric values highly legible
- use tabular numerals where relevant for financial data
- avoid overly decorative fonts
- avoid tiny low-contrast helper text

### Recommended behavior

- body text should remain comfortable for long form filling
- labels should be concise and easy to scan
- large numeric values should stand out in summary cards
- error and validation copy must be immediately readable

---

## Spacing

Spacing should create calm and clarity.

### Principles

- use generous spacing around major sections
- use consistent internal card padding
- separate groups clearly in long forms
- avoid visually noisy dense layouts unless needed for data tables
- preserve breathing room around key actions and summaries

### Spacing tiers

Use a consistent token system such as:

- xs
- sm
- md
- lg
- xl
- 2xl

These should map consistently to:
- inline gaps
- stack spacing
- card padding
- section spacing
- page gutters

---

## Radius

The visual system inherits a rounded style from the Figma reference. [file:1]

### Radius rules

- cards: medium to large radius
- inputs: medium radius
- buttons: medium radius
- pills/chips: full radius
- tables: subtler radius than cards unless inside card containers

Avoid:
- inconsistent radius across components
- exaggerated bubble-like rounding everywhere
- combining sharp and very rounded elements without reason

---

## Shadow

Shadows should remain soft and quiet.

### Shadow rules

- use subtle elevation only
- prefer a layered soft shadow rather than a harsh drop shadow
- use shadow to clarify surface hierarchy
- do not over-shadow every card equally

### Suggested hierarchy

- low elevation: default card
- medium elevation: active / highlighted card
- no heavy floating/glow effects for serious workflow screens

---

## Borders and Dividers

Use borders primarily for:
- input structure
- table separation
- subtle grouping
- focus states

Rules:
- borders should be low-contrast
- dividers should support information structure, not dominate it
- avoid thick dark borders unless indicating clear state or focus

---

## Motion

Motion should be minimal and purposeful.

Use motion for:
- loading transitions
- panel expansion/collapse
- toast appearance
- tab or step transition
- hover feedback
- modal appearance

Avoid:
- decorative motion for its own sake
- excessive floating animations
- flashy onboarding-like motion in serious filing flows

Motion must support clarity and calm.

---

## Layout System

## App Shell

The default web layout is:

- left sidebar
- top header
- main content region
- optional right summary/insight panel

This is the primary layout for dashboard and authenticated product surfaces.

## Grid

Recommended desktop structure:

- 12-column grid for large screens
- 8-column adaptation for medium screens
- single-column fallback for narrow screens

### Layout behavior

- dashboard cards can span multiple columns
- forms should prioritize readable content width
- large tables can use wider sections
- summary side panels may appear on desktop and collapse below on smaller screens

## Content Width

Use width intentionally:

- forms: medium width for readability
- tables: wide
- summaries: narrow to medium
- dashboard: mixed widths depending on card purpose

Avoid forcing every page into the same max width.

---

## Navigation Patterns

## Sidebar

Use the sidebar for primary product navigation:
- Dashboard
- Filings
- Documents
- Messages or Notifications
- Settings
- Admin (if role permits)

### Sidebar rules

- stable order
- clear active state
- icon + text labels
- no mobile bottom-nav behavior on desktop

## Topbar

Use the topbar for:
- search if needed
- user menu
- environment / org switch if needed
- page-level actions
- notifications
- breadcrumb or page title support

---

## Form Patterns

Tax filing is a form-heavy workflow, so forms are first-class.

### Form design principles

- group related fields into sections
- show labels clearly
- provide helper text only where useful
- surface validation near the field and at section/page level
- allow save draft behavior
- show completion/progress clearly

### Section structure

A good form section often contains:

- section title
- section description
- grouped fields
- validation status
- optional examples or help text

### Long form guidance

For long forms:
- split by steps or sections
- keep current position visible
- provide sticky summary or progress if helpful
- avoid giant uninterrupted forms

### Error handling

Errors must be:
- visible
- actionable
- specific
- non-technical

Do not rely on color alone to communicate form problems.

---

## Table Patterns

Tables are important for web-first tax products.

Use tables for:
- filing history
- uploaded documents
- team/admin views
- activity logs
- reconciliation-like views

### Table rules

- preserve strong row/column readability
- use clear alignment
- numeric columns should align consistently
- actions should be visible but not noisy
- rows should support scanning first, detail second

Avoid:
- turning everything into cards when tabular comparison is better
- cramped dense tables without hierarchy
- inconsistent action placement

---

## Card Patterns

Cards are a key visual inheritance from the Figma reference. [file:1]

Use cards for:
- KPI summaries
- filing status
- tax estimate preview
- checklist summaries
- deadline reminders
- quick actions

### Card anatomy

Typical card structure:
- title
- supporting text or meta
- key value or state
- optional action
- optional footer/meta row

### Card rules

- cards should have a clear purpose
- each card should emphasize one main thing
- avoid overloading small cards with too many controls
- use cards to group, not to fragment information unnecessarily

---

## Summary and Validation Panels

These are critical for tax UX.

Use summary panels to show:
- current estimate
- outstanding missing info
- warning count
- filing status
- review checklist

Use validation panels to show:
- errors
- warnings
- incomplete steps
- required document status

### Rules

- validation should be visible before submission
- warnings should be differentiated from blocking errors
- summary should not hide important assumptions
- totals and breakdowns must remain understandable

---

## Status System

Status is central to the product.

### Common status types

- draft
- in progress
- needs attention
- ready for review
- submitted
- completed
- rejected
- error

### Status rules

- each status should have a consistent visual treatment
- status should appear in both compact and expanded contexts
- color should be paired with text/icon where relevant
- status chips should be readable and not rely only on hue

---

## Empty States

Every empty state should be intentional.

Examples:
- no filings yet
- no uploaded documents
- no notifications
- no connected entity/account
- no recent activity

A good empty state includes:
- clear title
- short explanation
- primary next action
- optional helpful illustration or icon

Avoid vague messages like “Nothing here”.

---

## Loading States

Use skeletons or progressive loading where useful.

Rules:
- match the structure of the real content
- avoid jarring spinners-only experiences on large surfaces
- show loading where the user expects it
- keep transitions calm and fast

---

## Component Inventory

The following components should exist or be planned:

### Layout
- AppShell
- Sidebar
- Topbar
- PageHeader
- SecondaryPanel

### Cards
- StatCard
- FilingStatusCard
- TaxSummaryCard
- ReminderCard
- QuickActionCard

### Forms
- FormSection
- StepNavigator
- FieldGroup
- ValidationSummary
- InlineFieldError
- SaveDraftBar

### Documents
- UploadPanel
- DocumentRow
- DocumentStatusBadge

### Data display
- DataTable
- ActivityList
- StatusBadge
- SummaryBreakdown
- EmptyState

### Feedback
- Toast
- Banner
- InlineAlert
- ConfirmationDialog

---

## Accessibility

Accessibility is required, not optional.

### Requirements

- semantic headings
- visible focus states
- keyboard navigation
- sufficient color contrast
- screen-reader friendly labels
- descriptive errors
- accessible table markup
- accessible file upload flows

### Rules

- do not communicate state using color alone
- do not make low-contrast muted text carry critical meaning
- ensure form labels are explicit
- ensure modal and dialog focus handling is correct

---

## Content and Voice

Tone should feel:
- calm
- clear
- trustworthy
- non-judgmental
- action-oriented

### Copy rules

Prefer:
- “Review your filing details”
- “Missing supporting documents”
- “Save draft”
- “Ready to submit”

Avoid:
- vague fintech marketing language
- playful copy in serious error states
- technical backend jargon exposed to end users

---

## Implementation Notes

Frontend engineers should map this system into:
- reusable design tokens
- consistent utility usage
- shared components
- predictable variants
- documented patterns

Where possible, a component should document:
- purpose
- anatomy
- variants
- states
- accessibility notes
- example usage

This follows common design-system documentation practice, where useful docs include foundations, components, patterns, accessibility, and contribution guidance.[web:118][web:120][web:125]

---

## Contribution Rules

When introducing a new component or pattern:

1. check whether an existing component can be reused
2. document why a new component is needed
3. define its purpose and boundaries
4. define variants and states
5. add usage guidance
6. ensure accessibility is considered

Do not add components that are:
- visually unique but functionally redundant
- inconsistent with the existing system
- optimized only for one page with no broader design rationale

---

## Anti-Patterns

Avoid these mistakes:

- copying the mobile wallet layout directly into desktop web
- using cards for everything, including when forms or tables are clearer
- low-contrast UI that looks elegant but hides workflow state
- inconsistent radius/shadow across components
- too many accent colors in one dashboard
- decorative charts without meaningful tax relevance
- overloaded cards with too many actions
- hiding validation until the final step
- relying on “beautiful dashboard” patterns while neglecting actual filing usability

---

## Design QA Checklist

Before a new screen is considered complete, verify:

- Is it clearly web-first?
- Does it preserve the intended visual language from the Figma without copying mobile structure? [file:1]
- Is the information hierarchy obvious?
- Are forms readable and usable?
- Are statuses and warnings visible?
- Are loading, empty, and error states handled?
- Is keyboard navigation reasonable?
- Are tables or cards used appropriately for the content?
- Is the page calm and trustworthy rather than flashy?
- Does the UI support tax workflow confidence?

---

## Versioning

This document should evolve with the product.

When the design system changes:
- update this file
- update relevant component docs
- update tokens or theme references
- note any pattern deprecations
- keep design and code aligned

Documentation works best when it is practical, easy to navigate, and updated alongside component and pattern changes.[web:117][web:121]