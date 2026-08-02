# Linkio - Production URL Shortener

A modern, feature-rich URL shortening service built with Next.js, TypeScript, and PostgreSQL. Create branded short links with powerful analytics, track every click, and optimize your campaigns in real-time.

## Features

### Core Functionality
- **Instant Link Creation** - Create short, memorable links in seconds
- **Custom Aliases** - Set custom short URLs or use auto-generated codes
- **URL Management** - View, edit, archive, and delete your links
- **Link Expiration** - Set expiration dates or click limits on URLs
- **Password Protection** - Protect sensitive URLs with passwords

### Analytics & Tracking
- **Real-time Click Tracking** - See clicks as they happen
- **Visitor Intelligence** - Track browser, OS, device, and location data
- **Daily Statistics** - Aggregated analytics with beautiful charts
- **Analytics Dashboard** - Comprehensive stats for each link
- **Referrer Tracking** - See where your traffic comes from

### Advanced Features
- **QR Code Generation** - Automatic QR codes for offline marketing
- **Link Search & Filtering** - Find links by title or description
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark Mode** - Beautiful dark theme by default
- **Enterprise Security** - Bank-level encryption and SSL/TLS

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router and Turbopack
- **React 19** - Latest React with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Recharts** - Beautiful analytics charts

### Backend
- **Next.js Server Actions** - Secure server-side operations
- **Better Auth** - Simple and secure authentication
- **Drizzle ORM** - Type-safe database queries

### Database
- **PostgreSQL** - Reliable relational database
- **Neon** - Serverless PostgreSQL hosting

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (or Neon account)
- pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linkio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure database**
   - Set `DATABASE_URL` to your PostgreSQL connection string
   - Generate a secure `BETTER_AUTH_SECRET`:
     ```bash
     openssl rand -base64 32
     ```

5. **Create database tables**
   - See [SETUP.md](./SETUP.md) for SQL setup instructions

6. **Start development server**
   ```bash
   pnpm dev
   ```

7. **Open in browser**
   Navigate to `http://localhost:3000`

## Usage

### Creating a Short Link

1. Sign up or log in at the landing page
2. Click "New Link" in the dashboard
3. Enter the URL you want to shorten
4. (Optional) Add a title, description, or custom alias
5. Click "Create Link"
6. Copy the short URL and start sharing

### Tracking Analytics

1. Go to the dashboard
2. Click on any link to view detailed analytics
3. See real-time click data, visitor information, and daily statistics
4. Export or share analytics reports

### Managing Links

- **Archive** - Hide links without deleting them
- **Edit** - Update title or description
- **Delete** - Permanently remove a link
- **Search** - Find links by title or description
- **Filter** - View active or archived links

## Project Structure

```
linkio/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts    # Authentication endpoint
│   │   └── redirect/[shortCode]/      # Short URL redirect handler
│   ├── dashboard/                      # User dashboard pages
│   ├── sign-in/                        # Sign-in page
│   ├── sign-up/                        # Sign-up page
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Landing page
│   └── globals.css                     # Global styles
├── lib/
│   ├── auth.ts                         # Better Auth configuration
│   ├── auth-client.ts                  # Client-side auth utilities
│   ├── db/
│   │   ├── index.ts                    # Drizzle ORM setup
│   │   └── schema.ts                   # Database schema
│   └── utils.ts                        # Utility functions
├── components/
│   ├── ui/                             # shadcn UI components
│   ├── auth-form.tsx                   # Authentication form
│   └── dashboard/                      # Dashboard components
├── app/actions/
│   └── urls.ts                         # Server actions for URL operations
├── public/                             # Static assets
├── SETUP.md                            # Detailed setup guide
└── README.md                           # This file
```

## Database Schema

### Tables
- **user** - User accounts
- **session** - User sessions
- **account** - OAuth accounts (future)
- **verification** - Email verification codes
- **urls** - Shortened URLs
- **analytics** - Click and visitor analytics
- **dailyStats** - Aggregated daily statistics

See [SETUP.md](./SETUP.md) for complete schema SQL.

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Create new account
- `POST /api/auth/sign-in` - Sign in
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session

### URL Management
- `GET /api/redirect/[shortCode]` - Redirect to original URL

### Server Actions (Next.js)
- `createUrl()` - Create new shortened URL
- `getUrls()` - Fetch user's URLs
- `getUrlById()` - Get specific URL
- `updateUrl()` - Update URL metadata
- `deleteUrl()` - Delete URL
- `getUrlAnalytics()` - Get analytics for URL
- `getUrlStats()` - Get aggregated stats

## Authentication

The application uses **Better Auth** for secure, simple authentication:
- Email/password authentication
- Automatic session management
- CSRF protection
- Secure cookie handling

## Security Features

- **Server-side validation** - All operations validated on the server
- **User scoping** - Users can only access their own links
- **CSRF protection** - Built-in by Next.js and Better Auth
- **Password hashing** - bcrypt hashing for user passwords
- **Secure sessions** - 7-day expiration, HTTP-only cookies
- **Input sanitization** - Zod validation on all inputs
- **SQL injection prevention** - Parameterized queries via Drizzle ORM

## Performance Optimizations

- **Server Components** - Efficient server-side rendering
- **Optimistic updates** - Instant UI feedback
- **Database indexing** - Indexes on frequently queried fields
- **Caching** - Next.js caching with revalidation tags
- **Image optimization** - QR codes generated efficiently

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

```bash
# Environment variables needed
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<generated-secret>
```

### Self-hosted

1. Build the application
   ```bash
   pnpm build
   ```

2. Start the server
   ```bash
   pnpm start
   ```

3. Set up PostgreSQL database
4. Configure environment variables
5. Set up SSL/TLS certificates

## Development

### Running Tests
```bash
pnpm test
```

### Linting
```bash
pnpm lint
```

### Building
```bash
pnpm build
```

## Roadmap

- [ ] QR code customization (colors, logos)
- [ ] Advanced analytics exports (CSV, PDF)
- [ ] Link scheduling
- [ ] API access for programmatic link creation
- [ ] Team collaboration features
- [ ] Custom domain support
- [ ] Link preview embeds
- [ ] Advanced geolocation analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For help or questions:
- Check [SETUP.md](./SETUP.md) for setup instructions
- Review the code documentation
- Open an issue on GitHub

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Authentication by [Better Auth](https://better-auth.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Database with [PostgreSQL](https://www.postgresql.org) & [Neon](https://neon.tech)
