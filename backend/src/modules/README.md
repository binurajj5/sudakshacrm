# Domain-Based Modules

This directory contains all domain-based modules for the Sudaksha CRM system. Each module represents a distinct business domain with clear boundaries.

## Architecture Pattern

- **Modular Monolith**: Domain-driven design with clear separation of concerns
- **Microservice-Ready**: Modules are designed to be extracted into microservices in the future if needed
- **API-First**: RESTful APIs with versioning (/api/v1)

## Planned Modules

### Core CRM Modules
- **auth**: Authentication and authorization (JWT, RBAC)
- **users**: User management and profiles
- **contacts**: Multi-type contacts (Students, Corporates, Institutions, Individuals)
- **companies**: Companies/Accounts management
- **deals**: Deals and sales pipeline with Kanban stages
- **activities**: Activities and timeline tracking
- **audit**: Audit logs for compliance and tracking

### Marketing & Outreach Modules
- **campaigns**: Email campaigns (bulk, templates, automation)
- **whatsapp**: WhatsApp Cloud API integration (templates, broadcasts)
- **social-media**: Social media management (LinkedIn, Twitter/X, Facebook, Instagram)
- **ads**: Ads orchestration (Google Ads, Meta Ads, LinkedIn Ads)
- **webinars**: Webinar and event campaign management

### AI & Intelligence Modules
- **ai**: AI-powered features (content generation, lead scoring, sentiment analysis)
- **content-ai**: AI-based content creation (text, image, video placeholders)

## Module Structure Convention

Each module should follow this structure:

```
module-name/
├── dto/                    # Data Transfer Objects
├── entities/               # Database entities (Prisma models)
├── interfaces/             # TypeScript interfaces
├── controllers/            # HTTP controllers
├── services/               # Business logic
├── repositories/           # Data access layer (if needed)
├── guards/                 # Authorization guards
├── decorators/             # Custom decorators
├── module-name.module.ts   # Module definition
└── tests/                  # Unit and integration tests
```

## Implementation Guidelines

1. **Domain Boundaries**: Each module should be self-contained with minimal coupling
2. **Dependency Direction**: Modules can depend on common utilities, but not on other domain modules directly
3. **Events**: Use events for inter-module communication when necessary
4. **Testing**: Each module must have unit tests and integration tests
5. **Documentation**: Each module should have its own README explaining its purpose and API

## Next Steps

Modules will be implemented incrementally in phases:
- **Phase 1**: Core infrastructure (auth, users)
- **Phase 2**: CRM fundamentals (contacts, companies, deals, activities)
- **Phase 3**: Marketing & outreach (campaigns, whatsapp, social-media)
- **Phase 4**: AI integration (ai, content-ai)
