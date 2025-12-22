# Sudaksha S-CRM/OMS - Extended Prisma Schema Design

This document outlines the complete Prisma schema extensions needed to support all 12 modules.

---

## Overview of Changes

### New Models to Add
1. `Lead` - Lead management with scoring
2. `CompanyLocation` - Multi-location support
3. `CompanyDepartment` - Department segmentation
4. `Requirement` - Training requirement intake
5. `Solution` - Solution proposals with versioning
6. `SolutionVersion` - Solution version iterations
7. `Trainer` - Trainer profiles
8. `TrainerSkill` - Trainer skills with proficiency
9. `TrainerAvailability` - Availability calendar
10. `TrainerRateCard` - Rate cards per skill/day
11. `Program` - Training programs/batches
12. `Session` - Individual training sessions
13. `Enrollment` - Learner enrollments
14. `TrainingCost` - Cost breakdown per program
15. `CostComponent` - Individual cost components
16. `Quote` - Quotations
17. `PurchaseOrder` - POs for trainers
18. `Invoice` - Invoices
19. `InvoiceLineItem` - Invoice line items
20. `Payment` - Payment records
21. `PaymentInstallment` - Installment tracking (B2C)
22. `TrainerPayout` - Trainer payment records
23. `Feedback` - Training feedback
24. `Certificate` - Certificates issued
25. `WorkflowInstance` - Workflow engine instances
26. `ApprovalTask` - Approval tasks
27. `NotificationTemplate` - Notification templates
28. `AutomationRule` - Automation rules
29. `CommunicationLog` - Communication history
30. `ImportBatch` - Excel import tracking

### Models to Extend
1. `User` - Add more roles, team assignments
2. `Contact` - Add B2C fields, role tags, lead scoring
3. `Company` - Add parent-child hierarchy, vertical flags
4. `Deal` - Add requirement link, vertical assignment
5. `Activity` - Add WhatsApp, SMS types, communication metadata
6. `Course` - Already good, may need minor extensions

### New Enums to Add
1. `LeadSource` - Lead sources
2. `LeadStatus` - Lead statuses
3. `VerticalType` - Business verticals
4. `ContactRole` - Contact roles (L&D Head, HR Head, etc.)
5. `RequirementStatus` - Requirement statuses
6. `SolutionStatus` - Solution statuses
7. `TrainerStatus` - Trainer statuses
8. `ProgramStatus` - Program statuses
9. `ProgramMode` - Delivery modes
10. `EnrollmentStatus` - Enrollment statuses
11. `DocumentStatus` - Document statuses (Draft, Sent, Approved, etc.)
12. `PaymentStatus` - Payment statuses
13. `PaymentMethod` - Payment methods
14. `WorkflowStatus` - Workflow statuses
15. `ApprovalStatus` - Approval statuses
16. `CommunicationChannel` - Communication channels
17. `NotificationType` - Notification types

---

## Detailed Schema Extensions

### 1. User Model Extensions

```prisma
enum Role {
  ADMIN
  SALES_EXECUTIVE
  SALES_MANAGER
  ACCOUNT_MANAGER
  TRAINER_SOURCING_EXEC
  DELIVERY_MANAGER
  DELIVERY_TEAM
  FINANCE
  OPS
  SUPPORT
  USER
}

model User {
  // ... existing fields ...
  team              String?         // Team/Department name
  vertical          VerticalType[]  // Which verticals they work with
  assignedLeads     Lead[]          @relation("LeadAssignee")
  assignedDeals     Deal[]          @relation("DealAssignee")
  sourcingTrainers  Trainer[]       @relation("TrainerSourcingBy")
  deliveryPrograms  Program[]       @relation("ProgramDeliveryManager")
  approvals         ApprovalTask[]  @relation("ApprovalAssignee")
  
  @@map("users")
}
```

### 2. Lead Model (NEW)

