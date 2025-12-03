# PainPointRadar MVP

A Next.js 14 full-stack application that helps SaaS founders discover validated pain points from Reddit discussions.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Clerk
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))
- [Clerk](https://clerk.com) account for authentication
- Reddit API credentials (for scanning)

### Setup

1. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your values:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: From Clerk dashboard
   - `CLERK_SECRET_KEY`: From Clerk dashboard
   - `REDDIT_CLIENT_ID`: From Reddit app settings
   - `REDDIT_CLIENT_SECRET`: From Reddit app settings

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── scans/        # Scan CRUD operations
│   │   └── waitlist/     # Waitlist signup
│   ├── dashboard/         # Authenticated dashboard pages
│   ├── sample-report/     # Public demo page
│   ├── sign-in/          # Clerk sign-in
│   └── sign-up/          # Clerk sign-up
├── components/            # React components
│   ├── landing/          # Landing page sections
│   ├── layout/           # Header, Footer
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility modules
│   ├── analytics.ts      # Event tracking
│   ├── cluster-engine.ts # Pain point clustering
│   ├── config.ts         # Environment config
│   ├── db.ts            # Prisma client
│   ├── reddit-client.ts  # Reddit API client
│   ├── utils.ts         # Helper functions
│   └── validations.ts   # Zod schemas
├── prisma/               # Database schema
│   └── schema.prisma
└── middleware.ts         # Clerk auth middleware
```

## Features

### ✅ Implemented (MVP)

- [x] Landing page with waitlist form
- [x] User authentication (Clerk)
- [x] Dashboard with scan management
- [x] Scan creation form
- [x] Reddit API client with rate limiting
- [x] Pain point clustering engine
- [x] Scan results view with clusters
- [x] Sample report (public demo)
- [x] Analytics event tracking

### 🚧 Coming Next

- [ ] Background job processing for scans
- [ ] CSV export functionality
- [ ] Cluster filtering and search
- [ ] Email notifications
- [ ] Multiple data sources

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## License

MIT
