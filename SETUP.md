# Linkio - URL Shortener Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL database (Neon)
- pnpm

## Environment Setup

1. **Copy .env.example to .env.local:**
   ```bash
   cp .env.example .env.local
   ```

2. **Set required environment variables:**
   ```bash
   DATABASE_URL=postgresql://user:password@host/database
   BETTER_AUTH_SECRET=$(openssl rand -base64 32)
   ```

## Database Setup

The application uses PostgreSQL with Drizzle ORM and Better Auth. The schema needs to be created before first use.

### Option 1: Using Neon Console

1. Go to your Neon dashboard
2. Open the SQL editor
3. Create the tables using the SQL commands below

### Option 2: Running SQL Statements

Execute these SQL statements in your PostgreSQL database:

```sql
-- Better Auth Tables
CREATE TABLE "user" (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  emailVerified BOOLEAN NOT NULL DEFAULT FALSE,
  image TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "session" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  ipAddress TEXT,
  userAgent TEXT,
  FOREIGN KEY (userId) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE "account" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  providerAccountId TEXT NOT NULL,
  refreshToken TEXT,
  accessToken TEXT,
  expiresAt BIGINT,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES "user"(id) ON DELETE CASCADE,
  UNIQUE(provider, providerAccountId)
);

CREATE TABLE "verification" (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Application Tables
CREATE TABLE "urls" (
  id SERIAL PRIMARY KEY,
  userId TEXT NOT NULL,
  shortCode TEXT NOT NULL UNIQUE,
  originalUrl TEXT NOT NULL,
  customAlias TEXT,
  title TEXT,
  description TEXT,
  password TEXT,
  expiresAt TIMESTAMP,
  maxClicks INTEGER,
  clicks INTEGER NOT NULL DEFAULT 0,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE "analytics" (
  id SERIAL PRIMARY KEY,
  urlId INTEGER NOT NULL,
  userId TEXT NOT NULL,
  referrer TEXT,
  userAgent TEXT,
  ipAddress TEXT,
  country TEXT,
  city TEXT,
  browser TEXT,
  browserVersion TEXT,
  os TEXT,
  osVersion TEXT,
  device TEXT,
  deviceType TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (urlId) REFERENCES "urls"(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE "dailyStats" (
  id SERIAL PRIMARY KEY,
  urlId INTEGER NOT NULL,
  userId TEXT NOT NULL,
  date DATE NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  uniqueVisitors INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (urlId) REFERENCES "urls"(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES "user"(id) ON DELETE CASCADE,
  UNIQUE(urlId, date)
);

-- Create indexes for better performance
CREATE INDEX "urls_userId" ON "urls"("userId");
CREATE INDEX "urls_shortCode" ON "urls"("shortCode");
CREATE INDEX "analytics_urlId" ON "analytics"("urlId");
CREATE INDEX "analytics_userId" ON "analytics"("userId");
CREATE INDEX "dailyStats_urlId" ON "dailyStats"("urlId");
CREATE INDEX "dailyStats_userId" ON "dailyStats"("userId");
```

## Running the Application

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   pnpm dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000`

## Features

### Authentication
- Email/password registration and login
- Session management with 7-day expiration
- Protected routes for authenticated users

### URL Management
- Create shortened URLs with custom aliases
- Automatic short code generation
- URL expiration and click limits
- Password protection for URLs
- Archive old URLs

### Analytics
- Track clicks per URL
- Visitor information (browser, OS, device, location)
- Daily statistics aggregation
- Beautiful analytics dashboard with charts

### QR Codes
- Automatic QR code generation for each short link
- Download QR codes as images

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts     # Better Auth handler
│   │   └── redirect/[shortCode]/       # Short URL redirect
│   ├── dashboard/                      # User dashboard
│   ├── sign-in/                        # Authentication pages
│   ├── sign-up/
│   ├── layout.tsx
│   ├── page.tsx                        # Landing page
│   └── globals.css
├── lib/
│   ├── auth.ts                         # Better Auth config
│   ├── auth-client.ts                  # Client-side auth
│   ├── db/
│   │   ├── index.ts                    # Drizzle ORM setup
│   │   └── schema.ts                   # Database schema
├── components/
│   ├── ui/                             # shadcn components
│   ├── auth-form.tsx                   # Auth component
│   └── dashboard/                      # Dashboard components
└── app/actions/
    └── urls.ts                         # Server actions
```

## Key Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Better Auth** - Authentication
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **Recharts** - Analytics charts
- **Lucide Icons** - Icons
- **Zod** - Validation

## Deployment

### Vercel Deployment

1. Push your repository to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
4. Deploy

The application will automatically use the production database URL and configure CORS for your Vercel domain.

## Troubleshooting

### "Module not found" errors
Ensure all dependencies are installed:
```bash
pnpm install
```

### "Invalid origin" errors
Check that your domain is added to `trustedOrigins` in `lib/auth.ts`

### Database connection errors
Verify your `DATABASE_URL` environment variable is correct and the database server is accessible.

### Session not persisting
Ensure `BETTER_AUTH_SECRET` is set and consistent across deployments.

## Support

For issues or questions, refer to:
- [Better Auth Documentation](https://better-auth.com)
- [Next.js Documentation](https://nextjs.org)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