```prisma
enum LeadSource {
  APOLLO_IO
  LINKEDIN
  LUSHA
  WEBSITE_FORM
  MANUAL_ENTRY
  REFERRAL
  PAID_ADS_GOOGLE
  PAID_ADS_META
  PAID_ADS_LINKEDIN
  OTHER
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  CONVERTED
  LOST
  NURTURE
}

model Lead {
  id                String         @id @default(uuid())
  source            LeadSource
  status            LeadStatus     @default(NEW)
  score             Int            @default(0)  // Lead score 0-100
  firstName         String
  lastName          String
  email             String
  phone             String?
  companyName       String?
  designation       String?
  vertical          VerticalType?
  
  // Lead scoring fields
  engagementLevel   String?        // Cold, Warm, Hot
  budgetSignals     String?        // Budget signals detected
  timelineUrgency   String?        // Urgency level
  
  // Assignment
  assignedToId      String?
  assignedTo        User?          @relation("LeadAssignee", fields: [assignedToId], references: [id])
  
  // Relationships
  contactId         String?        // When converted to contact
  contact           Contact?       @relation(fields: [contactId], references: [id])
  companyId         String?        // When company identified
  company           Company?       @relation(fields: [companyId], references: [id])
  deals             Deal[]
  activities        Activity[]
  communications    CommunicationLog[]
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  deletedAt         DateTime?
  
  @@unique([email])
  @@map("leads")
}
```

### 3. Company Model Extensions

```prisma
enum VerticalType {
  CORPORATE_NATIONAL
  CORPORATE_INTERNATIONAL
  INSTITUTION
  B2C_STUDENT
  B2C_GRADUATE
  B2C_PROFESSIONAL
}

model Company {
  // ... existing fields ...
  
  // Hierarchy
  parentId          String?
  parent            Company?       @relation("CompanyHierarchy", fields: [parentId], references: [id])
  branches          Company[]      @relation("CompanyHierarchy")
  
  // Vertical & Geography
  vertical          VerticalType[]
  region            String?        // National, International regions
  country           String?        // For international
  
  // Extended fields
  gstin             String?        // GST number for India
  pan               String?        // PAN number
  registrationNumber String?       // Company registration
  
  // Relationships
  locations         CompanyLocation[]
  departments       CompanyDepartment[]
  requirements      Requirement[]
  programs          Program[]
  invoices          Invoice[]
  
  @@map("companies")
}

model CompanyLocation {
  id                String         @id @default(uuid())
  companyId         String
  company           Company        @relation(fields: [companyId], references: [id])
  name              String         // Location name
  address           String?
  city              String?
  state             String?
  country           String?
  zipCode           String?
  phone             String?
  email             String?
  isHeadquarters    Boolean        @default(false)
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@map("company_locations")
}

model CompanyDepartment {
  id                String         @id @default(uuid())
  companyId         String
  company           Company        @relation(fields: [companyId], references: [id])
  name              String
  description       String?
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@map("company_departments")
}
```

### 4. Contact Model Extensions

```prisma
enum ContactRole {
  // Corporate roles
  LND_HEAD
  HR_HEAD
  PROCUREMENT_MANAGER
  BUSINESS_UNIT_HEAD
  // Institution roles
  PRINCIPAL
  HOD
  TPO
  COORDINATOR
  // B2C roles
  STUDENT
  FRESH_GRADUATE
  WORKING_PROFESSIONAL
  PARENT
}

model Contact {
  // ... existing fields ...
  
  // Role & Hierarchy
  roles             ContactRole[]  // Multiple roles possible
  isDecisionMaker   Boolean        @default(false)
  isInfluencer      Boolean        @default(false)
  approvalAuthority String?        // Budget approval level
  
  // B2C specific fields
  academicYear      String?        // For students
  collegeId         String?        // Link to institution if student
  college           Company?       @relation("StudentCollege", fields: [collegeId], references: [id])
  parentContactId   String?        // Parent contact for students/graduates
  parentContact     Contact?       @relation("ContactParent", fields: [parentContactId], references: [id])
  childContacts     Contact[]      @relation("ContactParent")
  enrollmentStatus  String?        // For B2C enrollments
  
  // Lead conversion
  leadId            String?
  lead              Lead?          @relation(fields: [leadId], references: [id])
  
  // Relationships
  requirements      Requirement[]
  enrollments       Enrollment[]
  payments          Payment[]
  
  @@map("contacts")
}
```

