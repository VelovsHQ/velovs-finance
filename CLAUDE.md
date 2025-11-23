# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start Next.js development server on port 3000
- `pnpm dev:ngrok` - Start ngrok tunnel for webhook testing (requires ngrok.yml config)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint on all files

### Package Manager
This project uses **pnpm** (not npm or yarn). Always use `pnpm` commands.

## Architecture Overview

### Multi-Stage Middleware Pipeline

The middleware (middleware.ts) implements a **three-stage request processing pipeline**:

1. **Environment Validation (First Priority)** - Checks critical env vars before ANY processing. Redirects to `/setup` if incomplete.
2. **Locale Handling** - Redirects `/` to `/{locale}` based on cookie (`NEXT_LOCALE`) or default locale.
3. **Authentication Protection** - Uses Clerk's `clerkMiddleware` with route matchers defined in `lib/routes.ts`.

**Critical**: Static assets and API routes bypass all middleware for performance.

### Route Organization Pattern

The app uses **nested route groups** for logical separation:

```
app/
├── [locale]/              # i18n wrapper (all localized routes)
│   ├── (guest)/          # Public pages (landing, blog) - NO auth required
│   ├── (platform)/       # Protected dashboard - auth REQUIRED
│   ├── (auth)/           # Sign-in/sign-up pages
│   └── (legal)/          # Terms, privacy
├── api/                  # API routes (no locale prefix)
└── setup/                # Setup wizard (bypasses locale AND auth)
```

**Why setup is special**: Exists outside `[locale]` to allow first-time configuration before database/auth is configured.

### Payment Provider Architecture

**Three payment providers supported simultaneously**:
- **Stripe** (`lib/stripe.ts`) - Global standard
- **Lemon Squeezy** (`lib/lemonsqueezy.ts`) - Merchant of Record
- **WebXPay** (`lib/webxpay.ts`) - Sri Lankan gateway

**Key Pattern**: Lazy initialization - providers only initialize if env vars exist.

**Configuration**:
- Global provider selection in `lib/config/pricing.ts` → `paymentProvider`
- Each plan has `priceId` (Stripe) AND `variantId` (Lemon Squeezy)
- Unified `PaymentHistory` model tracks all providers with sparse indexes

### Webhook Processing Pattern

**All webhooks follow this pattern**:
1. Rate limiting via `withRateLimit(RATE_LIMIT_CONFIGS.WEBHOOK)`
2. Signature verification (provider-specific)
3. Database connection via `await connectDB()`
4. Transaction handling via `lib/transaction-utils.ts`

**Webhook endpoints**:
- `/api/webhook/stripe` - Stripe payment events
- `/api/webhook/lemonsqueezy` - Lemon Squeezy events
- `/api/webhook/webxpay` - WebXPay events
- `/api/webhook/clerk` - User lifecycle events

### Two-Phase Transaction Pattern

**Critical architectural decision**: Database operations and external API calls are separated.

Use `lib/transaction-utils.ts`:

```typescript
// Database-only transaction
withTransaction(async (session) => {
  // All DB operations here use session
  await User.create([{ ... }], { session });
})

// Database + External API transaction
withTransactionAndExternal(
  async (session) => {
    // DB operations (atomic)
    return await User.create([{ ... }], { session });
  },
  async (dbResult) => {
    // External API calls (after DB commit)
    await clerkClient.users.updateUser(...);
  }
)
```

**Why**: External APIs (Clerk, payment providers) cannot participate in MongoDB transactions. This pattern ensures:
- Database operations are atomic
- External API calls happen AFTER DB commit
- Automatic rollback if anything fails

Also available: `withRetryTransaction()` for transient failures (network timeouts, write conflicts).

### Database Connection Management

**File**: `lib/db.ts`

**Pattern**: Single connection reused across requests (connection pooling).

