# Sudaksha S-CRM/OMS - Comprehensive Rebuild Plan

**Document Version:** 1.0  
**Date:** 2025-12-18  
**Status:** Planning Phase

---

## Executive Summary

This document outlines the comprehensive rebuild plan for Sudaksha S-CRM/OMS, covering all 12 functional modules, workflow engine, integrations, and Bigin-inspired enhancements. The rebuild will follow a **modular, phased approach** prioritizing **B2B Corporate National** and **B2C** verticals first, with full Excel import support for data migration.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Data Model & Schema](#data-model--schema)
4. [Module Breakdown (All 12 Modules)](#module-breakdown-all-12-modules)
5. [Phase-by-Phase Implementation Plan](#phase-by-phase-implementation-plan)
6. [Integration Architecture](#integration-architecture)
7. [Workflow Engine Design](#workflow-engine-design)
8. [Bigin-Inspired Features](#bigin-inspired-features)
9. [Excel Import Strategy](#excel-import-strategy)
10. [Testing & Quality Assurance](#testing--quality-assurance)
11. [Deployment & DevOps](#deployment--devops)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 14+)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   CRM    │  │   OMS    │  │ Finance  │  │ Analytics│   │
│  │  Views   │  │  Views   │  │  Views   │  │  Views   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ REST/GraphQL
┌─────────────────────────────────────────────────────────────┐
│              API Gateway / NestJS Backend                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Auth & RBAC │  │ Workflow     │  │ Integration  │     │
│  │  Module      │  │ Engine       │  │ Layer        │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Core Business Modules (12 Modules)              │
│  Module 1: Leads  │  Module 5: Approvals  │  Module 9: Metrics│
│  Module 2: Accounts│ Module 6: Costing    │  Module 10: B2C   │
│  Module 3: Requirements│ Module 7: Finance│  Module 11: Notify│
│  Module 4: Trainers│ Module 8: LMS        │  Module 12: Audit │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Data & Infrastructure Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │PostgreSQL│  │  Redis   │  │   S3     │  │ BullMQ   │   │
│  │  Prisma  │  │  Cache   │  │  Storage │  │  Queue   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Modular Monolith (MVP Phase)**
   - Domain-driven design (DDD) with bounded contexts
   - Microservices-ready structure (extractable later)
   - Independent module deployment capability

2. **Event-Driven Communication**
   - Internal events between modules via event bus
   - Async processing with BullMQ
   - Webhook support for external integrations

3. **Type Safety**
   - TypeScript end-to-end
   - Prisma for type-safe database queries
   - Zod for runtime validation

4. **Scalability**
   - Horizontal scaling ready
   - Redis for caching and session management
   - Queue-based background jobs

---

## Technology Stack

### Backend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | NestJS | ^10.3.0 | Modular backend framework |
| **Database** | PostgreSQL | 15+ | Primary data store |
| **ORM** | Prisma | ^5.8.0 | Type-safe database access |
| **Cache/Queue** | Redis | Latest | Caching, sessions, queues |
| **Queue Manager** | BullMQ | Latest | Background job processing |
| **Workflow Engine** | Camunda BPMN | Embedded | Approval workflows, process automation |
| **File Storage** | AWS S3 / MinIO | Latest | Document storage |
| **Search** | PostgreSQL Full-Text | Native | Search (Elasticsearch optional later) |

### Frontend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Next.js | 14+ (App Router) | React framework with SSR |
| **UI Library** | shadcn/ui + TailwindCSS | Latest | Component library |
| **State Management** | Zustand + React Query | Latest | Client state + server state |
| **Forms** | React Hook Form + Zod | Latest | Form handling & validation |
| **Tables** | TanStack Table | Latest | Data tables |

### Integrations

| Service | Technology | Purpose |
|---------|-----------|---------|
| **Email** | SendGrid / SMTP | Transactional emails |
| **WhatsApp** | WhatsApp Business API | Business messaging |
| **SMS** | Twilio / AWS SNS | SMS notifications |
| **Payments** | Razorpay (IN) + Stripe (INTL) | Payment processing |
| **Voice/Calls** | Twilio Voice / Exotel | Inbound/outbound calling |
| **LMS** | REST API Adapter | LMS-agnostic integration |

### DevOps & Monitoring

| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Local development |
| **GitHub Actions** | CI/CD |
| **Winston** | Structured logging |
| **Prometheus + Grafana** | Metrics & monitoring |
| **Sentry** | Error tracking |

---

## Data Model & Schema

### Core Entity Relationships

```
User (Internal Team)
  ├── Role-based permissions (RBAC)
  ├── Department/Team assignments
  └── Manager hierarchy

Company (Accounts)
  ├── Parent-Child hierarchy (locations/branches)
  ├── Vertical flags (Corporate/Institution/B2C)
  └── Departments

Contact
  ├── Links to Company
  ├── Persona/Role tags (L&D Head, HR Head, Student, Parent, etc.)
  ├── Vertical-specific fields (B2C: academic info, parent contact)
  └── Lead scoring data

Lead
  ├── Source tracking (Apollo, LinkedIn, Web, Manual, etc.)
  ├── Scoring engine data
  └── Communication timeline

Deal/Opportunity
  ├── Links to Contact + Company
  ├── Stage pipeline (Prospecting → Closed Won/Lost)
  ├── Vertical assignment
  └── Requirement reference

Requirement
  ├── Links to Deal/Account/Contact
  ├── Skill categories, learner count, delivery mode
  ├── Budget, timeline, success metrics
  └── Status tracking

Solution/Proposal
  ├── Links to Requirement
  ├── Version tracking
  ├── Course selections
  ├── Pricing scenarios
  └── Approval workflow reference

Trainer
  ├── Skills (up to 20, proficiency levels)
  ├── Certifications, experience
  ├── Ratings, feedback history
  ├── Availability calendar
  └── Rate cards (per skill/per day)

Program/Batch
  ├── Links to Solution, Trainer, Requirement
  ├── Schedule, mode, location
  ├── Capacity, enrollment
  └── Sessions (individual training events)

Enrollment
  ├── Links to Program, Contact (learner)
  ├── Payment status
  ├── Attendance tracking
  └── Completion status

Invoice
  ├── Links to Deal/Program
  ├── Line items, taxes (GST/VAT)
  ├── Multi-currency support
  ├── Payment tracking
  └── Status (Draft, Sent, Paid, Overdue)

Payment
  ├── Links to Invoice
  ├── Gateway reference
  ├── Installment tracking (B2C)
  └── Payment method

TrainerPayout
  ├── Links to Program, Trainer, Sessions
  ├── Rate, amount
  ├── PO reference
  └── Payment status

TrainingCost
  ├── Links to Program
  ├── Trainer fees, travel, accommodation, etc.
  ├── Total cost calculation
  └── Profitability metrics

Activity
  ├── Unified timeline across entities
  ├── Types: Email, WhatsApp, SMS, Call, Meeting, Note, Task
  └── Communication channel metadata

Approval
  ├── Workflow instance reference
  ├── Current stage, approvers
  ├── Comments, decisions
  └── Audit trail

AuditLog
  ├── User actions tracking
  ├── Entity changes (before/after)
  └── Compliance logging
```

### Key Schema Extensions Needed

1. **Multi-location Company Structure**
   - `CompanyLocation` table (parent-child relationship)
   - `CompanyDepartment` table

2. **Lead Scoring**
   - Fields in `Lead`: score, engagementLevel, budgetSignals, timelineUrgency

3. **Vertical-Specific Fields**
   - B2C Contact: `academicYear`, `collegeId`, `parentContactId`, `enrollmentStatus`
   - Corporate Contact: `role` (L&D Head, HR Head, etc.), `decisionMaker`, `approvalAuthority`

4. **Requirement & Solution**
   - `Requirement` table with JSONB for flexible skill categories
   - `Solution` table with versioning
   - `SolutionVersion` for iteration tracking

5. **Trainer Management**
   - `Trainer` table with skills array (JSONB)
   - `TrainerSkill` junction table for proficiency levels
   - `TrainerAvailability` calendar entries
   - `TrainerRateCard` pricing matrix

6. **Financial Documents**
   - `Quote`, `PurchaseOrder`, `Invoice`, `CreditNote` tables
   - `InvoiceLineItem` for line-level details
   - `Payment` with installment support

7. **Program & Delivery**
   - `Program` table with batch details
   - `Session` table (individual training events)
   - `Enrollment` with attendance tracking
   - `Feedback` table (session-level and program-level)

8. **Workflow Engine**
   - `WorkflowInstance` (Camunda process instance reference)
   - `ApprovalTask` (human tasks)
   - `WorkflowDefinition` (process definitions)

---

## Module Breakdown (All 12 Modules)

### MODULE 1: Lead Generation & Omnichannel Communication

**Backend Components:**
- `LeadsModule` (NestJS)
  - Lead CRUD with source tracking
  - Lead scoring service (algorithm)
  - Communication timeline aggregation
- `CommunicationsModule`
  - Email service (SendGrid/SMTP)
  - WhatsApp service (Business API)
  - SMS service (Twilio/AWS SNS)
  - Unified timeline builder

**Frontend Components:**
- `/app/leads` - Lead inbox/list
- `/app/leads/[id]` - Lead 360 view
- `/app/leads/[id]/timeline` - Communication timeline
- Lead scoring dashboard
- Communication composer (email/WhatsApp/SMS)

**Key Features:**
- Lead source tracking (Apollo, LinkedIn, Web, Manual, Referral, Ads)
- Lead scoring algorithm (engagement, budget signals, timeline urgency)
- Unified communication timeline
- Email/WhatsApp/SMS integration
- Call logging with recording references
- Meeting notes

---

### MODULE 2: Account & Multi-Location Management

**Backend Components:**
- `AccountsModule` (extends existing `CompaniesModule`)
  - Multi-location support
  - Department management
  - Contact role tagging
  - Relationship mapping
  - Past training history

**Frontend Components:**
- `/app/accounts` - Account list
- `/app/accounts/[id]` - Account 360 view
  - Overview tab
  - Locations/branches tab
  - Contacts by role tab
  - Training history tab
  - Deals pipeline tab
  - Invoices tab
- Account hierarchy visualizer

**Key Features:**
- Hierarchical company structure (parent-child)
- Multiple locations/branches per company
- Department segmentation
- Contact role tagging (L&D Head, HR Head, Principal, HoD, TPO, etc.)
- Decision maker vs influencer mapping
- Approval hierarchy visualization
- Past training history tracking

---

### MODULE 3: Requirement Intake & Solution Builder

**Backend Components:**
- `RequirementsModule`
  - Requirement CRUD
  - Requirement status workflow
- `SolutionsModule`
  - Solution versioning
  - Curriculum builder
  - Course cloning
  - Pricing scenarios
  - LMS content mapping

**Frontend Components:**
- `/app/requirements` - Requirement list
- `/app/requirements/[id]` - Requirement detail
- `/app/solutions` - Solution builder interface
- `/app/solutions/[id]` - Solution editor
  - Course selection
  - Curriculum customization
  - Pricing calculator
  - Version comparison

**Key Features:**
- Requirement capture (skills, learner count, delivery mode, budget, timeline)
- Solution versioning (multiple iterations)
- Curriculum builder with course templates
- Course cloning with customization
- Pricing scenario modeling
- LMS content mapping

---

### MODULE 4: Trainer Sourcing & Management

**Backend Components:**
- `TrainersModule`
  - Trainer CRUD
  - Skill management (up to 20 skills per trainer)
  - Availability calendar
  - Rate card management
  - Trainer recommendation engine (AI-powered)
  - Sourcing workflow

**Frontend Components:**
- `/app/trainers` - Trainer directory
- `/app/trainers/[id]` - Trainer profile
  - Skills & certifications
  - Availability calendar
  - Rate cards
  - Past deliveries & ratings
  - Feedback history
- `/app/trainers/sourcing` - Sourcing workflow
- `/app/trainers/recommendations` - AI recommendations

**Key Features:**
- Trainer profile management (skills, certifications, experience)
- Skill proficiency levels
- Availability calendar (sync with external calendars)
- Rate cards (per skill/per day)
- Past delivery ratings & feedback
- AI-powered trainer recommendation (skill matching, availability, cost optimization)
- Trainer eligibility filters (NDA, rating threshold, active status)
- External sourcing tracking (LinkedIn, Naukri, referrals)

---

### MODULE 5: Approval Workflow Engine

**Backend Components:**
- `WorkflowsModule`
  - Camunda BPMN integration
  - Workflow definition management
  - Workflow instance management
  - Approval task handling
  - Escalation rules
- `ApprovalsModule`
  - Approval CRUD
  - Approval chain configuration
  - Approval decision tracking

**Frontend Components:**
- `/app/approvals` - Approval queue (role-based)
- `/app/approvals/[id]` - Approval detail
- `/app/workflows` - Workflow designer (admin)
- `/app/workflows/definitions` - Workflow templates

**Key Features:**
- Configurable approval chains (role-based)
- Parallel vs sequential approvals
- Escalation rules & timeout handling
- Approval types: Pricing, Discount, Trainer Selection, Commercial Terms, Contract Deviations
- Audit trail (timestamp, approver comments, rejection reasons)
- Version control for workflow definitions

**Workflow Examples:**
- Pricing Approval: Sales Executive → Sales Manager → Admin
- Trainer Selection: Delivery Team → Sales Manager
- Discount > 10%: Sales Executive → Sales Manager → Admin

---

### MODULE 6: Training Costing & Profitability

**Backend Components:**
- `CostingModule`
  - Cost component breakdown
  - Profitability calculations
  - Margin analysis
- Cost components:
  - Trainer fee (from PO)
  - Travel (domestic/international)
  - Accommodation
  - Local conveyance
  - Food/per diem
  - Lab charges
  - Facility rental
  - Equipment rental
  - Miscellaneous

**Frontend Components:**
- `/app/programs/[id]/costing` - Cost breakdown view
- `/app/reports/profitability` - Profitability dashboard
  - By program
  - By client
  - By vertical
  - By geography
  - By trainer

**Key Features:**
- Total training cost calculation (sum of components)
- Client selling price
- Gross profit (selling price - total cost)
- Gross margin percentage
- Profitability tracking per program/client/vertical/geography/trainer

---

### MODULE 7: Financial Document Orchestration

**Backend Components:**
- `FinanceModule`
  - Quote generation
  - Purchase Order (PO) generation (for trainers)
  - Proforma Invoice request & receipt
  - Final Invoice generation
  - Payment tracking
  - Multi-currency support
  - Tax management (GST/VAT)
- `InvoicesModule`
  - Invoice CRUD
  - Invoice line items
  - Tax calculations
  - Payment reconciliation

**Frontend Components:**
- `/app/finance/quotes` - Quote list
- `/app/finance/quotes/[id]` - Quote detail & PDF
- `/app/finance/invoices` - Invoice list
- `/app/finance/invoices/[id]` - Invoice detail & PDF
- `/app/finance/purchase-orders` - PO list (trainers)
- `/app/finance/payments` - Payment tracking
- `/app/finance/collections` - AR dashboard

**Key Features:**
- Document lifecycle: Trainer PO → Client Proforma Request → Proforma Receipt → Final Invoice
- Multi-currency support (USD, EUR, GBP, SGD, AED, etc.)
- Exchange rate management
- Tax documentation (GST India, VAT international, zero-rated exports, reverse charge, treaty references)
- Payment terms (Advance, Milestone-based, Net 30/60/90)
- Payment gateway integration (Razorpay, Stripe)
- Bank transfer tracking

---

### MODULE 8: Delivery & LMS Integration

**Backend Components:**
- `ProgramsModule`
  - Program/Batch CRUD
  - Session management
  - Enrollment management
  - LMS integration adapter (LMS-agnostic)
  - Enrollment automation
  - Status synchronization
- `LMSIntegrationModule`
  - Adapter pattern for multiple LMS (Edmingle, Learnyst, Custom)
  - SCIM 2.0 ready user provisioning
  - Batch creation automation
  - Certificate issuance

**Frontend Components:**
- `/app/programs` - Program list
- `/app/programs/[id]` - Program 360 view
  - Overview
  - Sessions calendar
  - Enrollments
  - Attendance tracking
  - Feedback collection
  - Certificates
- `/app/delivery/dashboard` - Delivery team dashboard

**Key Features:**
- CRM → LMS handoff boundary (CRM: commercial, approvals, scheduling; LMS: content, attendance, assessments)
- LMS-agnostic adapter layer
- Payment-triggered enrollment
- Batch creation in LMS
- User provisioning (SCIM 2.0 ready)
- Access credential distribution
- Status synchronization (training dates, attendance, completion, certificates)

---

### MODULE 9: Delivery Metrics & Feedback

**Backend Components:**
- `FeedbackModule`
  - Feedback collection (session-level, program-level)
  - Rating aggregation
  - Qualitative feedback analysis
- `MetricsModule`
  - Attendance tracking
  - Completion status
  - Trainer effectiveness scores
  - NPS calculation

**Frontend Components:**
- `/app/programs/[id]/feedback` - Feedback dashboard
- `/app/programs/[id]/metrics` - Delivery metrics
- `/app/trainers/[id]/performance` - Trainer performance metrics
- `/app/reports/satisfaction` - Satisfaction reports

**Key Features:**
- Attendance tracking (% per participant)
- Daily feedback ratings (1-5 scale)
- Qualitative feedback text
- Trainer effectiveness scores
- Content relevance scores
- Facility/logistics ratings
- Overall satisfaction (NPS-style)
- Certificate generation
- Completion reports
- Skills gap analysis
- Follow-up training recommendations

---

### MODULE 10: B2C Payments & Installments

**Backend Components:**
- `PaymentsModule` (extends existing payment handling)
  - Installment management
  - Payment gateway abstraction (Razorpay, Stripe, UPI, Bank transfer)
  - Automated reminders
  - Parental involvement handling (students/graduates)

**Frontend Components:**
- `/app/enrollments/[id]/payments` - Payment & installment tracking
- `/app/students/[id]/payments` - Student payment history
- `/app/parents/[id]` - Parent contact & consent management

**Key Features:**
- Payment gateway abstraction (Razorpay India, Stripe international, UPI, Bank transfer)
- Installment management (Students: max 3, Professionals: max 6)
- Configurable per course
- Admin override capability
- Automated reminders (payment due, overdue alerts)
- Escalation workflows
- Payment link regeneration
- Parental involvement (contact capture, notification preferences, joint consent)

---

### MODULE 11: Notifications & Communication Engine

**Backend Components:**
- `NotificationsModule`
  - Template management (Email, WhatsApp, SMS)
  - Trigger-based automation
  - Consent management
  - Preference center
- `AutomationModule`
  - If-then workflow rules
  - Scheduled workflows
  - Auto-responders

**Frontend Components:**
- `/app/notifications/templates` - Template library
- `/app/notifications/automation` - Automation rules
- `/app/notifications/preferences` - User preferences

**Key Features:**
- Template-driven messaging (Email, WhatsApp, SMS)
- Trigger-based automation (lead stage transitions, approval requests, payment reminders, training start, feedback requests)
- Consent management (opt-in capture, GDPR compliance, opt-out handling)
- Preference center
- Email open tracking
- WhatsApp read receipts
- Best time to send analytics

---

### MODULE 12: Audit, Logs & Compliance

**Backend Components:**
- `AuditLogsModule` (already exists, extend)
  - Comprehensive audit trail
  - User action tracking
  - Workflow transition logging
  - Financial transaction logging
  - Communication logs
  - System changes
  - Compliance features (data retention, PII protection, right to erasure, export)

**Frontend Components:**
- `/app/admin/audit-logs` - Audit log viewer
- `/app/admin/compliance` - Compliance dashboard

**Key Features:**
- Immutable audit logs
- Entity change tracking (before/after values)
- Access logs
- Data retention policies
- PII protection
- Right to erasure (GDPR)
- Export capabilities

---

## Phase-by-Phase Implementation Plan

### PHASE 0: Foundation & Infrastructure (Weeks 1-2)

**Objective:** Set up core infrastructure, extend data model, and establish development workflow.

**Tasks:**
1. ✅ Extend Prisma schema for all 12 modules
   - Create migration for new tables
   - Add relationships and indexes
   - Seed data for enums and reference data

2. ✅ Set up Redis & BullMQ
   - Redis configuration
   - BullMQ queue setup
   - Background job infrastructure

3. ✅ Set up Workflow Engine (Camunda)
   - Docker setup for Camunda
   - NestJS integration
   - Basic workflow definitions

4. ✅ Excel Import Infrastructure
   - Import templates (Excel/CSV)
   - Bulk import service
   - Data validation & mapping

5. ✅ Integration Layer Foundation
   - Abstract interfaces for Email, WhatsApp, SMS, Payments, Calls
   - Configuration management for providers

6. ✅ Extended RBAC
   - All roles from spec (Sales Executive, Sales Manager, Trainer Sourcing Exec, Delivery Manager, Finance, Admin, etc.)
   - Permission matrix implementation
   - Frontend route guards

**Deliverables:**
- Extended Prisma schema with all entities
- Redis & BullMQ running
- Camunda workflow engine integrated
- Excel import templates created
- Integration layer interfaces defined

---

### PHASE 1: CRM Core - Leads, Accounts, Contacts (Weeks 3-5)

**Objective:** Build robust CRM foundation with lead management, multi-location accounts, and omnichannel communication.

**Priority:** B2B Corporate National + B2C

**Tasks:**

**Week 3: Leads Module**
1. Lead entity & scoring engine
2. Lead source tracking
3. Lead inbox UI
4. Lead 360 view

**Week 4: Accounts & Multi-Location**
1. Multi-location company structure
2. Department management
3. Contact role tagging
4. Account 360 view with tabs

**Week 5: Communication Integration**
1. Email integration (SendGrid/SMTP)
2. WhatsApp integration (Business API)
3. SMS integration (Twilio)
4. Unified communication timeline
5. Communication composer UI

**Deliverables:**
- Lead management fully functional
- Multi-location accounts working
- Email/WhatsApp/SMS sending from CRM
- Unified timeline view

---

### PHASE 2: Deals, Requirements & Solution Builder (Weeks 6-8)

**Objective:** Sales pipeline with requirements intake and solution building.

**Priority:** B2B Corporate National

**Tasks:**

**Week 6: Enhanced Deals Pipeline**
1. Deal stages aligned to workflow
2. Deal 360 view
3. Pipeline visualization (Kanban)
4. Deal-to-Requirement linking

**Week 7: Requirements Module**
1. Requirement intake forms
2. Requirement status workflow
3. Requirement-to-Deal linking
4. Requirement list & detail views

**Week 8: Solution Builder**
1. Solution versioning
2. Course selection from catalog
3. Curriculum builder UI
4. Pricing scenario calculator
5. Solution-to-Requirement linking

**Deliverables:**
- Full sales pipeline operational
- Requirements capture working
- Solution builder functional

---

### PHASE 3: Trainer Sourcing & Management (Weeks 9-11)

**Objective:** Comprehensive trainer management with sourcing workflow.

**Tasks:**

**Week 9: Trainer Profile Management**
1. Trainer CRUD with skills (up to 20)
2. Skill proficiency levels
3. Certifications & experience tracking
4. Availability calendar
5. Rate card management

**Week 10: Trainer Sourcing Workflow**
1. Sourcing executive role & permissions
2. Trainer search (internal DB, external)
3. Trainer shortlisting UI
4. Client review workflow
5. Trainer interview tracking

**Week 11: Trainer Recommendations**
1. AI-powered matching algorithm (rule-based initially)
2. Skill matching
3. Availability scoring
4. Cost optimization
5. Recommendation UI

**Deliverables:**
- Trainer directory fully functional
- Sourcing workflow operational
- Trainer recommendations working

---

### PHASE 4: Approval Workflow Engine (Weeks 12-13)

**Objective:** Configurable approval workflows for pricing, discounts, trainer selection, etc.

**Tasks:**

**Week 12: Workflow Engine Setup**
1. Camunda workflow definitions
2. Approval chain configuration UI
3. Workflow instance creation
4. Approval task handling

**Week 13: Approval UI & Integration**
1. Approval queue (role-based)
2. Approval detail view
3. Integration with Deals, Solutions, Trainers
4. Escalation rules implementation

**Deliverables:**
- Approval workflows functional
- Approval UI operational
- Integrated with sales process

---

### PHASE 5: Training Costing & Financial Documents (Weeks 14-16)

**Objective:** Complete financial module with costing, invoices, and payment tracking.

**Priority:** B2B Corporate National

**Tasks:**

**Week 14: Training Costing**
1. Cost component breakdown (trainer, travel, accommodation, etc.)
2. Cost calculation service
3. Profitability calculations
4. Costing UI in Program view

**Week 15: Financial Documents**
1. Quote generation
2. Purchase Order (PO) for trainers
3. Proforma Invoice request & receipt
4. Final Invoice generation
5. PDF generation for all documents

**Week 16: Payments & Multi-Currency**
1. Payment tracking
2. Multi-currency support
3. Exchange rate management
4. Tax calculations (GST/VAT)
5. AR dashboard

**Deliverables:**
- Full financial module operational
- Document generation working
- Payment tracking functional

---

### PHASE 6: Delivery & Programs (Weeks 17-19)

**Objective:** Program management, LMS integration, and delivery tracking.

**Tasks:**

**Week 17: Programs & Batches**
1. Program/Batch CRUD
2. Session management
3. Enrollment management
4. Program 360 view

**Week 18: LMS Integration**
1. LMS adapter layer (Edmingle, Learnyst)
2. Enrollment automation
3. Batch creation in LMS
4. User provisioning
5. Status synchronization

**Week 19: Delivery Metrics & Feedback**
1. Attendance tracking
2. Feedback collection (session & program level)
3. Rating aggregation
4. NPS calculation
5. Certificate generation

**Deliverables:**
- Program management fully functional
- LMS integration working
- Feedback & metrics operational

---

### PHASE 7: B2C Enhancements & Installments (Weeks 20-21)

**Objective:** B2C-specific features including installments and parental involvement.

**Priority:** B2C Vertical

**Tasks:**

**Week 20: B2C Contact Management**
1. Student/Fresh Graduate/Working Professional personas
2. Academic tracking (students)
3. Parent contact capture
4. B2C-specific fields

**Week 21: B2C Payments & Installments**
1. Installment management (max 3 for students, 6 for professionals)
2. Payment gateway integration (Razorpay)
3. Automated payment reminders
4. Parental consent management
5. Payment tracking UI

**Deliverables:**
- B2C vertical fully supported
- Installment payments working
- Parental involvement functional

---

### PHASE 8: Notifications & Automation (Weeks 22-23)

**Objective:** Template-driven notifications and automation rules.

**Tasks:**

**Week 22: Notification Engine**
1. Template management (Email, WhatsApp, SMS)
2. Template library UI
3. Trigger-based sending
4. Consent management

**Week 23: Automation Rules**
1. If-then workflow rules
2. Scheduled workflows
3. Auto-responders
4. Automation UI

**Deliverables:**
- Notification engine operational
- Automation rules functional

---

### PHASE 9: Bigin-Inspired Features (Weeks 24-25)

**Objective:** Enhanced CRM features from Bigin.

**Tasks:**

**Week 24: Pipeline & 360 View Enhancements**
1. Connected pipelines (Deal → Delivery → Renewal)
2. Stage transition rules (mandatory fields)
3. Pipeline health metrics
4. Enhanced 360-degree view
5. Relationship mapping visualization

**Week 25: Multichannel & Collaboration**
1. Built-in telephony (click-to-call, call recording)
2. Email insights (open tracking, click tracking)
3. WhatsApp Business integration enhancements
4. @Mentions in notes/comments
5. Shared calendars
6. Activity feed

**Deliverables:**
- Enhanced pipeline features
- Improved collaboration tools
- Better multichannel communication

---

### PHASE 10: Analytics, Reports & Polish (Weeks 26-28)

**Objective:** Dashboards, reports, and final polish.

**Tasks:**

**Week 26: Analytics & Dashboards**
1. Sales Performance Dashboard
2. Lead Generation Dashboard
3. Trainer Performance Dashboard
4. Financial Dashboard
5. Custom chart builder

**Week 27: Excel Import & Data Migration**
1. Complete Excel import for all entities
2. Data validation & mapping UI
3. Import history tracking
4. Data migration tools

**Week 28: Testing, Bug Fixes & Documentation**
1. End-to-end testing
2. Performance optimization
3. Security audit
4. User documentation
5. Admin documentation

**Deliverables:**
- All dashboards operational
- Excel import fully functional
- Application production-ready

---

## Integration Architecture

### Communication Integrations

#### Email Integration
- **Provider:** SendGrid (primary), SMTP (fallback)
- **Features:**
  - Transactional emails (welcome, reminders, confirmations)
  - Template management
  - Email tracking (opens, clicks)
  - Best time to send analytics

#### WhatsApp Integration
- **Provider:** WhatsApp Business API
- **Features:**
  - Template messages
  - Media support (images, PDFs, videos)
  - Read receipts
  - Two-way communication

#### SMS Integration
- **Provider:** Twilio (primary), AWS SNS (fallback)
- **Features:**
  - SMS notifications
  - Urgent alerts
  - Delivery status tracking

#### Voice/Call Integration
- **Provider:** Twilio Voice / Exotel
- **Features:**
  - Click-to-call from CRM
  - Inbound call handling
  - Call recording (stored in S3)
  - Call logging (duration, recording link)
  - Missed call notifications

### Payment Integrations

#### Razorpay (India)
- Payment processing for B2B and B2C
- Installment support
- UPI, cards, net banking
- Payment links

#### Stripe (International)
- Multi-currency support
- International cards
- Recurring payments (if needed)

### LMS Integration

#### Adapter Pattern
- Abstract `LMSAdapter` interface
- Implementations: `EdmingleAdapter`, `LearnystAdapter`, `CustomLMSAdapter`
- Methods:
  - `createBatch(batchData)`
  - `enrollUsers(userIds, batchId)`
  - `syncAttendance(programId)`
  - `generateCertificate(enrollmentId)`

---

## Workflow Engine Design

### Camunda BPMN Integration

**Workflow Definitions:**

1. **Pricing Approval Workflow**
   ```
   Start → Sales Executive Submission → Sales Manager Approval → Admin Approval → End
   (Parallel path for rejection/request changes)
   ```

2. **Trainer Selection Workflow**
   ```
   Start → Delivery Team Recommendation → Sales Manager Approval → Client Review → Trainer Confirmation → End
   ```

3. **Discount Approval Workflow**
   ```
   Start → Sales Executive Request → 
   (If > 10%: Sales Manager → Admin)
   (If <= 10%: Sales Manager)
   → Approval → End
   ```

4. **Corporate Training End-to-End Workflow**
   ```
   Lead Capture → Qualification → Requirement Gathering → Solution Design → 
   Trainer Sourcing → Pricing Proposal → Approval Workflow → 
   PO Generation → Proforma Request → Invoice Generation → Delivery Handoff
   ```

**Implementation:**
- Camunda embedded in NestJS
- REST API for workflow operations
- Human tasks mapped to approval UI
- Event listeners for workflow state changes

---

## Bigin-Inspired Features

### 1. Connected Pipelines
- Auto-create records across pipelines
- Example: Closed Won Deal → Auto-create Delivery Program

### 2. Stage Transition Rules
- Mandatory fields before stage transition
- Validation rules

### 3. Pipeline Health Metrics
- Visual indicators (deals stuck > X days)
- Conversion rates
- Average time in stage

### 4. 360-Degree View
- Unified timeline (all interactions)
- Relationship mapping (org chart)
- Duplicate detection & merge

### 5. Multichannel Communication
- Built-in telephony
- Email insights
- WhatsApp Business
- Real-time signals/notifications

### 6. Automation
- If-then rules
- Scheduled workflows
- Auto-responders
- Task automation

### 7. Team Collaboration
- @Mentions
- Shared calendars
- Activity feed

### 8. Customization
- Custom fields (up to 50 per module)
- Custom modules
- Web forms builder

### 9. Analytics & Dashboards
- Pre-built dashboards
- Custom charts
- Target meters
- Export reports

---

## Excel Import Strategy

### Import Templates

For each major entity, create Excel templates with:
- Column headers matching Prisma schema
- Data validation rules
- Example rows
- Instructions sheet

**Templates Needed:**
1. `import-leads.xlsx`
2. `import-contacts.xlsx`
3. `import-companies.xlsx`
4. `import-deals.xlsx`
5. `import-requirements.xlsx`
6. `import-trainers.xlsx`
7. `import-courses.xlsx`
8. `import-programs.xlsx`

### Import Process

1. **Upload Excel File**
   - User uploads template
   - System validates file format

2. **Data Validation**
   - Check required fields
   - Validate data types
   - Check for duplicates (email, phone)
   - Foreign key validation (companyId, etc.)

3. **Preview & Mapping**
   - Show preview of data
   - Allow field mapping if columns don't match
   - Show validation errors

4. **Import Execution**
   - Bulk insert in transaction
   - Handle errors gracefully
   - Return import report (success, failures)

5. **Import History**
   - Track all imports
   - Allow re-import of failed records
   - Audit trail

---

## Testing & Quality Assurance

### Testing Strategy

1. **Unit Tests**
   - Service layer logic
   - Utility functions
   - Validators

2. **Integration Tests**
   - API endpoints
   - Database operations
   - External integrations (mocked)

3. **E2E Tests**
   - Critical user flows
   - Workflow processes
   - Payment flows

4. **Performance Tests**
   - Load testing
   - Database query optimization
   - API response times

5. **Security Tests**
   - Authentication & authorization
   - SQL injection prevention
   - XSS protection
   - Data encryption

---

## Deployment & DevOps

### Infrastructure (TBD - to be confirmed with Cloud Engineer)

**Recommended Stack:**
- **Compute:** AWS ECS / Azure Container Instances / Kubernetes
- **Database:** Managed PostgreSQL (AWS RDS / Azure Database)
- **Cache/Queue:** Managed Redis (AWS ElastiCache / Azure Cache)
- **Storage:** AWS S3 / Azure Blob Storage
- **CDN:** CloudFront / Azure CDN
- **Monitoring:** CloudWatch / Azure Monitor + Grafana

### CI/CD Pipeline

1. **GitHub Actions Workflow:**
   - Lint & type check
   - Run tests
   - Build Docker images
   - Run database migrations
   - Deploy to staging
   - Run E2E tests
   - Deploy to production (manual approval)

2. **Docker Setup:**
   - Multi-stage builds
   - Docker Compose for local development
   - Production Dockerfile optimized

3. **Environment Management:**
   - `.env.example` templates
   - Environment-specific configs
   - Secrets management (AWS Secrets Manager / Azure Key Vault)

---

## Success Criteria

### Phase 0-1 (Weeks 1-5): Foundation & CRM Core
- ✅ All data models in place
- ✅ Lead management operational
- ✅ Multi-location accounts working
- ✅ Email/WhatsApp/SMS integration functional

### Phase 2-3 (Weeks 6-11): Sales & Trainer Management
- ✅ Sales pipeline fully operational
- ✅ Requirements & Solutions working
- ✅ Trainer directory & sourcing functional

### Phase 4-5 (Weeks 12-16): Approvals & Finance
- ✅ Approval workflows operational
- ✅ Financial documents generation working
- ✅ Payment tracking functional

### Phase 6-7 (Weeks 17-21): Delivery & B2C
- ✅ Program management operational
- ✅ LMS integration working
- ✅ B2C features complete

### Phase 8-10 (Weeks 22-28): Polish & Launch
- ✅ All automation & notifications working
- ✅ Bigin features integrated
- ✅ Dashboards & reports complete
- ✅ Excel import functional
- ✅ Production-ready application

---

## Next Steps

1. **Review & Approve Plan** - Get stakeholder approval
2. **Set up Development Environment** - Ensure all tools are in place
3. **Start Phase 0** - Foundation work (data model, infrastructure)
4. **Weekly Sprint Planning** - Break down each phase into sprints
5. **Regular Reviews** - Weekly progress reviews and adjustments

---

**Document Owner:** Technical Architect  
**Last Updated:** 2025-12-18  
**Next Review:** After Phase 0 completion