### 5. Requirement & Solution Models (NEW)

```prisma
enum RequirementStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  SOLUTION_DESIGNING
  CLIENT_REVIEW
  APPROVED
  REJECTED
  CANCELLED
}

enum SolutionStatus {
  DRAFT
  SUBMITTED
  CLIENT_REVIEW
  REVISED
  APPROVED
  REJECTED
}

model Requirement {
  id                String         @id @default(uuid())
  title             String
  description       String?
  status            RequirementStatus @default(DRAFT)
  
  // Requirement details
  skillCategories   Json           // Array of skill categories
  learnerCount      Int
  deliveryMode      ProgramMode
  duration          Int?           // In days
  schedule          String?        // Schedule preferences
  budgetRange       String?        // Budget range
  successMetrics    String?        // Success criteria
  
  // Links
  companyId         String?
  company           Company?       @relation(fields: [companyId], references: [id])
  contactId         String?
  contact           Contact?       @relation(fields: [contactId], references: [id])
  dealId            String?
  deal              Deal?          @relation(fields: [dealId], references: [id])
  
  // Solution
  solutions         Solution[]
  
  createdById       String
  createdBy         User           @relation("RequirementCreatedBy", fields: [createdById], references: [id])
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@map("requirements")
}

model Solution {
  id                String         @id @default(uuid())
  requirementId     String
  requirement       Requirement    @relation(fields: [requirementId], references: [id])
  
  title             String
  status            SolutionStatus @default(DRAFT)
  version           String         @default("1.0")
  
  // Curriculum
  courses           Json           // Array of course selections
  customizations    Json?          // Custom curriculum changes
  
  // Pricing
  totalPrice        Float
  currency          String         @default("INR")
  discountPercent   Float          @default(0)
  finalPrice        Float
  pricingNotes      String?
  
  // Approval
  approvalWorkflowId String?
  isApproved        Boolean        @default(false)
  
  // LMS mapping
  lmsCourseIds      Json?          // LMS course references
  
  versions          SolutionVersion[]
  
  createdById       String
  createdBy         User           @relation("SolutionCreatedBy", fields: [createdById], references: [id])
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@map("solutions")
}

model SolutionVersion {
  id                String         @id @default(uuid())
  solutionId        String
  solution          Solution       @relation(fields: [solutionId], references: [id])
  
  version           String
  changes           Json?          // What changed in this version
  notes             String?
  
  createdAt         DateTime       @default(now())
  createdById       String
  createdBy         User           @relation("SolutionVersionCreatedBy", fields: [createdById], references: [id])
  
  @@map("solution_versions")
}
```

### 6. Trainer Models (NEW)

