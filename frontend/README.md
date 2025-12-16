# Sudaksha CRM Frontend

Enterprise-grade CRM frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + Shadcn/ui
- **State Management:** TanStack Query + Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on http://localhost:4000

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # Dashboard pages
│   │   └── ...
│   ├── components/             # React components
│   │   ├── ui/                 # Shadcn/ui components
│   │   ├── layout/             # Layout components
│   │   ├── auth/               # Auth components
│   │   └── ...
│   ├── lib/                    # Utilities
│   │   ├── api-client.ts       # Axios instance
│   │   └── utils.ts            # Helper functions
│   ├── services/               # API services
│   ├── types/                  # TypeScript types
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom hooks
│   └── config/                 # Configuration files
├── public/                     # Static assets
└── ...config files
```

## Features

- ✅ JWT Authentication with auto token refresh
- ✅ Role-based access control (RBAC)
- ✅ Complete CRM modules (Contacts, Companies, Deals, etc.)
- ✅ 360° profile views
- ✅ Financial management (B2C + B2B)
- ✅ Bulk messaging with compliance
- ✅ Analytics and reporting
- ✅ Document generation
- ✅ Responsive design
- ✅ Dark mode support

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:4000 |
| `NEXT_PUBLIC_APP_NAME` | Application name | Sudaksha CRM |
| `NEXT_PUBLIC_APP_VERSION` | App version | 1.0.0 |

## Authentication Flow

1. User logs in → JWT tokens stored in localStorage
2. API client automatically attaches Bearer token
3. On 401 response → Refresh token automatically
4. On refresh failure → Redirect to login

## Development Guidelines

- Use TypeScript strict mode
- Follow Next.js 14 App Router conventions
- Use "use client" directive only when needed
- Implement proper error handling
- Add loading states for async operations
- Ensure mobile responsiveness
- Test RBAC on all protected routes

## Troubleshooting

### Backend Connection Issues

Ensure backend is running on port 4000 and CORS is enabled.

### Token Issues

Clear localStorage and try logging in again:

```javascript
localStorage.clear()
```

### Build Errors

Clean the build cache:

```bash
rm -rf .next
npm run build
```

## License

Proprietary - Sudaksha Training & Consulting
