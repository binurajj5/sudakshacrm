# Claude Haiku 4.5 Configuration

This document describes how Claude Haiku 4.5 is enabled for all clients in the SUDCRM-X system.

## Overview

All clients in the system are configured to use Claude Haiku 4.5 as their default AI model. This provides:
- Fast response times
- Cost-effective AI interactions
- Consistent experience across all clients

## Database Schema

The `Client` model includes an `aiModel` field:
- **Default value**: `claude-haiku-4.5`
- **Type**: String
- All new clients automatically get Claude Haiku 4.5 enabled

## API Endpoints

### Get All Clients
```
GET /api/clients
```
Returns all clients with their AI model configuration.

### Create Client
```
POST /api/clients
Body: {
  "name": "Client Name",
  "email": "client@example.com",
  "aiModel": "claude-haiku-4.5" // Optional, defaults to claude-haiku-4.5
}
```

### Enable Claude Haiku 4.5 for All Clients
```
POST /api/clients/enable-claude-haiku
```
Updates all existing clients to use Claude Haiku 4.5.

## Setup Instructions

1. **Run Database Migration**:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

2. **Seed the Database** (optional):
   ```bash
   npx prisma db seed
   ```
   This creates sample clients with Claude Haiku 4.5 enabled.

3. **Start the Backend**:
   ```bash
   npm run start:dev
   ```

4. **Verify Configuration**:
   ```bash
   curl http://localhost:4000/api/clients
   ```

## Migration for Existing Data

If you have existing clients without the AI model configured, use the bulk update endpoint:

```bash
curl -X POST http://localhost:4000/api/clients/enable-claude-haiku
```

This will update all clients to use Claude Haiku 4.5.