**Features**:
- Retry logic with exponential backoff (3 attempts)
- Connection state tracking prevents duplicates
- Graceful shutdown handlers (SIGTERM/SIGINT)
- Health check endpoint: `/api/health/database`

**Always use**: `await connectDB()` before database operations in API routes.

### User Creation Flow (Webhook-Driven)

When a user signs up in Clerk:

1. **Clerk Webhook** → `/api/webhook/clerk` receives `user.created` event
2. **Create payment customer** (if Stripe/LS configured)
3. **MongoDB User creation** via transaction
4. **Clerk metadata update** via external operation (links payment customer IDs)

**Pattern**: Webhook-driven sync keeps Clerk, MongoDB, and payment providers in lockstep.

### Configuration System

**Key config files** (all in `lib/config/`):
- `pricing.ts` - Plans, prices, features, payment provider selection, credits config
- `settings.ts` - Site name, logo paths, domain, social links, footer data
- `seo.config.ts` - Metadata, OpenGraph, Twitter cards
- `locales.ts` - Supported locales, default locale
- `routes.ts` - Public vs protected route definitions

**When customizing**:
1. Update `settings.ts` first (brand identity)
2. Update `pricing.ts` second (monetization)
3. Update `seo.config.ts` third (SEO/social)

### Environment Setup Wizard

**File**: `lib/env-checker.ts`

**Pattern**: Structured validation with auto-generated setup instructions.

**How it works**:
1. Groups env vars by category (Clerk, Database, Email, Payments)
2. Validates format using regex patterns
3. Middleware checks on every request → redirects to `/setup` if incomplete
4. `/setup` page shows missing vars with copy-paste instructions

**Why unique**: Most boilerplates fail silently. This guides developers through first-time setup.

### Rate Limiting Pattern

**File**: `lib/rate-limiter.ts`

**Implementation**: In-memory sliding window (Map-based).

**Tiered configs**:
- Webhooks: 10 req/min
- Payments: 5 req/15min
- API: 100 req/15min

**Usage**: Wrap route handlers with `withRateLimit()`:

```typescript
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.WEBHOOK)(
  async (req: Request) => {
    // Route handler
  }
);
```

**Production note**: Comments suggest Redis for distributed rate limiting.

### Logging Architecture

**File**: `lib/utils/logger.ts`

**Pattern**: Context-aware structured logging (not console.log).

```typescript
const logger = createLogger({ component: "stripe-webhook" });
logger.info("Payment processed", { userId, amount });
logger.error("Payment failed", error);
```

**Design**: Prepares for production logging services (Sentry, LogRocket).

### Internationalization (i18n)

**Setup**: `next-intl` with dynamic message loading.

**Current state**: Single locale (English), but fully structured for expansion.

**Files**:
- `lib/config/locales.ts` - Locale configuration
- `locales/en.json` - Translation messages
- `app/[locale]/layout.tsx` - I18n provider

**Cookie**: User locale persisted in `NEXT_LOCALE` cookie.

### Component Organization

```
components/
├── ui/              # shadcn/ui base components (Radix primitives)
├── landing/         # Marketing page sections (hero, pricing, testimonials)
├── platform/        # Dashboard components (billing, sidebar)
├── auth/            # Authentication UI
├── payments/        # Payment-specific components
└── buttons/         # Reusable button components
```

**Design system**: Radix UI + Tailwind CSS + CVA (class-variance-authority).

**Theme**: `next-themes` with system detection. CSS variables in `app/globals.css`.

### State Management

**File**: `context/app.tsx`

**AppContext provides**:
- `billing` - Current plan and credits
- `user` - User metadata from Clerk
- `myFeedback` - User feedback status
- `refreshBillingData()` - Fetch from `/api/app`

**Pattern**: Context wraps different layout types (guest, platform, auth) for universal access.

### Database Models

