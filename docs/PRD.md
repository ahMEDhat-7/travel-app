# Sharm Cloud Tours — Sharm El-Sheikh Tours Platform

## Product Requirements Document v5.0

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Goals](#2-goals)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [Authentication](#6-authentication)
7. [Core Features](#7-core-features)
8. [Business Logic Rules](#8-business-logic-rules)
9. [API Contracts](#9-api-contracts)
10. [UI Design](#10-ui-design)
11. [Admin Dashboard](#11-admin-dashboard)
12. [Multi-language](#12-multi-language)
13. [SEO](#13-seo)
14. [Pages Structure](#14-pages-structure)
15. [Phased Roadmap](#15-phased-roadmap)

---

## 1. Product Overview

| Attribute    | Value                                                                           |
| ------------ | ------------------------------------------------------------------------------- |
| Product Name | Sharm Cloud Tours — Sharm El-Sheikh Tours Platform                               |
| Type         | Single-vendor booking platform                                                  |
| Target Users | International tourists + 1–2 admin staff                                        |
| Scale        | Small agency — tens of tours, hundreds of bookings/year                         |
| Languages    | English (default), Russian — extensible to any language without schema changes  |

---

## 2. Goals

**Business:** Get tours online, accept bookings without phone calls, reach Russian-speaking tourists.

**User:** Find a tour quickly, book it easily, know what they're paying.

---

## 3. Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Framework  | Next.js 16 (App Router)              |
| Styling    | Tailwind CSS 4 + custom CSS variables|
| Backend    | Next.js API Routes                   |
| ORM        | Prisma 5                             |
| Database   | PostgreSQL                           |
| Auth       | NextAuth.js — Google OAuth + Email/Password |
| i18n       | next-intl                            |
| Payments   | Stripe (feature-flagged)             |
| Email      | Nodemailer (Gmail SMTP)              |
| Validation | Zod 4                                |
| Theme      | next-themes                          |

---

## 4. Project Structure

```
sharm-cloud-tours/
├── app/                                    # Next.js App Router root
│   ├── [locale]/                           # Locale-prefixed public routes
│   │   ├── page.tsx                        # Home page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   ├── booking/
│   │   │   └── [id]/
│   │   │       └── page.tsx                # Booking confirmation
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── messages/
│   │   │   └── page.tsx                    # User inbox (auth required)
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx                    # Profile, booking history, reviews
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   ├── tours/
│   │   │   ├── page.tsx                    # Tours listing + filters
│   │   │   └── [id]/
│   │   │       └── page.tsx                # Tour detail
│   │   ├── wishlist/
│   │   │   └── page.tsx
│   │   ├── layout.tsx                      # Locale layout with Providers
│   │   └── loading.tsx
│   │
│   ├── admin/                              # Admin dashboard (no locale prefix)
│   │   ├── layout.tsx                      # Admin shell (sidebar + topbar)
│   │   ├── page.tsx                        # Dashboard overview — stats, quick actions
│   │   ├── bookings/
│   │   │   └── page.tsx                    # Full CRUD with modals
│   │   ├── contact/
│   │   │   └── page.tsx                    # Edit phone, WhatsApp, address
│   │   ├── messages/
│   │   │   └── page.tsx                    # Real-time chat (5s polling)
│   │   ├── reviews/
│   │   │   └── page.tsx                    # Approve/reject/reply queue
│   │   ├── tours/
│   │   │   └── page.tsx                    # Full CRUD with modals (no separate new/edit pages)
│   │   └── users/
│   │       └── page.tsx                    # User grid with online status
│   │
│   ├── api/                                # API route handlers — thin, no business logic
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   ├── verify-email/
│   │   │   │   └── route.ts
│   │   │   ├── resend-verification/
│   │   │   │   └── route.ts
│   │   │   ├── forgot-password/
│   │   │   │   └── route.ts
│   │   │   └── reset-password/
│   │   │       └── route.ts
│   │   ├── tours/
│   │   │   ├── route.ts                    # GET (list, filter, sort, paginate)
│   │   │   └── id/
│   │   │       └── [id]/
│   │   │           └── route.ts            # GET by ID
│   │   ├── bookings/
│   │   │   ├── route.ts                    # GET (user), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts                # GET by ID
│   │   ├── reviews/
│   │   │   └── route.ts                    # GET, POST
│   │   ├── messages/
│   │   │   ├── route.ts                    # GET, POST
│   │   │   └── [id]/
│   │   │       └── route.ts                # GET single, mark read
│   │   ├── profile/
│   │   │   ├── route.ts                    # GET, PUT
│   │   │   ├── bookings/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── reviews/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── heartbeat/
│   │   │       └── route.ts                # Online status (every 2 min)
│   │   ├── contact/
│   │   │   └── route.ts                    # GET (admin info), POST (submit)
│   │   ├── currency/
│   │   │   └── rates/
│   │   │       └── route.ts                # Live exchange rates (cached)
│   │   ├── languages/
│   │   │   └── route.ts                    # Dynamically detected languages
│   │   ├── notifications/
│   │   │   └── route.ts                    # GET user notifications
│   │   ├── payments/
│   │   │   ├── create-intent/
│   │   │   │   └── route.ts                # Stripe payment intent
│   │   │   └── webhook/
│   │   │       └── route.ts                # Stripe webhook handler
│   │   ├── stats/
│   │   │   └── route.ts                    # Tours, bookings, destinations count
│   │   └── admin/
│   │       ├── tours/
│   │       │   └── route.ts                # POST, PUT, DELETE, PATCH
│   │       ├── bookings/
│   │       │   └── route.ts                # GET, POST, PATCH, DELETE
│   │       ├── reviews/
│   │       │   └── route.ts                # GET, POST, PATCH, DELETE
│   │       ├── stats/
│   │       │   └── route.ts                # Dashboard statistics
│   │       ├── users/
│   │       │   └── route.ts                # User management
│   │       ├── messages/
│   │       │   ├── route.ts                # GET conversations
│   │       │   └── [id]/
│   │       │       └── route.ts            # POST reply
│   │       ├── broadcast/
│   │       │   └── route.ts                # Send broadcast notifications
│   │       ├── upload/
│   │       │   └── route.ts                # Image/file upload
│   │       ├── set-password/
│   │       │   └── route.ts                # Admin password set
│   │       └── setup/
│   │           └── route.ts                # Initial admin setup
│   │
│   ├── globals.css                          # Tailwind + CSS custom properties + theme vars
│   ├── layout.tsx                           # Root layout (minimal)
│   ├── page.tsx                             # Root page (redirects to /[locale])
│   ├── loading.tsx                          # Global loading state
│   ├── robots.ts                            # Dynamic robots.txt
│   └── sitemap.ts                           # Dynamic sitemap from active tours
│
├── components/                              # Reusable UI — no business logic
│   ├── layout/
│   │   ├── Navbar.tsx                        # Responsive, theme toggle, lang/currency selectors
│   │   ├── Footer.tsx                        # 4-column, dynamic contact info
│   │   ├── AdminShell.tsx                    # Sidebar + topbar layout
│   │   └── FooterController.tsx
│   ├── tours/
│   │   ├── TourCard.tsx
│   │   ├── TourGrid.tsx
│   │   ├── TourFilters.tsx
│   │   ├── TourBadge.tsx
│   │   ├── ItineraryAccordion.tsx
│   │   └── TourJsonLd.tsx
│   ├── booking/
│   │   ├── BookingWidget.tsx
│   │   └── PriceBreakdown.tsx
│   ├── reviews/
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewForm.tsx
│   │   └── RatingBreakdown.tsx
│   ├── search/
│   │   └── SearchBar.tsx
│   ├── ui/
│   │   ├── Dropdown.tsx
│   │   └── Select.tsx
│   ├── AdminProviders.tsx
│   ├── Providers.tsx                          # Session, Theme, Currency, Notification providers
│   ├── CustomThemeProvider.tsx
│   ├── ThemeToggle.tsx
│   ├── LanguageSwitcher.tsx                   # Dynamic language dropdown
│   ├── CurrencySelector.tsx                   # USD/EGP/RUB
│   ├── ImagePreviewer.tsx                     # Hero image carousel
│   ├── ScrollButton.tsx
│   ├── MessageBadge.tsx                       # Unread count (polls)
│   └── Notification.tsx
│
├── contexts/
│   └── CurrencyContext.tsx                    # Currency state, rates, converter
│
├── services/                                  # All business logic — called by API routes only
│   ├── tour.service.ts                        # List, get, search, localize tours
│   └── booking.service.ts                     # Capacity check, price calc, create booking
│
├── repositories/                              # Prisma queries only — no logic
│   ├── tour.repository.ts
│   ├── booking.repository.ts
│   ├── review.repository.ts
│   └── wishlist.repository.ts
│
├── lib/                                       # Pure utilities and config — no side effects
│   ├── prisma.ts                              # Prisma client singleton
│   ├── db.ts                                  # Re-exported db from Prisma
│   ├── auth.ts                                # NextAuth config (Google + Credentials)
│   ├── email.ts                               # Email templates
│   ├── mail.ts                                # Nodemailer transport
│   ├── token.ts                               # Token generation
│   ├── password.ts                            # AES-256-GCM + PBKDF2 hashing
│   ├── currency.ts                            # Currency definitions
│   ├── flags.ts                               # Feature flags (Stripe, Email)
│   ├── constants.ts                           # App-wide constants
│   ├── validation.ts                          # Zod schemas + sanitization
│   ├── rate-limit.ts                          # In-memory rate limiter
│   ├── api-rate-limit.ts                      # NextRequest rate limit middleware
│   ├── admin-auth.ts                          # Admin auth guard helper
│   ├── secure-logger.ts
│   ├── i18n/
│   │   ├── config.ts                          # Locale config
│   │   ├── routing.ts
│   │   ├── en.json / en.ts                    # English UI strings
│   │   └── ru.json / ru.ts                    # Russian UI strings
│   └── utils/                                 # (reserved for future helpers)
│
├── i18n/                                      # next-intl routing config
│   ├── request.ts
│   └── routing.ts
│
├── types/                                     # TypeScript types
│   ├── tour.types.ts
│   ├── booking.types.ts
│   ├── review.types.ts
│   ├── api.types.ts                           # Standard API response envelope
│   └── next-auth.d.ts                         # Session augmentation
│
├── prisma/
│   ├── schema.prisma                          # Database schema (7 models)
│   ├── migrations/
│   └── seed.ts
│
├── scripts/
│   ├── seed-tours.ts
│   ├── create-admin.ts
│   ├── set-admin-password.ts / .js
│   └── cleanup-unverified.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local                                 # Local env vars (gitignored)
├── .env.example                               # Template for required env vars
├── proxy.ts                                   # next-intl middleware — locale detection + admin guard
├── next.config.ts                             # i18n, security headers
└── tsconfig.json                              # strict: true
```

### Architecture Rules

| Rule                               | Detail                                                      |
| ---------------------------------- | ----------------------------------------------------------- |
| No logic in API routes             | Handlers only call service functions and return responses   |
| Prisma only in `/repositories`     | Services call repositories, never Prisma directly           |
| Server Components by default       | Add `"use client"` only when interactivity is required      |
| All inputs validated with Zod      | Validated in API route before reaching service layer        |
| Locale-aware rendering in services | Services accept `locale` param and resolve translations     |

---

## 5. Database Schema

> **Design principle:** 7 tables, flat and simple. The `translations` column on `Tour` uses a language-keyed JSON map. Adding a new language (French, German, Arabic…) requires zero schema changes — just add a new key to the JSON.

---

### 5.1 User

| Field                     | Type     | Notes                   |
| ------------------------- | -------- | ----------------------- |
| id                        | String   | UUID, primary key       |
| email                     | String   | Unique                  |
| name                      | String   |                         |
| image                     | String?  | Avatar from Google      |
| password                  | String?  | Hashed (AES-256-GCM + PBKDF2), nullable for Google users |
| role                      | Enum     | `USER` \| `ADMIN`       |
| emailVerified             | Boolean  | `false` by default      |
| verificationToken         | String?  | Email verification      |
| verificationTokenExpiry   | DateTime?|                         |
| resetToken                | String?  | Password reset          |
| resetTokenExpiry          | DateTime?|                         |
| phone                     | String?  |                         |
| whatsapp                  | String?  |                         |
| address                   | String?  |                         |
| lastActiveAt              | DateTime?| Online status tracking  |
| createdAt                 | DateTime |                         |

**Relations:** Booking[], Review[], Wishlist[], Message[], Notification[]

---

### 5.2 Tour

| Field               | Type      | Notes                                                |
| ------------------- | --------- | ---------------------------------------------------- |
| id                  | String    | UUID, primary key                                    |
| slug                | String    | Unique, used in URLs                                 |
| title               | String    | English title (canonical)                            |
| shortDesc           | String    | English short description                            |
| description         | String    | English full description (Markdown)                  |
| highlights          | String[]  | English bullet points                                |
| included            | String[]  | What's included                                      |
| notIncluded         | String[]  | What's not included                                  |
| itinerary           | Json?     | Day-by-day schedule                                  |
| translations        | Json      | Language-keyed translation map                       |
| price               | Float     | Price per person (USD)                               |
| childPrice          | Float?    | Child price — falls back to `price` if null          |
| discountPrice       | Float?    | Sale price if active                                 |
| duration            | String    | e.g. `"3 days"`, `"Full day"`                        |
| location            | String    | e.g. `"Luxor"`, `"Cairo"`                            |
| category            | String    | e.g. `"Historical"`, `"Adventure"`                   |
| images              | String[]  | Array of image URLs                                  |
| maxCapacity         | Int       | Max people per booking date                          |
| isActive            | Boolean   | Hide/show tour without deleting                      |
| isFeatured          | Boolean   | Show on home page                                    |
| isBestseller        | Boolean   | Bestseller badge                                     |
| hasFreeCancellation | Boolean   | Free cancellation badge                              |
| createdAt           | DateTime  |                                                      |
| updatedAt           | DateTime  |                                                      |

**Relations:** Booking[], Review[], Wishlist[]

---

### 5.3 Booking

| Field        | Type          | Notes                                     |
| ------------ | ------------- | ----------------------------------------- |
| id           | String        | UUID, primary key                         |
| userId       | String?       | FK → User (nullable for guest bookings)   |
| tourId       | String        | FK → Tour                                 |
| tourDate     | DateTime      | Selected tour date                        |
| people       | Int           | Total number of people (min 1)            |
| totalPrice   | Float         | Calculated at booking time and stored     |
| status       | Enum          | `PENDING` \| `CONFIRMED` \| `COMPLETED` \| `CANCELLED` |
| contactName  | String        |                                           |
| contactEmail | String        |                                           |
| contactPhone | String        |                                           |
| notes        | String?       | Special requests                          |
| createdAt    | DateTime      |                                           |
| updatedAt    | DateTime      |                                           |

**Relations:** User?, Tour

---

### 5.4 Review

| Field      | Type         | Notes                                   |
| ---------- | ------------ | --------------------------------------- |
| id         | String       | UUID, primary key                       |
| userId     | String?      | FK → User                               |
| tourId     | String       | FK → Tour                               |
| rating     | Int          | 1–5                                     |
| comment    | String       |                                         |
| status     | Enum         | `PENDING` \| `APPROVED` \| `REJECTED`   |
| adminReply | String?      |                                         |
| createdAt  | DateTime     |                                         |

**Relations:** User?, Tour

---

### 5.5 Wishlist

| Field     | Type     | Notes              |
| --------- | -------- | ------------------ |
| id        | String   | UUID, primary key  |
| userId    | String   | FK → User          |
| tourId    | String   | FK → Tour          |
| createdAt | DateTime |                    |

**Constraint:** `UNIQUE(userId, tourId)`
**Relations:** User, Tour

---

### 5.6 Message

| Field        | Type       | Notes                                  |
| ------------ | ---------- | -------------------------------------- |
| id           | String     | UUID, primary key                      |
| userId       | String     | FK → User                              |
| subject      | String?    | Optional subject line                  |
| content      | String     | Message body                           |
| senderType   | Enum       | `USER` \| `ADMIN`                      |
| isRead       | Boolean    | Read by user?                          |
| isReadByAdmin| Boolean    | Read by admin?                         |
| replyToId    | String?    | Self-referential FK for threaded replies |
| createdAt    | DateTime   |                                        |
| updatedAt    | DateTime   |                                        |

**Relations:** User, Message[] (replies)

---

### 5.7 Notification

| Field     | Type             | Notes                                  |
| --------- | ---------------- | -------------------------------------- |
| id        | String           | UUID, primary key                      |
| userId    | String           | FK → User                              |
| type      | Enum             | `NEW_MESSAGE` \| `MESSAGE_REPLY` \| `BROADCAST` |
| title     | String           |                                        |
| message   | String           |                                        |
| isRead    | Boolean          | `false` by default                     |
| data      | Json?            | Optional payload                       |
| createdAt | DateTime         |                                        |

**Relations:** User

---

## 6. Authentication

- **Dual auth** via NextAuth.js: Google OAuth + Email/Password
- Credentials provider with secure password hashing (AES-256-GCM + PBKDF2, 100K iterations)
- `User` record auto-created on first login with `role: USER`
- Email verification required for both signup methods
- Password reset flow via email tokens
- First admin created via `prisma/seed.ts`
- **Rate limiting:** Login 5 req/min/IP, Register 3 req/hour/IP
- Admin routes protected by server-side session check + role guard (`role === ADMIN`)

---

## 7. Core Features

### 7.1 Tours

- Grid listing with search, filters, and sort
- Tour detail page: images, description, highlights, included/not-included, itinerary accordion
- Badges: Bestseller, Free Cancellation, Featured
- Locale-resolved content via `Tour.translations[locale]` with EN fallback

**Filters:** category, location, price range, duration
**Sort:** price asc/desc, rating, popularity (review count)

---

### 7.2 Booking

**Flow:**

1. User picks a date and number of people on the tour detail page
2. Auth gate — prompt login if not authenticated
3. System checks capacity: aggregate `SUM(people)` for same `tourId + tourDate` where `status IN (PENDING, CONFIRMED)` vs `tour.maxCapacity`
4. User reviews price breakdown and fills contact form
5. User submits → Booking created as `PENDING`
6. Admin notified via email
7. Admin confirms or cancels from dashboard

**Price:**

```
totalPrice = people × tour.price
```

---

### 7.3 Reviews

- Any logged-in user can submit a review for any tour
- Admin approves or rejects before it becomes publicly visible
- Admin can reply to any approved review
- Star rating 1–5 + text comment

---

### 7.4 Wishlist

- Add/remove tours; `UNIQUE(userId, tourId)` prevents duplicates
- Wishlist page visible to authenticated users only

---

### 7.5 Messaging

- Users can send messages to admin from their inbox
- Admin can reply with threaded conversation support
- Admin broadcast messaging to all users
- Unread tracking for both user and admin sides
- Real-time polling (5s) for new messages

---

### 7.6 Notifications

- In-app notification system for: new messages, message replies, admin broadcasts
- Toast-style notification display
- Read/unread tracking

---

### 7.7 Currency Conversion

- Three supported currencies: USD, EGP, RUB
- Live exchange rates fetched from `/api/currency/rates` (with caching, multiple source fallback)
- Currency selector in navbar
- Auto-detection based on locale (RU → RUB, EN → USD)
- Preference stored in `localStorage`

---

### 7.8 Payments (Stripe)

- Feature-flagged Stripe integration
- `/api/payments/create-intent` — creates PaymentIntent
- `/api/payments/webhook` — handles Stripe webhooks

---

### 7.9 User Profile

- View and edit personal info (name, email, phone)
- Booking history with status tracking
- Manage submitted reviews
- Online status tracking (heartbeat every 2 minutes)

---

## 8. Business Logic Rules

| #   | Rule                                        | Enforcement                                         |
| --- | ------------------------------------------- | --------------------------------------------------- |
| 1   | Cannot exceed `maxCapacity` per date        | Aggregate query in booking repository before insert |
| 2   | `totalPrice = people × price`               | Calculated in booking service, stored on Booking    |
| 3   | `childPrice` defaults to `price` if null    | Service-level fallback                              |
| 4   | Only approved reviews shown publicly        | `status: APPROVED` filter in review repository      |
| 5   | One wishlist entry per user per tour        | DB `UNIQUE(userId, tourId)`                         |
| 6   | Only active tours shown to tourists         | `isActive: true` filter in tour repository          |
| 7   | Adding a new language requires no migration | New key added to `Tour.translations` JSON only      |

---

## 9. API Contracts

### Standard Response Envelope

```ts
{ success: boolean; data?: any; error?: string; }
```

### Public Endpoints

| Method | Path                              | Description                      |
| ------ | --------------------------------- | -------------------------------- |
| GET    | /api/tours                        | List tours (filter, sort, page)  |
| GET    | /api/tours/id/[id]                | Get tour by ID                   |
| POST   | /api/auth/register                | Email/password registration      |
| POST   | /api/auth/login                   | Email/password login             |
| POST   | /api/auth/verify-email            | Verify email with token          |
| POST   | /api/auth/resend-verification     | Resend verification code         |
| POST   | /api/auth/forgot-password         | Request password reset           |
| POST   | /api/auth/reset-password          | Reset password with token        |
| GET    | /api/bookings                     | User's bookings                  |
| GET    | /api/bookings/[id]                | Booking details                  |
| POST   | /api/bookings                     | Create booking                   |
| GET    | /api/reviews                      | Approved reviews                 |
| POST   | /api/reviews                      | Submit review                    |
| GET    | /api/messages                     | User messages                    |
| POST   | /api/messages                     | Send message                     |
| GET    | /api/messages/[id]                | Message thread                   |
| GET    | /api/profile                      | Get profile                      |
| PUT    | /api/profile                      | Update profile                   |
| GET    | /api/profile/bookings             | User booking history             |
| GET    | /api/profile/bookings/[id]        | Booking detail                   |
| GET    | /api/profile/reviews              | User reviews                     |
| POST   | /api/profile/reviews              | Submit review                    |
| PATCH  | /api/profile/reviews/[id]         | Edit review                      |
| POST   | /api/profile/heartbeat            | Online status ping                |
| GET    | /api/contact                      | Admin contact info               |
| POST   | /api/contact                      | Submit contact form              |
| GET    | /api/currency/rates               | Live exchange rates              |
| GET    | /api/languages                    | Supported languages              |
| GET    | /api/notifications                | User notifications               |
| GET    | /api/stats                        | Platform statistics              |
| POST   | /api/payments/create-intent       | Stripe PaymentIntent             |
| POST   | /api/payments/webhook             | Stripe webhook                   |

### Admin Endpoints (ADMIN role required)

| Method | Path                           | Description                  |
| ------ | ------------------------------ | ---------------------------- |
| GET    | /api/admin/tours               | List all tours               |
| POST   | /api/admin/tours               | Create tour                  |
| PATCH  | /api/admin/tours               | Toggle tour flags            |
| PUT    | /api/admin/tours               | Update tour                  |
| DELETE | /api/admin/tours               | Delete tour                  |
| GET    | /api/admin/bookings            | List all bookings            |
| POST   | /api/admin/bookings            | Create booking on behalf     |
| PATCH  | /api/admin/bookings            | Update booking status        |
| DELETE | /api/admin/bookings            | Delete booking               |
| GET    | /api/admin/reviews             | List all reviews             |
| POST   | /api/admin/reviews             | Create review                |
| PATCH  | /api/admin/reviews             | Update review status/reply   |
| DELETE | /api/admin/reviews             | Delete review                |
| GET    | /api/admin/stats               | Dashboard statistics         |
| GET    | /api/admin/users               | User management              |
| GET    | /api/admin/messages            | Conversations list           |
| POST   | /api/admin/messages/[id]       | Reply to message             |
| POST   | /api/admin/broadcast           | Send broadcast notification  |
| POST   | /api/admin/upload              | Image/file upload            |
| POST   | /api/admin/set-password        | Set admin password           |
| GET    | /api/admin/setup               | Initial admin setup          |

---

## 10. UI Design

### Key Components

| Component            | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| `Navbar`             | Logo, nav links, language switcher, currency selector, theme toggle, login/avatar, wishlist icon, messages badge |
| `TourCard`           | Image, title, location, price, average rating, badges                 |
| `TourFilters`        | Sidebar filters: category, location, price slider, duration           |
| `BookingWidget`      | Sticky sidebar: date picker, people counter, price total, book button |
| `PriceBreakdown`     | Itemized cost display below booking widget                            |
| `ItineraryAccordion` | Collapsible day-by-day itinerary on tour detail                       |
| `ReviewCard`         | Stars, comment text, admin reply block                                |
| `RatingBreakdown`    | 5★→1★ bar chart on tour detail                                        |
| `SearchBar`          | Global search with autocomplete                                       |
| `LanguageSwitcher`   | Dropdown with dynamically fetched languages                           |
| `CurrencySelector`   | USD/EGP/RUB dropdown with live rates                                  |
| `ImagePreviewer`     | Auto-rotating hero image carousel                                     |
| `ThemeToggle`        | Sun/moon icon for dark/light mode                                     |
| `Toast/Notification` | Success/error/in-app notifications                                    |
| `AdminShell`         | Sidebar + topbar admin layout, responsive                             |
| `MessageBadge`       | Polling unread message count badge                                    |

### Theme

| Token   | Value     |
| ------- | --------- |
| Primary | `#0EA5E9` |
| Accent  | `#F59E0B` |

---

## 11. Admin Dashboard

| Page                | Description                                                                         |
| ------------------- | ----------------------------------------------------------------------------------- |
| `/admin`            | Overview: stats cards (pending bookings, confirmed, active tours, pending reviews), quick actions, system status |
| `/admin/tours`      | Full CRUD with modals; filter/search; inline toggle for featured/bestseller/active; image upload; itinerary editor; Russian translations |
| `/admin/bookings`   | List with search/filter by status; create/edit/view modals; confirm/cancel/completed actions; status-based email notifications |
| `/admin/reviews`    | List with search/filter; approve/reject actions; inline admin reply; delete         |
| `/admin/messages`   | Real-time (5s polling) chat interface; conversations list; reply system; broadcast  |
| `/admin/users`      | Grid view with online status indicators; booking/review counts; last active time    |
| `/admin/contact`    | Edit phone, WhatsApp, address with live preview                                     |

---

## 12. Multi-language

| Item              | Approach                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| URL routing       | `/[locale]/*` via `next-intl` middleware — e.g. `/en/tours`, `/ru/tours`                         |
| Root `/`          | Middleware redirects to `/en` or detected locale from `Accept-Language` header                   |
| Supported locales | `en`, `ru` — defined in `lib/constants.ts`                                                        |
| Tour content      | Resolved from `Tour.translations[locale]` with EN fallback                                       |
| UI strings        | JSON files: `lib/i18n/en.json`, `lib/i18n/ru.json` — namespaced by feature                      |
| New language      | Add locale to `SUPPORTED_LOCALES`, add UI strings JSON, fill `translations` in admin             |

---

## 13. SEO

| Feature          | Implementation                                                            |
| ---------------- | ------------------------------------------------------------------------- |
| Meta title       | `tour.title` (locale-resolved)                                            |
| Meta description | `tour.shortDesc` (locale-resolved)                                        |
| Open Graph       | Tour images                                                               |
| JSON-LD          | `TourActivity` + `Organization` structured data on detail pages          |
| Sitemap          | Auto-generated from all `isActive: true` tours across supported locales   |
| robots.txt       | Generated dynamically; allow `/[locale]/*`; disallow `/admin/*`           |

---

## 14. Pages Structure

### Public

| Path                               | Page                                          |
| ---------------------------------- | --------------------------------------------- |
| `/`                                | Redirect to `/[locale]`                       |
| `/[locale]`                        | Home: hero carousel, search bar, featured tours grid, reviews carousel |
| `/[locale]/tours`                  | Tours listing + filter sidebar                |
| `/[locale]/tours/[id]`             | Tour detail + booking widget                  |
| `/[locale]/wishlist`               | Wishlist (auth required)                      |
| `/[locale]/booking/[id]`           | Booking confirmation                          |
| `/[locale]/profile`                | Profile, booking history, user reviews        |
| `/[locale]/messages`               | User inbox (auth required)                    |
| `/[locale]/auth/signin`            | Sign in page                                  |
| `/[locale]/auth/signup`            | Sign up page                                  |
| `/[locale]/auth/verify-email`      | Email verification                            |
| `/[locale]/auth/forgot-password`   | Password reset request                        |
| `/[locale]/auth/reset-password`    | Password reset form                           |
| `/[locale]/about`                  | About page                                    |
| `/[locale]/contact`                | Contact page with form                        |
| `/[locale]/faq`                    | FAQ page                                      |
| `/[locale]/privacy`                | Privacy policy                                |
| `/[locale]/terms`                  | Terms of service                              |

### Admin

| Path                | Page                |
| ------------------- | ------------------- |
| `/admin`            | Dashboard overview  |
| `/admin/tours`      | Tours CRUD          |
| `/admin/bookings`   | Bookings management |
| `/admin/reviews`    | Reviews management  |
| `/admin/messages`   | Messaging inbox     |
| `/admin/users`      | User management     |
| `/admin/contact`    | Contact settings    |

---

## 15. Phased Roadmap

### Completed ✓

| Phase | Description                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------- |
| 1     | Project setup: Next.js 16, Tailwind 4, ESLint, folder structure, `.env` template                 |
| 2     | Database: Prisma schema (7 models), migration, seed scripts                                       |
| 3     | i18n routing: `next-intl` with `[locale]` dynamic segment, middleware redirect                    |
| 4     | Auth: Google OAuth + Email/Password (NextAuth.js), email verification, password reset, rate limiting |
| 5     | Core public pages: Home, Tours listing, Tour detail (locale-resolved content)                     |
| 6     | Booking: widget, capacity check, CRUD API, email notification to admin                           |
| 7     | Reviews: submit form, admin approve/reject/reply                                                  |
| 8     | Wishlist: add/remove, wishlist page                                                               |
| 9     | Admin dashboard: tours CRUD (with translations), bookings, reviews, messages, users, contact      |
| 10    | SEO: meta tags, JSON-LD, dynamic sitemap, robots.txt                                              |
| 11    | Messaging system: user↔admin threaded conversations, admin broadcast                              |
| 12    | Notification system: in-app notifications with read/unread tracking                               |
| 13    | Currency conversion: USD/EGP/RUB with live exchange rates                                        |
| 14    | Stripe payment integration (feature-flagged)                                                      |
| 15    | User profile: profile mgmt, booking history, review management, online status tracking            |
| 16    | Security: CSP/HSTS headers, rate limiting, input validation, password hashing                     |
| 17    | Polish: responsive design, dark/light theme, mobile audit                                         |
| 18    | Deploy: Vercel + production PostgreSQL, env vars                                                 |

### Future

| Phase | Description                                      | Priority |
| ----- | ------------------------------------------------ | -------- |
| 19    | Arabic language support                          | Medium   |
| 20    | WhatsApp notification integration                | Medium   |
| 21    | Coupon/discount code system                      | Low      |
| 22    | Group booking and private tour options           | Low      |
| 23    | Advanced analytics and reporting                 | Low      |
| 24    | Automated review reminders after tour date       | Low      |

---

_Sharm Cloud Tours PRD v5.0 — May 2026_
