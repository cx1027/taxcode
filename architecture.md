# Architecture

## Overview

This project is a **web-first tax filing application**.

The product serves users primarily through a browser-based experience.  
It is not a mobile-first wallet app, even though the initial visual inspiration comes from a wallet-style Figma reference with soft cards, light surfaces, and rounded UI elements. [file:1]

The system is designed with a clear separation of concerns:

- Web frontend for user interaction and workflow orchestration
- Node.js backend for business workflows and integration logic
- Rust tax engine for deterministic tax calculation and validation
- PostgreSQL for durable data storage
- Redis + BullMQ for asynchronous tasks and background processing

The architecture starts as a **modular monolith plus dedicated tax engine**, with the option to split components later if scale or team structure requires it.

---

## Goals

The architecture should optimize for:

- Clear and efficient web-based tax workflows
- Strong separation between product logic and tax calculation logic
- Safe handling of sensitive tax and filing data
- High maintainability for frequent rule and UI changes
- Incremental delivery from MVP to production scale
- Reusable UI and backend modules
- Strong typing and deterministic behavior in critical areas

---

## Non-Goals

This architecture does not aim to:

- Optimize first for native mobile app UX
- Implement microservices from day one
- Put tax calculation logic in frontend components
- Couple the tax engine tightly to UI concerns
- Over-engineer infrastructure before product-market fit

---

## High-Level System

```text
Browser
  │
  ▼
Next.js Frontend
  │
  ▼
Node.js API Layer
  ├─ Auth / Users / Organizations
  ├─ Filings / Documents / Workflow
  ├─ Notifications / Audit
  ├─ Tax Engine Gateway
  └─ Queue Producers
  │
  ├──────────────► PostgreSQL
  ├──────────────► Redis / BullMQ
  └──────────────► Rust Tax Engine
```

---

## Frontend Architecture

### Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Component library as needed
- Form and table libraries as needed

### Purpose

The frontend is responsible for:

- authentication flows
- dashboard views
- tax filing workflows
- form input and draft editing
- document upload UX
- validation/error display
- review and submit flows
- history and status tracking

### UX Direction

The frontend is **web-first** and should prioritize:

- desktop layout
- sidebar navigation
- top-level dashboard structure
- long-form input usability
- forms, tables, summaries, status panels
- accessible and keyboard-friendly interactions

The visual language may inherit from the wallet-style Figma:
- soft backgrounds
- white cards
- subtle shadows
- rounded surfaces

But the frontend must not directly replicate:
- bottom tab navigation
- single-column phone layouts
- mobile card stacking as the default desktop experience [file:1]

### Frontend Boundaries

The frontend must not own:
- tax calculation rules
- filing state transitions that belong to backend domain rules
- authoritative financial or tax calculations

The frontend may display:
- calculation results
- validation issues
- workflow status
- tax summaries returned from backend and tax engine

---

## Backend Architecture

### Stack

- Node.js
- Fastify or NestJS
- TypeScript
- PostgreSQL access layer / ORM or query builder
- Redis
- BullMQ

### Purpose

The backend is the business workflow layer.

It is responsible for:

- auth and session-related concerns
- user and organization management
- filing draft lifecycle
- filing submission flow
- document metadata and storage integration
- audit logging
- notification orchestration
- integration with Rust tax engine
- queue job production and orchestration

### Backend Style

The backend should begin as a **modular monolith** with clearly separated modules, such as:

- auth
- users
- organizations
- filings
- documents
- notifications
- audit
- tax-engine-gateway
- jobs

Each module should separate:
- transport / controller layer
- service / application logic
- data access
- domain types and rules where appropriate

### Backend Boundaries

The backend should not:
- duplicate tax calculation logic already handled in Rust
- place complex rule computation in controllers
- become a generic “everything in one file” API layer

The backend should:
- orchestrate tax calculation requests
- persist filing inputs and outputs
- own business workflow transitions
- expose stable typed API contracts

---

## Rust Tax Engine

### Purpose

The Rust engine is the **tax calculation core**.

It is responsible for:

- deterministic tax calculations
- rule evaluation
- validation logic
- warnings and issues generation
- tax breakdown generation
- rule versioning support
- batch recalculation support

### Inputs

Typical engine inputs include:

- filing draft payload
- taxpayer context
- tax year / rule version
- related numeric and categorical inputs
- relevant document completeness indicators

### Outputs

Typical engine outputs include:

- tax summary
- calculation breakdown
- validation issues
- warnings
- eligibility results
- computed fields for review and submission

### Why Rust

Rust is chosen here because tax logic benefits from:

- deterministic behavior
- strong typing
- explicit rule modeling
- safe concurrency
- high confidence for critical logic
- clear testability for edge cases

### Engine Boundaries

Rust should not handle:

- authentication
- page rendering
- generic CRUD
- user interface concerns
- unrelated product workflow orchestration

The Rust layer should behave as a focused calculation engine, either:
- as a separate service
- or as a separately deployable module with a stable interface

---

## Data Architecture

### Primary Database

- PostgreSQL is the source of truth

### Core Data Domains

The main domains likely include:

- users
- organizations
- filings
- filing_sections
- tax_profiles
- documents
- submission_records
- audit_logs
- notifications
- job_runs
- tax_rule_versions

### Principles