```prisma
enum TrainerStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  UNDER_REVIEW
}

enum SkillProficiency {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

model Trainer {
  id                String         @id @default(uuid())
  
  // Basic Info
  firstName         String
  lastName          String
  email             String         @unique
  phone             String?
  designation       String?
  experienceYears   Int?
  
  // Status
  status            TrainerStatus  @default(UNDER_REVIEW)
  
  // Verification
  isNDASigned       Boolean        @default(false)
  ndaSignedAt       DateTime?
  backgroundVerified Boolean       @default(false)
  backgroundVerifiedAt DateTime?
  
  // Sourcing
  sourcedById       String?
  sourcedBy         User?          @relation("TrainerSourcingBy", fields: [sourcedById], references: [id])
  source            String?        // Internal, LinkedIn, Naukri, Referral
  
  // Relationships
  skills            TrainerSkill[]
  availabilities    TrainerAvailability[]
  rateCards         TrainerRateCard[]
  programs          ProgramTrainer[]
  payouts           TrainerPayout[]
  feedbacks         Feedback[]
  
  // Ratings
  averageRating     Float?         @default(0)
  totalRatings      Int            @default(0)
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@map("trainers")
}

model TrainerSkill {
  id                String         @id @default(uuid())
  trainerId         String
  trainer           Trainer        @relation(fields: [trainerId], references: [id])
  
  skillName         String
  proficiency       SkillProficiency
  certifications    String[]       // Array of certifications
  experience        Int?           // Years of experience in this skill
  
  @@unique([trainerId, skillName])
  @@map("trainer_skills")
}

model TrainerAvailability {
  id                String         @id @default(uuid())
  trainerId         String
  trainer           Trainer        @relation(fields: [trainerId], references: [id])
  
  startDate         DateTime
  endDate           DateTime
  isAvailable       Boolean        @default(true)
  notes             String?
  
  @@map("trainer_availabilities")
}

model TrainerRateCard {
  id                String         @id @default(uuid())
  trainerId         String
  trainer           Trainer        @relation(fields: [trainerId], references: [id])
  
  skillName         String?        // If null, default rate for all skills
  ratePerDay        Float
  currency          String         @default("INR")
  effectiveFrom     DateTime       @default(now())
  effectiveTo       DateTime?
  
  @@map("trainer_rate_cards")
}
```

### 7. Program & Delivery Models (NEW)

```prisma
enum ProgramStatus {
  PLANNING
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  POSTPONED
}

enum ProgramMode {
  ON_SITE
  OFF_SITE
  ONLINE
  HYBRID
}

enum EnrollmentStatus {
  ENROLLED
  ATTENDED
  COMPLETED
  DROPPED
  CANCELLED
}

model Program {
  id                String         @id @default(uuid())
  
  // Basic Info
  name              String
  code              String         @unique
  description       String?
  status            ProgramStatus  @default(PLANNING)
  mode              ProgramMode
  
  // Schedule
  startDate         DateTime
  endDate           DateTime
  duration          Int            // In days
  schedule          String?        // Schedule details
  
  // Location
  location          String?        // Venue/location
  onlineLink        String?        // For online/hybrid
  
  // Capacity
  maxCapacity       Int
  enrolledCount     Int            @default(0)
  
  // Links
  requirementId     String?
  requirement       Requirement?   @relation(fields: [requirementId], references: [id])
  solutionId        String?
  solution          Solution?      @relation(fields: [solutionId], references: [id])
  dealId            String?
  deal              Deal?          @relation(fields: [dealId], references: [id])
  companyId         String?
  company           Company?       @relation(fields: [companyId], references: [id])
  
  // Delivery
  deliveryManagerId String?
  deliveryManager   User?          @relation("ProgramDeliveryManager", fields: [deliveryManagerId], references: [id])
  
  // LMS
  lmsBatchId        String?        // LMS batch reference
  lmsBatchUrl       String?
  
  // Relationships
  trainers          ProgramTrainer[]
  sessions          Session[]
  enrollments       Enrollment[]
  costs             TrainingCost[]
  invoices          Invoice[]
  feedbacks         Feedback[]
  certificates      Certificate[]
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@map("programs")
}

model ProgramTrainer {
  id                String         @id @default(uuid())
  programId         String
  program           Program        @relation(fields: [programId], references: [id])
  trainerId         String
  trainer           Trainer        @relation(fields: [trainerId], references: [id])
  
  role              String?        // Primary, Co-trainer, etc.
  ratePerDay        Float?
  totalDays         Int?
  totalAmount       Float?
  
  @@unique([programId, trainerId])
  @@map("program_trainers")
}

model Session {
  id                String         @id @default(uuid())
  programId         String
  program           Program        @relation(fields: [programId], references: [id])
  
  sessionNumber     Int
  topic             String
  scheduledDate     DateTime
  duration          Int            // In hours
  
  trainerId         String?
  trainer           Trainer?       @relation("SessionTrainer", fields: [trainerId], references: [id])
  
  status            String         @default("SCHEDULED") // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
  
  // Attendance
  attendanceRecords Json?          // Array of {enrollmentId, attended, attendancePercent}
  
  // Feedback
  feedbacks         Feedback[]
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@map("sessions")
}

model Enrollment {
  id                String         @id @default(uuid())
  programId         String
  program           Program        @relation(fields: [programId], references: [id])
  contactId         String
  contact           Contact        @relation(fields: [contactId], references: [id])
  
  status            EnrollmentStatus @default(ENROLLED)
  
  // Payment
  totalFee          Float
  paidAmount        Float          @default(0)
  remainingAmount   Float
  
  // Attendance
  attendancePercent Float?         // Overall attendance percentage
  
  // Completion
  completedAt       DateTime?
  certificateId     String?
  certificate       Certificate?   @relation(fields: [certificateId], references: [id])
  
  // LMS
  lmsUserId         String?        // LMS user reference
  lmsAccessUrl      String?
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@unique([programId, contactId])
  @@map("enrollments")
}
```

