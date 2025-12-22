# Sudaksha S-CRM/OMS Rebuild Plan - Executive Summary

## Quick Overview

This rebuild plan covers **all 12 functional modules** from the specification, implementing a comprehensive CRM/OMS system for Sudaksha's three business verticals: **Corporate Training (National & International)**, **EdTech Institutions**, and **B2C Retail**.

---

## Key Decisions

### ✅ Technology Stack Confirmed
- **Backend:** NestJS + PostgreSQL + Prisma (keeping current stack)
- **Frontend:** Next.js 14 + shadcn/ui + TailwindCSS (keeping current stack)
- **Workflow Engine:** Camunda BPMN (embedded in NestJS)
- **Queue/Jobs:** BullMQ + Redis
- **Storage:** AWS S3 / MinIO for documents
- **Integrations:** SendGrid (Email), WhatsApp Business API, Twilio (SMS/Voice), Razorpay (Payments IN), Stripe (Payments INTL)

### ✅ Architecture Approach
- **Modular Monolith** (MVP phase) - microservices-ready structure
- **Domain-Driven Design** with bounded contexts per module
- **Event-driven** communication between modules
- **Type-safe** end-to-end (TypeScript + Prisma + Zod)

### ✅ Priority Verticals
1. **B2B Corporate National** (Weeks 1-16)
2. **B2C** (Weeks 20-21)
3. **B2B Institutions** (Later phases)
4. **B2B International** (Later phases - multi-currency support in place)

---

## 28-Week Implementation Roadmap

### Phase 0: Foundation (Weeks 1-2)
- Extended Prisma schema for all 12 modules
- Redis & BullMQ setup
- Camunda workflow engine integration
- Excel import infrastructure
- Extended RBAC with all roles

### Phase 1: CRM Core (Weeks 3-5)
- **MODULE 1:** Lead Generation & Omnichannel Communication
- **MODULE 2:** Account & Multi-Location Management
- Email/WhatsApp/SMS integration

### Phase 2: Sales Pipeline (Weeks 6-8)
- Enhanced Deals Pipeline
- **MODULE 3:** Requirement Intake & Solution Builder

### Phase 3: Trainer Management (Weeks 9-11)
- **MODULE 4:** Trainer Sourcing & Management
- AI-powered recommendations

### Phase 4: Approvals (Weeks 12-13)
- **MODULE 5:** Approval Workflow Engine (Camunda)

### Phase 5: Finance (Weeks 14-16)
- **MODULE 6:** Training Costing & Profitability
- **MODULE 7:** Financial Document Orchestration
- Invoices, POs, Multi-currency, GST/VAT

### Phase 6: Delivery (Weeks 17-19)
- **MODULE 8:** Delivery & LMS Integration
- **MODULE 9:** Delivery Metrics & Feedback

### Phase 7: B2C (Weeks 20-21)
- **MODULE 10:** B2C Payments & Installments
- Parental involvement, installment management

### Phase 8: Notifications (Weeks 22-23)
- **MODULE 11:** Notifications & Communication Engine
- Automation rules

### Phase 9: Bigin Features (Weeks 24-25)
- Connected pipelines, 360 views, multichannel enhancements
- Team collaboration features

### Phase 10: Polish (Weeks 26-28)
- Analytics & Dashboards
- Excel import for data migration
- Testing, documentation, production readiness

---

## Critical Integrations (Priority)

1. **WhatsApp Business API** - Core communication channel
2. **Email (SendGrid/SMTP)** - Transactional emails
3. **Payment Gateways** - Razorpay (IN) + Stripe (INTL)
4. **Caller Integration** - Twilio Voice / Exotel for inbound/outbound calling

---

## Data Migration Strategy

- **Excel/CSV Import Templates** for all major entities
- Bulk import with validation & mapping
- Import history & error tracking
- Supports migration from existing Excel/Google Sheets

---

## Key Features by Module

### MODULE 1: Lead Generation
- Multi-source lead capture (Apollo, LinkedIn, Web, Manual, Referral, Ads)
- Lead scoring engine
- Unified communication timeline (Email, WhatsApp, SMS, Calls)

### MODULE 2: Accounts
- Multi-location company hierarchy
- Contact role tagging (L&D Head, HR Head, Principal, HoD, TPO, etc.)
- Decision maker mapping

### MODULE 3: Requirements & Solutions
- Requirement intake (skills, learner count, delivery mode, budget)
- Solution versioning with curriculum builder
- Course cloning & pricing scenarios

### MODULE 4: Trainers
- Up to 20 skills per trainer with proficiency levels
- Availability calendar
- Rate cards (per skill/per day)
- AI-powered trainer recommendations

### MODULE 5: Approvals
- Configurable approval chains (role-based)
- Parallel/sequential approvals
- Escalation rules

### MODULE 6: Costing
- Cost component breakdown (trainer, travel, accommodation, etc.)
- Profitability calculations (margin by program/client/vertical/geography/trainer)

### MODULE 7: Finance
- Quote → PO → Proforma → Invoice lifecycle
- Multi-currency support
- GST/VAT tax handling

### MODULE 8: Delivery
- LMS-agnostic adapter (Edmingle, Learnyst, Custom)
- Enrollment automation
- Status synchronization

### MODULE 9: Metrics
- Attendance tracking
- Feedback collection (session & program level)
- NPS calculation
- Certificate generation

### MODULE 10: B2C Payments
- Installment management (Students: max 3, Professionals: max 6)
- Parental involvement & consent

### MODULE 11: Notifications
- Template-driven messaging
- Trigger-based automation
- Consent management

### MODULE 12: Audit
- Comprehensive audit trail (already exists, extend)
- Compliance features (GDPR, data retention)

---

## Bigin-Inspired Enhancements

- **Connected Pipelines** - Auto-create records across pipelines
- **Stage Transition Rules** - Mandatory fields validation
- **Pipeline Health Metrics** - Visual indicators, conversion rates
- **360-Degree View** - Unified timeline, relationship mapping
- **Multichannel Communication** - Telephony, email insights, WhatsApp
- **Automation** - If-then rules, scheduled workflows
- **Team Collaboration** - @Mentions, shared calendars, activity feed
- **Customization** - Custom fields, modules, web forms

---

## Success Metrics

### Technical
- ✅ All 12 modules implemented
- ✅ All integrations functional
- ✅ Workflow engine operational
- ✅ Excel import working

### Business
- ✅ B2B Corporate National vertical fully operational
- ✅ B2C vertical fully operational
- ✅ End-to-end workflows functional (Lead → Deal → Program → Invoice)
- ✅ All user roles supported with appropriate permissions

---

## Next Immediate Actions

1. **Review & Approve Plan** - Stakeholder sign-off
2. **Cloud Infrastructure Decision** - Confirm deployment environment
3. **Start Phase 0** - Begin data model extension and infrastructure setup
4. **Create Excel Import Templates** - Prepare for data migration
5. **Set up Development Workflow** - Sprint planning, code review process

---

**For detailed implementation plan, see:** `docs/REBUILD_PLAN.md`

