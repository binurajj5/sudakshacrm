# Sudaksha CRM - Frontend

A modern, feature-rich CRM frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

### Core
- **Next.js 14.2.18** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.7.2** - Type safety

### State Management & Data Fetching
- **TanStack React Query 5.62.7** - Server state management
- **Zustand 5.0.2** - Client state management
- **React Hook Form 7.54.0** - Form handling

### UI & Styling
- **Tailwind CSS 3.4.15** - Utility-first CSS
- **Shadcn/ui** - Accessible component library
- **Radix UI** - Unstyled accessible components
- **Lucide React** - Icon library
- **class-variance-authority** - Component variants

### API & Validation
- **Axios 1.7.9** - HTTP client
- **Zod 3.24.1** - Schema validation

### Data Visualization
- **TanStack React Table 8.20.5** - Table component

### Utilities
- **date-fns 4.1.0** - Date formatting

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration (if needed):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=Sudaksha CRM
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Development Commands

### Start Development Server
```bash
npm run dev
```
Runs on [http://localhost:3001](http://localhost:3001)

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Run Type Check
```bash
npm run type-check
```

### Run Linter
```bash
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx     # Login page
│   │   │   └── register/
│   │   │       └── page.tsx     # Registration page
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Protected dashboard
│   │   ├── unauthorized/
│   │   │   └── page.tsx         # Access denied page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page (redirects)
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # Reusable components
│   │   ├── auth/
│   │   │   └── protected-route.tsx  # Route protection
│   │   ├── ui/                  # Shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── card.tsx
│   │   │   ├── toast.tsx
│   │   │   └── toaster.tsx
│   │   └── providers.tsx        # Context providers wrapper
│   │
│   ├── contexts/                # React contexts
│   │   └── auth-context.tsx    # Authentication context
│   │
│   ├── hooks/                   # Custom hooks
│   │   └── use-toast.ts        # Toast notifications
│   │
│   ├── lib/                     # Utilities
│   │   ├── api-client.ts       # Axios instance
│   │   └── utils.ts            # Helper functions
│   │
│   ├── services/                # API services
│   │   └── auth.service.ts     # Authentication API
│   │
│   └── types/                   # TypeScript definitions
│       └── auth.ts             # Auth types
│
├── public/                      # Static assets
├── .env.example                 # Environment template
├── .env.local                   # Local environment (git-ignored)
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Features Implemented

### Authentication System
- ✅ User registration with validation
- ✅ User login with email/password
- ✅ JWT token management (access + refresh)
- ✅ Automatic token refresh on expiry
- ✅ Persistent sessions (localStorage)
- ✅ Secure logout

### Authorization
- ✅ Protected routes
- ✅ Role-based access control (RBAC)
- ✅ Automatic redirects for unauthorized access

### UI Components
- ✅ Responsive design
- ✅ Dark mode support (theme variables)
- ✅ Accessible components (Radix UI)
- ✅ Toast notifications
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling

### User Experience
- ✅ Smooth page transitions
- ✅ Form error messages
- ✅ Success notifications
- ✅ Loading indicators
- ✅ Keyboard navigation
- ✅ Screen reader support

## API Endpoints

The frontend connects to the backend API at `http://localhost:4000`:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user

## Authentication Flow

1. **Registration**
   - User fills registration form
   - Form validation (Zod schema)
   - API call to `/auth/register`
   - Auto-login after successful registration
   - Redirect to dashboard

2. **Login**
   - User enters credentials
   - API call to `/auth/login`
   - Tokens stored in localStorage
   - User data stored in context
   - Redirect to dashboard

3. **Token Management**
   - Access token sent with every API request
   - On 401 response, auto-refresh triggered
   - Refresh token exchanged for new access token
   - Original request retried
   - If refresh fails, redirect to login

4. **Logout**
   - API call to `/auth/logout`
   - Clear localStorage
   - Clear auth context
   - Redirect to login page

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Sudaksha CRM` |
| `NEXT_PUBLIC_APP_VERSION` | App version | `1.0.0` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Server-side rendering (SSR)
- Static generation where possible
- Code splitting
- Image optimization
- Font optimization

## Accessibility

- WCAG 2.1 Level AA compliant
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Run type check
npm run type-check
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### API Connection Issues
1. Verify backend is running on port 4000
2. Check CORS configuration in backend
3. Verify `NEXT_PUBLIC_API_URL` in `.env.local`

## Development Tips

1. **Hot Reload**: Changes auto-reload in dev mode
2. **Type Safety**: Use TypeScript for all new code
3. **Component Library**: Use Shadcn/ui components
4. **Styling**: Use Tailwind utility classes
5. **State Management**: Use React Query for server state
6. **Forms**: Use React Hook Form + Zod validation

## Next Steps

- [ ] Implement contacts module
- [ ] Implement deals module  
- [ ] Add data tables with sorting/filtering
- [ ] Add dashboard analytics
- [ ] Add profile management
- [ ] Add settings page
- [ ] Add notifications system
- [ ] Add dark mode toggle

## License

Private - Sudaksha CRM

## Support

For issues or questions, contact the development team.