### 8. Costing Models (NEW)

```prisma
model TrainingCost {
  id                String         @id @default(uuid())
  programId         String
  program           Program        @relation(fields: [programId], references: [id])
  
  // Totals
  totalCost         Float
  clientSellingPrice Float
  grossProfit       Float
  grossMarginPercent Float
  
  currency          String         @default("INR")
  
  // Components
  components        CostComponent[]
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@unique([programId])
  @@map("training_costs")
}

model CostComponent {
  id                String         @id @default(uuid())
  trainingCostId    String
  trainingCost      TrainingCost   @relation(fields: [trainingCostId], references: [id])
  
  componentType     String         // TRAINER_FEE, TRAVEL, ACCOMMODATION, FOOD, LAB, FACILITY, EQUIPMENT, MISC
  description       String
  amount            Float
  currency          String         @default("INR")
  
  // Links
  trainerId         String?        // If trainer-related cost
  trainer           Trainer?       @relation(fields: [trainerId], references: [id])
  
  createdAt         DateTime       @default(now())
  
  @@map("cost_components")
}
```

### 9. Financial Document Models (NEW)

```prisma
enum DocumentStatus {
  DRAFT
  SENT
  APPROVED
  REJECTED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum PaymentMethod {
  RAZORPAY
  STRIPE
  UPI
  BANK_TRANSFER
  CASH
  CHEQUE
  OTHER
}

model Quote {
  id                String         @id @default(uuid())
  quoteNumber       String         @unique
  solutionId        String?
  solution          Solution?      @relation(fields: [solutionId], references: [id])
  dealId            String?
  deal              Deal?          @relation(fields: [dealId], references: [id])
  
  status            DocumentStatus @default(DRAFT)
  totalAmount       Float
  currency          String         @default("INR")
  validUntil        DateTime?
  
  pdfUrl            String?
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  createdById       String
  createdBy         User           @relation("QuoteCreatedBy", fields: [createdById], references: [id])
  
  @@map("quotes")
}

model PurchaseOrder {
  id                String         @id @default(uuid())
  poNumber          String         @unique
  trainerId         String
  trainer           Trainer        @relation(fields: [trainerId], references: [id])
  programId         String?
  program           Program?       @relation(fields: [programId], references: [id])
  
  status            DocumentStatus @default(DRAFT)
  totalAmount       Float
  currency          String         @default("INR")
  
  // PO Details
  ratePerDay        Float
  numberOfDays      Int
  totalDays         Int
  startDate         DateTime
  endDate           DateTime
  
  pdfUrl            String?
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  createdById       String
  createdBy         User           @relation("POCreatedBy", fields: [createdById], references: [id])
  
  @@map("purchase_orders")
}

model Invoice {
  id                String         @id @default(uuid())
  invoiceNumber     String         @unique
  type              String         // PROFORMA, FINAL, CREDIT_NOTE
  
  // Links
  programId         String?
  program           Program?       @relation(fields: [programId], references: [id])
  dealId            String?
  deal              Deal?          @relation(fields: [dealId], references: [id])
  companyId         String?
  company           Company?       @relation(fields: [companyId], references: [id])
  
  status            DocumentStatus @default(DRAFT)
  
  // Amounts
  subtotal          Float
  taxAmount         Float          @default(0)
  discountAmount    Float          @default(0)
  totalAmount       Float
  currency          String         @default("INR")
  exchangeRate      Float?         // For multi-currency
  
  // Tax
  gstin             String?        // GST number
  taxDetails        Json?          // Tax breakdown
  
  // Payment
  paidAmount        Float          @default(0)
  remainingAmount   Float
  
  // Payment Terms
  paymentTerms      String?        // Net 30, Advance, etc.
  dueDate           DateTime?
  
  pdfUrl            String?
  
  // Line Items
  lineItems         InvoiceLineItem[]
  
  // Payments
  payments          Payment[]
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  createdById       String
  createdBy         User           @relation("InvoiceCreatedBy", fields: [createdById], references: [id])
  
  @@map("invoices")
}

model InvoiceLineItem {
  id                String         @id @default(uuid())
  invoiceId         String
  invoice           Invoice        @relation(fields: [invoiceId], references: [id])
  
  description       String
  quantity          Float
  unitPrice         Float
  taxPercent        Float          @default(0)
  totalAmount       Float
  
  @@map("invoice_line_items")
}

model Payment {
  id                String         @id @default(uuid())
  invoiceId         String
  invoice           Invoice        @relation(fields: [invoiceId], references: [id])
  contactId         String?
  contact           Contact?       @relation(fields: [contactId], references: [id])
  
  amount            Float
  currency          String         @default("INR")
  method            PaymentMethod
  status            PaymentStatus  @default(PENDING)
  
  // Gateway Details
  gatewayReference  String?        // Payment gateway transaction ID
  gatewayResponse   Json?          // Full gateway response
  
  // Bank Details (for bank transfers)
  bankName          String?
  transactionId     String?
  transactionDate   DateTime?
  
  // Installment
  installmentNumber Int?
  isInstallment     Boolean        @default(false)
  
  paidAt            DateTime?
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@map("payments")
}

model PaymentInstallment {
  id                String         @id @default(uuid())
  enrollmentId      String
  enrollment        Enrollment     @relation(fields: [enrollmentId], references: [id])
  
  installmentNumber Int
  amount            Float
  dueDate           DateTime
  paidAmount        Float          @default(0)
  status            PaymentStatus  @default(PENDING)
  
  paymentId         String?
  payment           Payment?       @relation(fields: [paymentId], references: [id])
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@unique([enrollmentId, installmentNumber])
  @@map("payment_installments")
}

model TrainerPayout {
  id                String         @id @default(uuid())
  trainerId         String
  trainer           Trainer        @relation(fields: [trainerId], references: [id])
  programId         String?
  program           Program?       @relation(fields: [programId], references: [id])
  purchaseOrderId   String?
  purchaseOrder     PurchaseOrder? @relation(fields: [purchaseOrderId], references: [id])
  
  amount            Float
  currency          String         @default("INR")
  status            PaymentStatus  @default(PENDING)
  
  paidAt            DateTime?
  paymentReference  String?
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@map("trainer_payouts")
}
```