**User Model** (`models/User.ts`):
- Links to Clerk ID (`clerkUserId`)
- Stores plan details (denormalized for performance)
- Multi-provider customer IDs: `stripeCustomerId`, `lemonSqueezyCustomerId`, `webxpayCustomerId`
- Credits tracking

**PaymentHistory Model** (`models/PaymentHistory.ts`):
- Provider-agnostic design with sparse indexes
- Stores raw webhook data for debugging
- Compound indexes for efficient queries by user/status

**Pattern**: Plan details denormalized in User document to avoid joins.

## Important Patterns

### When Adding New API Routes

1. Import and call `connectDB()` before database operations
2. Add rate limiting: `withRateLimit(RATE_LIMIT_CONFIGS.API)`
3. Use structured logger: `createLogger({ component: "route-name" })`
4. Wrap DB operations in transactions for data integrity
5. Handle errors with proper HTTP status codes

### When Adding New Protected Routes

1. Add route to `app/[locale]/(platform)/` directory
2. Route automatically protected by middleware (NOT in `lib/routes.ts`)
3. Access user via `auth()` from `@clerk/nextjs/server`

### When Adding New Public Routes

1. Add route pattern to `lib/routes.ts` → `publicRoutes` array
2. Use glob patterns for dynamic routes: `/:locale/blog(.*)`

### When Modifying Pricing

1. Update `lib/config/pricing.ts` → `PricingPlans` array
2. Create products in Stripe/Lemon Squeezy dashboard
3. Copy Price IDs / Variant IDs into plan objects
4. Test webhook flow: create subscription → verify database update

### When Adding New Webhooks

1. Follow pattern in existing webhook handlers
2. Verify signature BEFORE processing (security)
3. Use `withTransaction()` for database operations
4. Return 200 immediately (webhooks retry on failure)
5. Log all events for debugging

## Common Issues

### Database Connection Errors
- Ensure `MONGO_URI` is set and MongoDB is running
- Connection has 30-second timeout with 3 retries
- Check `/api/health/database` for connection status

### Middleware Redirect Loops
- Ensure `/setup`, `/api/*`, and static files are excluded in middleware
- Public routes must be defined in `lib/routes.ts`
- Check middleware.ts line 20-31 for bypass conditions

### Webhook Verification Failures
- Stripe: Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Lemon Squeezy: Check `LEMON_SQUEEZY_WEBHOOK_SECRET`
- WebXPay: Check MD5 hash calculation in `lib/webxpay.ts`
- Use ngrok for local testing: `pnpm dev:ngrok`

### Environment Setup Loop
- If redirecting to `/setup` constantly, check `lib/env-checker.ts`
- Verify all required env vars are in `.env.local`
- Check environment validation API: `/api/setup/env-check`

## Production Deployment

**Platform**: Optimized for Vercel deployment.

**Pre-deployment checklist**:
1. All environment variables set in Vercel dashboard
2. MongoDB accessible from Vercel (whitelist IPs)
3. Webhook URLs updated in Stripe/Lemon Squeezy dashboards
4. Test `/api/health/database` in production
5. Verify payment flow end-to-end

**Performance optimizations** (configured in `next.config.ts`):
- Image optimization with Sanity CDN
- Bundle splitting for vendor chunks
- Package import optimization (Radix UI, Lucide)
- Static asset caching (1 year)
- Security headers (X-Frame-Options, CSP)

## Key Files Reference

- `middleware.ts` - Three-stage request pipeline
- `lib/routes.ts` - Public route definitions
- `lib/db.ts` - Database connection management
- `lib/transaction-utils.ts` - Transaction patterns
- `lib/env-checker.ts` - Environment validation
- `lib/rate-limiter.ts` - Rate limiting implementation
- `lib/utils/logger.ts` - Structured logging
- `lib/config/pricing.ts` - Payment configuration
- `lib/config/settings.ts` - Site configuration
- `context/app.tsx` - Global state management
- `models/User.ts` - User data schema
- `models/PaymentHistory.ts` - Payment tracking schema