Database design should emphasize:

- explicit relationships
- auditable state changes
- safe migrations
- normalized core entities
- traceability of filing lifecycle
- clear status modeling

### Data Ownership

- Frontend owns temporary UI state only
- Backend owns workflow and persistence state
- Rust engine owns calculation logic, not persisted workflow truth
- PostgreSQL stores authoritative business state

---

## Queue and Async Processing

### Stack

- Redis
- BullMQ

### Use Cases

Background jobs should handle tasks such as:

- recalculation jobs
- export generation
- email notifications
- scheduled reminders
- document processing
- sync or reconciliation tasks
- large batch validation runs

### Principles

Async processing must support:

- retries
- idempotency
- visibility into failure
- structured logging
- traceable payloads
- explicit ownership of job types

### Boundaries

Queue workers should not silently mutate critical filing states without auditability.  
Any important workflow mutation should remain explicit and traceable.

---

## File and Document Handling

The product is expected to support user-submitted documents.

The architecture should separate:

- file storage concerns
- document metadata
- document-to-filing associations
- document processing status
- security and access control

Documents should be treated as sensitive user data.  
Upload, retrieval, preview, and deletion flows must respect authorization boundaries.

---

## Security Model

This system handles sensitive tax data.

### Security priorities

- strong authentication and authorization
- environment-based secret management
- secure file handling
- audit logs for important state changes
- minimal data exposure
- validation at system boundaries
- careful handling of personally identifiable information

### Security boundaries

- frontend never stores secrets
- backend enforces authorization
- tax engine only receives the data it needs
- logs must avoid leaking sensitive values where possible

---

## Deployment Topology

### Frontend

- Next.js deployed on Vercel

### Backend

- Node.js API deployed on Railway, Fly.io, or AWS

### Tax Engine

- Rust engine deployed either:
  - as a separate service
  - or as a dedicated API/internal service

### Infrastructure

- PostgreSQL hosted separately
- Redis hosted separately
- object/file storage as needed
- observability and logging added progressively

---

## Environment Strategy

Recommended environments:

- local
- development
- staging
- production

Each environment should maintain isolated configuration for:

- database
- Redis
- object storage
- API URLs
- auth secrets
- tax engine endpoints
- email or notification integrations

---

## Module Boundaries

### Frontend owns

- page composition
- visual presentation
- form UX
- local editing state
- status display

### Backend owns

- business workflows
- persistence
- auth and permissions
- filing lifecycle
- orchestration of calculations and jobs

### Rust engine owns

- tax rules
- calculations
- validation logic
- warnings and breakdowns

### Database owns

- durable source-of-truth records
- auditable state history
- filing and document metadata

### Queue owns

- asynchronous processing
- deferred workloads
- retries and worker execution

---

## Request Flow Examples

### Draft save flow

1. User edits filing form in frontend
2. Frontend submits draft payload to Node API
3. Node validates request shape and permissions
4. Node persists draft to PostgreSQL
5. Node optionally enqueues follow-up processing
6. Frontend receives saved state and updated metadata

### Calculation flow

1. User requests calculation or preview
2. Frontend calls Node API
3. Node loads current filing draft
4. Node calls Rust tax engine with normalized input
5. Rust returns summary, breakdown, and issues
6. Node stores or returns results as needed
7. Frontend displays summary and validation results

### Submission flow

1. User submits completed filing
2. Node checks draft completeness and permissions
3. Node requests final validation from Rust engine
4. Node transitions filing status if validation passes
5. Node records audit event
6. Node enqueues notifications or export jobs

---

## Scalability Strategy

This architecture is intentionally conservative at first.

### Initial phase

- modular monolith backend
- single frontend app
- dedicated Rust engine
- PostgreSQL + Redis
- minimal infrastructure overhead

### Growth phase

Possible future evolution:

- split heavy background workers
- isolate document processing
- scale Rust engine independently
- add read-model optimizations
- introduce service boundaries only when justified by load or team structure

The architecture should evolve from actual bottlenecks, not assumptions.

---

## Observability

The system should progressively support:

- structured backend logs
- worker logs
- engine execution visibility
- request correlation IDs
- job traceability
- basic metrics and alerts

Important flows to observe:

- filing creation
- draft save failures
- calculation failures
- submission failures
- queue retries
- document processing failures

---

## Testing Strategy

### Frontend

- component tests where valuable
- end-to-end tests for critical filing flows
- accessibility checks for primary pages

### Backend

- API contract tests
- service-level tests for workflow transitions
- integration tests for filing + calculation flow

### Rust Engine

- rule and calculation tests
- edge case coverage
- deterministic regression tests
- versioned rule behavior verification

---

## Guiding Principles for Contributors

When changing this architecture:

- preserve web-first UX priorities
- keep tax logic out of frontend code
- keep tax logic centralized in Rust where appropriate
- avoid accidental coupling between layers
- prefer explicit interfaces
- document architectural changes
- evolve incrementally

If a change crosses frontend, backend, database, or engine boundaries, document the reason and impact.

---

## Open Questions

This section should be updated over time with unresolved architectural decisions, such as:

- exact auth provider choice
- ORM/query layer choice
- object storage provider
- engine transport mechanism
- background processing topology
- deployment target for production scale
- audit log retention strategy
- document retention and compliance requirements