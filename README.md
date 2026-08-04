<div align="center">

<img src="public/favicon.svg" alt="Sharm Cloud Tours" width="120" height="120" style="filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.5));" />

# Sharm Cloud Tours

### *Discover. Book. Explore Sharm El-Sheikh.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker)](https://docker.com)

<br/>

![Type Animation](https://readme-typing-svg.demolab.com?font=Playfair+Display&weight=700&size=28&duration=3000&pause=1000&color=FFD700&center=true&vCenter=true&multiline=true&repeat=true&width=600&height=80&lines=%F0%9F%8F%96+Premium+Tour+Booking+Platform%3B+%F0%9F%8C%8D+Multi-Language+%7C+Multi-Currency%3B+%E2%9C%A8+Next.js+16+%2B+Prisma+%2B+PostgreSQL)

[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](#)
[![Stars](https://img.shields.io/github/stars/ahmedhat/traveloo?style=flat-square&color=FFD700)](#)
[![Forks](https://img.shields.io/github/forks/ahmedhat/traveloo?style=flat-square)](#)

</div>

---

## Overview

Sharm Cloud Tours is a **single-vendor tour booking platform** built for tourism agencies in Sharm El-Sheikh, Egypt. It targets international tourists (English & Russian) and provides a full-featured admin dashboard for managing tours, bookings, reviews, and customer communication.

> Built with **Next.js 16**, **Prisma**, **PostgreSQL**, and **Tailwind CSS** — deployed with **Docker** and **Nginx** for under **$11/month**.

<div align="center">

![Hero Preview](public/images/previewer-images/1779740524960281560001-preview1.jpeg)

*Discover breathtaking underwater worlds and desert adventures in Sharm El-Sheikh*

</div>

---

## Features

<table>
<tr>
<td width="50%">

#### Tourist Experience
- **Tour Discovery** — Browse, search, and filter tours with a rich grid view
- **Multi-Language** — English & Russian with locale-prefixed URLs (`/en/`, `/ru/`)
- **Multi-Currency** — USD, EGP, RUB with live exchange rates
- **Booking System** — Date/guest selection with capacity checking & email confirmation
- **Reviews & Ratings** — Star ratings, comments, and admin replies
- **Wishlist** — Save favorite tours for later
- **Dark Mode** — True noir theme with one-click toggle
- **Real-time Messaging** — Chat directly with the agency
- **Responsive** — Mobile-first design that looks stunning everywhere

</td>
<td width="50%">

#### Admin Dashboard
- **Analytics Overview** — Pending bookings, confirmed tours, review stats
- **Tour Management** — Full CRUD with translations, image upload, itinerary editor
- **Booking Management** — Confirm, cancel, complete — or create bookings for users
- **Review Moderation** — Approve/reject with admin replies
- **User Management** — View users with online status indicators
- **Message Center** — Real-time chat with broadcast capability
- **Contact Settings** — Edit phone, WhatsApp, address with live preview
- **Image Management** — Preview and organize uploaded images

</td>
</tr>
</table>

---

## Tech Stack

<div align="center">

| Layer | Technology |
|:---:|:---|
| **Framework** | `Next.js 16` (App Router) + `React 19` |
| **Language** | `TypeScript 5` (strict mode) |
| **Styling** | `Tailwind CSS 4` + CSS custom properties |
| **Database** | `PostgreSQL 18` via Docker |
| **ORM** | `Prisma 5.22` |
| **Auth** | `NextAuth.js` (Google OAuth + Email/Password) |
| **Payments** | `Stripe` (feature-flagged) |
| **Email** | `Nodemailer` (Gmail SMTP) |
| **Validation** | `Zod 4` |
| **i18n** | `next-intl 4` |
| **Images** | `Cloudinary` |
| **Theme** | `next-themes` |
| **Container** | `Docker` + `Docker Compose` |
| **Reverse Proxy** | `Nginx` (SSL + gzip + caching) |
| **Package Manager** | `pnpm 11` |

</div>

---

## Architecture

```mermaid
graph TD
    subgraph Client["Client Layer"]
        A[Browser / Mobile]
    end

    subgraph Edge["Edge Layer"]
        B[Nginx Reverse Proxy<br/>SSL Termination + Rate Limiting]
    end

    subgraph App["Application Layer — Next.js 16"]
        C[Middleware<br/>i18n Routing + Auth Guard]
        D[App Router<br/>Server Components + API Routes]
        E[Service Layer<br/>Business Logic + Validation]
        F[Repository Layer<br/>Prisma Queries]
    end

    subgraph Data["Data Layer"]
        G[(PostgreSQL 18)]
    end

    subgraph External["External Services"]
        H[Cloudinary<br/>Image Storage]
        I[Stripe<br/>Payments]
        J[Gmail SMTP<br/>Email Notifications]
        K[Google OAuth]
    end

    A -->|HTTPS| B
    B -->|Proxy| C
    C --> D
    D --> E
    E --> F
    F --> G
    E --> H
    E --> I
    E --> J
    D --> K
```

---

## Quick Start

### Prerequisites

- [Node.js 24+](https://nodejs.org)
- [pnpm 11+](https://pnpm.io)
- [Docker & Docker Compose](https://docker.com) (for production)
- [PostgreSQL](https://postgresql.org) (for local dev)

### Local Development

```bash
# Clone the repository
git clone https://github.com/ahmedhat/traveloo.git
cd traveloo

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL, auth secrets, etc.

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Production (Docker)

```bash
# Clone and configure
git clone https://github.com/ahmedhat/traveloo.git
cd traveloo
cp .env.example .env.production
# Edit .env.production with production values

# Build and start all services
docker compose up -d --build

# Run database migrations
docker compose exec app npx prisma migrate deploy

# Set up admin user
docker compose exec app sh -c \
  'ADMIN_EMAIL=admin@yoursite.com ADMIN_PASSWORD=yourpassword npx tsx scripts/set-admin-password.ts'
```

The app will be available at `https://yourdomain.com`.

---

## Project Structure

<details>
<summary><strong>Click to expand full directory tree</strong></summary>

```
traveloo/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Root redirect
│   ├── globals.css                   # Tailwind + theme variables
│   ├── robots.ts                     # Dynamic robots.txt
│   ├── sitemap.ts                    # Dynamic sitemap
│   │
│   ├── [locale]/                     # Public routes (EN/RU)
│   │   ├── page.tsx                  # Home (hero, featured, reviews)
│   │   ├── tours/                    # Tour listing + detail pages
│   │   ├── booking/                  # Booking confirmation
│   │   ├── profile/                  # User profile + history
│   │   ├── messages/                 # User inbox
│   │   ├── wishlist/                 # Saved tours
│   │   ├── auth/                     # Sign in/up, email verify, reset
│   │   ├── about/                    # About page
│   │   ├── contact/                  # Contact page
│   │   ├── faq/                      # FAQ page
│   │   ├── privacy/                  # Privacy policy
│   │   └── terms/                    # Terms of service
│   │
│   ├── admin/                        # Admin dashboard (RBAC)
│   │   ├── page.tsx                  # Dashboard overview
│   │   ├── tours/                    # Tour CRUD
│   │   ├── bookings/                 # Booking management
│   │   ├── reviews/                  # Review moderation
│   │   ├── messages/                 # Message center
│   │   ├── users/                    # User management
│   │   ├── contact/                  # Contact settings
│   │   └── preview-images/           # Image management
│   │
│   └── api/                          # API route handlers
│       ├── auth/                     # Auth endpoints
│       ├── tours/                    # Tour endpoints
│       ├── bookings/                 # Booking endpoints
│       ├── reviews/                  # Review endpoints
│       ├── messages/                 # Message endpoints
│       ├── profile/                  # Profile endpoints
│       ├── currency/rates/           # Exchange rates
│       ├── notifications/            # Notifications
│       ├── health/                   # Health check
│       └── admin/                    # Admin-only endpoints
│
├── components/                       # Reusable UI components
│   ├── layout/                       # Navbar, Footer, AdminShell
│   ├── tours/                        # TourCard, TourGrid, Filters
│   ├── booking/                      # BookingWidget
│   ├── reviews/                      # ReviewCard, ReviewForm
│   ├── ui/                           # Dropdown, Select
│   └── Providers.tsx, ThemeToggle.tsx, LanguageSwitcher.tsx
│
├── services/                         # Business logic layer
├── repositories/                     # Prisma query layer
├── lib/                              # Utilities & config
│   ├── prisma.ts                     # Prisma client singleton
│   ├── auth.ts                       # NextAuth configuration
│   ├── password.ts                   # AES-256-GCM + PBKDF2
│   └── i18n/                         # Translations (EN/RU)
│
├── prisma/                           # Database schema & migrations
│   ├── schema.prisma                 # 7 models, 4 enums
│   └── migrations/
│
├── scripts/                          # Utility scripts
├── public/                           # Static assets
├── docs/                             # Project documentation
│   ├── PRD.md                        # Product Requirements
│   ├── FEATURES.md                   # Feature docs
│   ├── SECURITY.md                   # Security plan
│   ├── TESTING.md                    # Testing guidelines
│   └── DEPLOYMENT.md                 # Deployment guide
│
├── Dockerfile                        # Multi-stage build
├── docker-compose.yml                # 3-service orchestration
└── nginx/nginx.conf                  # Reverse proxy config
```

</details>

---

## Database Schema

<details>
<summary><strong>Click to expand ERD</strong></summary>

```mermaid
erDiagram
    USER ||--o{ BOOKING : makes
    USER ||--o{ REVIEW : writes
    USER ||--o{ WISHLIST : saves
    USER ||--o{ MESSAGE : sends
    USER ||--o{ NOTIFICATION : receives
    TOUR ||--o{ BOOKING : has
    TOUR ||--o{ REVIEW : has
    TOUR ||--o{ WISHLIST : saved_in

    USER {
        uuid id PK
        string email UK
        string name
        string password
        enum role USER_ADMIN
        datetime emailVerified
        datetime lastActiveAt
    }

    TOUR {
        uuid id PK
        string slug UK
        jsonb title
        jsonb description
        jsonb translations
        jsonb images
        jsonb itinerary
        decimal price
        int duration
        string category
        int maxCapacity
        boolean isActive
        boolean isFeatured
        boolean isBestseller
    }

    BOOKING {
        uuid id PK
        uuid userId FK
        uuid tourId FK
        date tourDate
        int people
        decimal totalPrice
        enum status PENDING_CONFIRMED_COMPLETED_CANCELLED
        string contactName
        string contactEmail
    }

    REVIEW {
        uuid id PK
        uuid userId FK
        uuid tourId FK
        int rating
        text comment
        enum status PENDING_APPROVED_REJECTED
        text adminReply
    }

    WISHLIST {
        uuid id PK
        uuid userId FK
        uuid tourId FK
    }

    MESSAGE {
        uuid id PK
        uuid userId FK
        string subject
        text content
        enum senderType USER_ADMIN
        boolean isRead
        uuid replyToId FK
    }

    NOTIFICATION {
        uuid id PK
        uuid userId FK
        enum type NEW_MESSAGE_MESSAGE_REPLY_BROADCAST
        string title
        text message
        boolean isRead
        jsonb data
    }
```

</details>

---

## Environment Variables

<details>
<summary><strong>Click to expand required environment variables</strong></summary>

```env
# ─── Database ───────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# ─── Authentication ─────────────────────────────────────
NEXTAUTH_SECRET="generate_with_openssl_rand_hex_32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ─── Stripe (optional) ──────────────────────────────────
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_ENABLED=false

# ─── Email ──────────────────────────────────────────────
GMAIL_EMAIL="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"
ADMIN_EMAIL="admin@yoursite.com"
ADMIN_SETUP_PASSWORD="secure-password"

# ─── App URLs ───────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# ─── Currency (fallback rates) ──────────────────────────
CURRENCY_EGP_RATE=52.93
CURRENCY_RUB_RATE=71.12

# ─── Cloudinary ─────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

</details>

---

## Deployment

### Docker Compose (Recommended)

```bash
# Start all 3 services: Nginx + App + PostgreSQL
docker compose up -d --build

# Run migrations
docker compose exec app npx prisma migrate deploy

# View logs
docker compose logs -f app
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| `nginx` | 80, 443 | Reverse proxy with SSL termination |
| `app` | 3000 (internal) | Next.js application |
| `postgres` | 5432 (internal) | PostgreSQL database |

> See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full deployment guide including Hetzner VPS + Cloudflare setup.

---

## Security

- **CSP / HSTS** security headers enforced at Nginx level
- **Rate limiting** — Login: 5 req/min/IP, Register: 3 req/hour/IP
- **Input validation** — All inputs validated with Zod before reaching business logic
- **Password hashing** — AES-256-GCM + PBKDF2 with 100K iterations
- **RBAC** — Admin routes protected by middleware role checks
- **Non-root Docker** — Container runs as unprivileged user

> See [docs/SECURITY.md](docs/SECURITY.md) for the full security plan.

---

## Documentation

| Document | Description |
|----------|-------------|
| [PRD.md](docs/PRD.md) | Product Requirements Document |
| [FEATURES.md](docs/FEATURES.md) | Detailed feature documentation |
| [SECURITY.md](docs/SECURITY.md) | Security architecture & plan |
| [TESTING.md](docs/TESTING.md) | Testing guidelines |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Docker + VPS deployment guide |
| [RESEND-INTEGRATION.md](docs/RESEND-INTEGRATION.md) | Resend email integration |

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:push` | Push schema to database |
| `pnpm db:migrate` | Run dev migrations |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm admin:create` | Set admin password |
| `pnpm db:cleanup` | Clean up unverified users |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

**Built with care for tourism agencies in Sharm El-Sheikh, Egypt**

<img src="public/favicon.svg" alt="Sharm Cloud Tours" width="48" height="48" style="filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.4));" />

</div>