### 10. Feedback & Certificates (NEW)

```prisma
model Feedback {
  id                String         @id @default(uuid())
  
  // Links
  programId         String?
  program           Program?       @relation(fields: [programId], references: [id])
  sessionId         String?
  session           Session?       @relation(fields: [sessionId], references: [id])
  trainerId         String?
  trainer           Trainer?       @relation(fields: [trainerId], references: [id])
  enrollmentId      String?
  enrollment        Enrollment?    @relation(fields: [enrollmentId], references: [id])
  
  // Ratings (1-5 scale)
  overallRating     Int
  trainerRating     Int?
  contentRating     Int?
  facilityRating    Int?
  
  // Qualitative
  feedbackText      String?
  suggestions       String?
  
  // NPS
  npsScore          Int?           // 0-10
  
  submittedAt       DateTime       @default(now())
  submittedById     String?
  submittedBy       User?          @relation("FeedbackSubmittedBy", fields: [submittedById], references: [id])
  
  @@map("feedbacks")
}

model Certificate {
  id                String         @id @default(uuid())
  certificateNumber String         @unique
  enrollmentId      String
  enrollment        Enrollment     @relation(fields: [enrollmentId], references: [id])
  programId         String
  program           Program        @relation(fields: [programId], references: [id])
  
  issuedAt          DateTime       @default(now())
  pdfUrl            String?
  
  @@map("certificates")
}
```

