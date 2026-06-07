# TiffinHub 🍱

A production-ready full-stack Tiffin Delivery Platform built with Next.js 15, TypeScript, Tailwind CSS, Supabase, and Razorpay.

## Features

### Customer
- Landing page with hero, featured meals, testimonials, FAQ
- Menu browsing with search, filters, and sorting
- Shopping cart with persistent state
- Checkout with WhatsApp order notifications
- Customer dashboard with order history
- Real-time order tracking via Supabase Realtime
- Subscription plans (weekly/monthly)
- Razorpay payment integration

### Admin
- Dashboard with revenue and order statistics
- Order management with status updates
- Menu CRUD with image upload
- Customer analytics
- Revenue and order charts
- Subscription management

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Google + Email/Password)
- **Storage:** Supabase Storage
- **Payments:** Razorpay
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Charts:** Recharts
- **State:** Zustand (cart)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Fill in your Supabase and Razorpay credentials.

### 3. Database Setup

Run the SQL migrations in Supabase SQL Editor:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_seed_data.sql`

See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for detailed instructions.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create Admin User

Register via the app, then run in Supabase SQL:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes (Razorpay, orders)
│   ├── auth/               # Auth callback
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── dashboard/          # Customer dashboard
│   ├── login/              # Authentication
│   ├── menu/               # Menu browsing
│   ├── orders/             # Order history & tracking
│   ├── payment/            # Razorpay payment
│   └── subscriptions/      # Subscription plans
├── components/
│   ├── admin/              # Admin components
│   ├── landing/            # Landing page sections
│   ├── layout/             # Header, footer
│   ├── menu/               # Menu cards
│   ├── orders/             # Order tracking
│   ├── providers/          # Theme, toast providers
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom hooks (cart)
├── lib/
│   ├── actions/            # Server actions
│   ├── supabase/           # Supabase clients
│   └── validations/        # Zod schemas
├── types/                  # TypeScript types
└── middleware.ts           # Auth middleware
supabase/
└── migrations/             # SQL schema & seed data
docs/                       # Setup guides
```

## Documentation

- [Supabase Setup](docs/SUPABASE_SETUP.md)
- [Razorpay Setup](docs/RAZORPAY_SETUP.md)
- [Vercel Deployment](docs/VERCEL_DEPLOYMENT.md)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_APP_URL` | Application URL |
| `NEXT_PUBLIC_WHATSAPP_OWNER_PHONE` | Owner WhatsApp number |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |

## License

MIT