### 11. Workflow & Approval Models (NEW)

```prisma
enum WorkflowStatus {
  ACTIVE
  COMPLETED
  CANCELLED
  SUSPENDED
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}

model WorkflowInstance {
  id                String         @id @default(uuid())
  workflowDefinitionId String      // Camunda process definition ID
  camundaInstanceId String         @unique // Camunda process instance ID
  
  entityType        String         // DEAL, SOLUTION, DISCOUNT, etc.
  entityId          String
  status            WorkflowStatus @default(ACTIVE)
  
  startedAt         DateTime       @default(now())
  completedAt       DateTime?
  startedById       String
  startedBy         User           @relation("WorkflowStartedBy", fields: [startedById], references: [id])
  
  approvalTasks     ApprovalTask[]
  
  @@map("workflow_instances")
}

model ApprovalTask {
  id                String         @id @default(uuid())
  workflowInstanceId String
  workflowInstance  WorkflowInstance @relation(fields: [workflowInstanceId], references: [id])
  
  taskName          String
  status            ApprovalStatus @default(PENDING)
  priority          String?        // LOW, MEDIUM, HIGH, URGENT
  
  assignedToId      String
  assignedTo        User           @relation("ApprovalAssignee", fields: [assignedToId], references: [id])
  
  // Decision
  decision          ApprovalStatus?
  comments          String?
  decidedAt         DateTime?
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@map("approval_tasks")
}
```

### 12. Communication & Notification Models (NEW)

```prisma
enum CommunicationChannel {
  EMAIL
  WHATSAPP
  SMS
  LINKEDIN
  CALL
  MEETING
}

model CommunicationLog {
  id                String         @id @default(uuid())
  channel           CommunicationChannel
  direction         String         // INBOUND, OUTBOUND
  
  // Recipients
  toEmail           String?
  toPhone           String?
  toContactId       String?
  toContact         Contact?       @relation(fields: [toContactId], references: [id])
  
  // Content
  subject           String?
  body              String
  attachments       Json?          // Array of attachment URLs
  
  // Status
  status            String         // SENT, DELIVERED, READ, FAILED
  deliveredAt       DateTime?
  readAt            DateTime?
  
  // Links
  leadId            String?
  lead              Lead?          @relation(fields: [leadId], references: [id])
  dealId            String?
  deal              Deal?          @relation(fields: [dealId], references: [id])
  
  // Gateway References
  gatewayMessageId  String?        // Email/WhatsApp/SMS gateway message ID
  
  // Call specific
  callDuration      Int?           // In seconds
  callRecordingUrl  String?
  
  sentAt            DateTime       @default(now())
  sentById          String
  sentBy            User           @relation("CommunicationSentBy", fields: [sentById], references: [id])
  
  @@map("communication_logs")
}

enum NotificationType {
  EMAIL
  WHATSAPP
  SMS
  IN_APP
}

model NotificationTemplate {
  id                String         @id @default(uuid())
  name              String
  type              NotificationType
  subject           String?
  body              String
  variables         Json?          // Available template variables
  
  isActive          Boolean        @default(true)
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@unique([name, type])
  @@map("notification_templates")
}

model AutomationRule {
  id                String         @id @default(uuid())
  name              String
  description       String?
  
  // Trigger
  triggerEntity     String         // LEAD, DEAL, PROGRAM, PAYMENT, etc.
  triggerCondition  Json           // Condition to trigger (if-then logic)
  
  // Action
  actionType        String         // SEND_EMAIL, SEND_WHATSAPP, CREATE_TASK, UPDATE_STATUS, etc.
  actionConfig      Json           // Action configuration
  
  isActive          Boolean        @default(true)
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@map("automation_rules")
}
```

### 13. Import Tracking (NEW)

```prisma
model ImportBatch {
  id                String         @id @default(uuid())
  entityType        String         // LEAD, CONTACT, COMPANY, etc.
  fileName          String
  totalRecords      Int
  successfulRecords Int            @default(0)
  failedRecords     Int            @default(0)
  
  status            String         // PROCESSING, COMPLETED, FAILED
  
  errors            Json?          // Array of error details
  
  importedById      String
  importedBy        User           @relation("ImportBatchCreatedBy", fields: [importedById], references: [id])
  
  createdAt         DateTime       @default(now())
  completedAt       DateTime?
  
  @@map("import_batches")
}
```

---

## Activity Model Extensions

```prisma
enum ActivityType {
  NOTE
  CALL
  EMAIL
  WHATSAPP
  SMS
  LINKEDIN
  MEETING
  TASK
}

model Activity {
  // ... existing fields ...
  
  // Communication metadata
  communicationLogId String?
  communicationLog   CommunicationLog? @relation(fields: [communicationLogId], references: [id])
  
  // Meeting specific
  meetingLink       String?
  attendees         Json?          // Array of attendee IDs
  
  // Call specific
  callDuration      Int?           // In seconds
  callRecordingUrl  String?
  
  @@map("activities")
}
```

---

## Deal Model Extensions

```prisma
model Deal {
  // ... existing fields ...
  
  // Extended fields
  vertical          VerticalType?
  expectedCloseDate DateTime?
  probability       Int?           // 0-100
  
  // Links
  requirementId     String?
  requirement       Requirement?   @relation(fields: [requirementId], references: [id])
  solutionId        String?
  solution          Solution?      @relation(fields: [solutionId], references: [id])
  
  // Assignment
  assignedToId      String?
  assignedTo        User?          @relation("DealAssignee", fields: [assignedToId], references: [id])
  
  // Financial
  quotes            Quote[]
  invoices          Invoice[]
  
  @@map("deals")
}
```

---

## Summary

This extended schema covers:
- ✅ All 12 functional modules
- ✅ Multi-location accounts
- ✅ Lead scoring & management
- ✅ Requirements & Solutions with versioning
- ✅ Trainer management with skills & availability
- ✅ Programs, Sessions, Enrollments
- ✅ Training costing & profitability
- ✅ Financial documents (Quotes, POs, Invoices, Payments)
- ✅ Workflow & Approval engine
- ✅ Communication logging
- ✅ Notification templates & automation
- ✅ Feedback & Certificates
- ✅ Import tracking

**Total New Models:** ~30 models  
**Total Extended Models:** 6 models (User, Contact, Company, Deal, Activity, Course)

**Next Step:** Create Prisma migration file with all these changes.

