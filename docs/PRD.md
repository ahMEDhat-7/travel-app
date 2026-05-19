# Sharm Cloud Tours — Sharm El-Sheikh Tours Platform

## Product Requirements Document v4.0

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

| Attribute    | Value                                                                          |
| ------------ | ------------------------------------------------------------------------------ |
| Product Name | Sharm Cloud Tours — Sharm El-Sheikh Tours Platform                              |
| Type         | Single-vendor booking platform                                                 |
| Target Users | International tourists + 1–2 admin staff                                       |
| Scale        | Small agency — tens of tours, hundreds of bookings/year                        |
| Languages    | English (default), Russian — extensible to any language without schema changes |

---

## 2. Goals

**Business:** Get tours online, accept bookings without phone calls, reach Russian-speaking tourists.

**User:** Find a tour quickly, book it easily, know what they're paying.

---

## 3. Tech Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Framework  | Next.js 16 (App Router)     |
| Styling    | Tailwind CSS + shadcn/ui    |
| Backend    | Next.js API Routes          |
| ORM        | Prisma                      |
| Database   | PostgreSQL                  |
| Auth       | Auth.js — Google OAuth only |
| Validation | Zod                         |

---

## 4. Project Structure

```
sharm-cloud-tours/
├── app/                                  # Next.js App Router root
│   ├── [locale]/                         # Locale-prefixed public routes (en, ru, ...)
│   │   ├── page.tsx                      # Home page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── tours/
│   │   │   ├── page.tsx                  # Tours listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # Tour detail
│   │   ├── wishlist/
│   │   │   └── page.tsx
│   │   └── booking/
│   │       └── [id]/
│   │           └── page.tsx              # Booking confirmation
│   │
│   ├── admin/                            # Admin pages (no locale prefix)
│   │   ├── layout.tsx                    # Admin shell: sidebar + topbar
│   │   ├── page.tsx                      # Dashboard overview
│   │   ├── tours/
│   │   │   ├── page.tsx                  # Tours list
│   │   │   ├── new/
│   │   │   │   └── page.tsx              # Create tour
│   │   │   └── [id]/
│   │   │       └── page.tsx              # Edit tour
│   │   ├── bookings/
│   │   │   └── page.tsx                  # Bookings management
│   │   └── reviews/
│   │       └── page.tsx                  # Reviews management
│   │
│   ├── api/                              # API route handlers — no business logic here
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts              # Auth.js handler
│   │   ├── tours/
│   │   │   ├── route.ts                  # GET /api/tours
│   │   │   └── [slug]/
│   │   │       ├── route.ts              # GET /api/tours/[slug]
│   │   │       └── reviews/
│   │   │           └── route.ts          # GET /api/tours/[slug]/reviews
│   │   ├── bookings/
│   │   │   └── route.ts                  # GET, POST /api/bookings
│   │   ├── reviews/
│   │   │   └── route.ts                  # POST /api/reviews
│   │   ├── wishlist/
│   │   │   ├── route.ts                  # GET, POST /api/wishlist
│   │   │   └── [tourId]/
│   │   │       └── route.ts              # DELETE /api/wishlist/[tourId]
│   │   └── admin/
│   │       ├── tours/
│   │       │   ├── route.ts              # POST /api/admin/tours
│   │       │   └── [id]/
│   │       │       └── route.ts          # PUT, DELETE /api/admin/tours/[id]
│   │       ├── bookings/
│   │       │   └── [id]/
│   │       │       └── route.ts          # PATCH /api/admin/bookings/[id]
│   │       └── reviews/
│   │           └── [id]/
│   │               └── route.ts          # PATCH /api/admin/reviews/[id]
│   │
│   ├── layout.tsx                        # Root layout
│   └── middleware.ts                     # Locale redirect + admin auth guard
│
├── components/                           # Reusable UI — no business logic
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── AdminTopbar.tsx
│   ├── tours/
│   │   ├── TourCard.tsx
│   │   ├── TourGrid.tsx
│   │   ├── TourFilters.tsx
│   │   ├── TourBadge.tsx
│   │   └── ItineraryAccordion.tsx
│   ├── booking/
│   │   ├── BookingWidget.tsx             # Sticky sidebar widget
│   │   └── PriceBreakdown.tsx
│   ├── reviews/
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewForm.tsx
│   │   └── RatingBreakdown.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   └── SearchAutocomplete.tsx
│   └── ui/                              # shadcn/ui re-exports and custom primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── DatePicker.tsx
│       ├── Skeleton.tsx
│       └── Toast.tsx
│
├── services/                            # All business logic — called by API routes only
│   ├── tour.service.ts                  # List, get, search tours; apply locale
│   ├── booking.service.ts               # Capacity check, price calc, create booking
│   ├── review.service.ts                # Submit, approve, reject, reply
│   └── wishlist.service.ts              # Add, remove, list wishlist
│
├── repositories/                        # Prisma queries only — no logic
│   ├── tour.repository.ts
│   ├── booking.repository.ts
│   ├── review.repository.ts
│   └── wishlist.repository.ts
│
├── lib/                                 # Pure utilities and config — no side effects
│   ├── prisma.ts                        # Prisma client singleton
│   ├── auth.ts                          # Auth.js config
│   ├── i18n/
│   │   ├── config.ts                    # Supported locales list, defaultLocale
│   │   ├── en.ts                        # English UI strings
│   │   └── ru.ts                        # Russian UI strings
│   ├── utils/
│   │   ├── slug.ts                      # Slug generation helper
│   │   ├── price.ts                     # Price formatting helper
│   │   └── date.ts                      # Date formatting helper
│   └── constants.ts                     # App-wide constants (BOOKING_CUTOFF_HOURS, etc.)
│
├── types/                               # TypeScript types and interfaces
│   ├── tour.types.ts
│   ├── booking.types.ts
│   ├── review.types.ts
│   └── api.types.ts                     # Standard API response types
│
├── prisma/
│   ├── schema.prisma                    # Database schema
│   ├── migrations/                      # Auto-generated migration files
│   └── seed.ts                          # Seed: first admin user + sample tours
│
├── public/                              # Static assets
│   ├── images/
│   └── icons/
│
├── .env.local                           # Local environment variables (gitignored)
├── .env.example                         # Template for required env vars
├── next.config.ts                       # Next.js config — locale routing
├── tailwind.config.ts
├── tsconfig.json                        # strict: true
└── proxy.ts                        # Root middleware — locale detection + admin guard
```

### Architecture Rules

| Rule                               | Detail                                                    |
| ---------------------------------- | --------------------------------------------------------- |
| No logic in API routes             | Handlers only call service functions and return responses |
| Prisma only in `/repositories`     | Services call repositories, never Prisma directly         |
| Server Components by default       | Add `"use client"` only when interactivity is required    |
| All inputs validated with Zod      | Validated in API route before reaching service layer      |
| Locale-aware rendering in services | Services accept a `locale` param and resolve translations |

---

## 5. Database Schema

> **Design principle:** 5 tables, flat and simple. The only non-obvious choice is the `translations` column on `Tour` — a language-keyed JSON map. Adding a new language (French, German, Arabic…) requires zero schema changes — just add a new key to the JSON.

---

### 5.1 User

| Field     | Type     | Notes              |
| --------- | -------- | ------------------ |
| id        | String   | UUID, primary key  |
| email     | String   | Unique             |
| name      | String   |                    |
| image     | String?  | Avatar from Google |
| role      | Enum     | `USER` \| `ADMIN`  |
| createdAt | DateTime |                    |

---

### 5.2 Tour

| Field               | Type     | Notes                                                |
| ------------------- | -------- | ---------------------------------------------------- |
| id                  | String   | UUID, primary key                                    |
| slug                | String   | Unique, used in URLs                                 |
| title               | String   | English title (canonical)                            |
| shortDesc           | String   | English short description                            |
| description         | String   | English full description (Markdown)                  |
| highlights          | String[] | English bullet points                                |
| included            | String[] | What's included                                      |
| notIncluded         | String[] | What's not included                                  |
| itinerary           | Json?    | Day-by-day schedule (see structure below)            |
| translations        | Json     | Language-keyed translation map (see structure below) |
| price               | Float    | Price per person (USD)                               |
| childPrice          | Float?   | Child price — falls back to `price` if null          |
| discountPrice       | Float?   | Sale price if active                                 |
| duration            | String   | e.g. `"3 days"`, `"Full day"`                        |
| location            | String   | e.g. `"Luxor"`, `"Cairo"`                            |
| category            | String   | e.g. `"Historical"`, `"Adventure"`                   |
| images              | String[] | Array of image URLs                                  |
| maxCapacity         | Int      | Max people per booking date                          |
| isActive            | Boolean  | Hide/show tour without deleting                      |
| isFeatured          | Boolean  | Show on home page                                    |
| isBestseller        | Boolean  | Bestseller badge                                     |
| hasFreeCancellation | Boolean  | Free cancellation badge                              |
| createdAt           | DateTime |                                                      |
| updatedAt           | DateTime |                                                      |

---

### 5.3 Booking

| Field        | Type     | Notes                                   |
| ------------ | -------- | --------------------------------------- |
| id           | String   | UUID, primary key                       |
| userId       | String   | FK → User                               |
| tourId       | String   | FK → Tour                               |
| tourDate     | DateTime | Selected tour date                      |
| people       | Int      | Total number of people (min 1)          |
| totalPrice   | Float    | Calculated at booking time and stored   |
| status       | Enum     | `PENDING` \| `CONFIRMED` \| `CANCELLED` |
| contactName  | String   |                                         |
| contactEmail | String   |                                         |
| contactPhone | String   |                                         |
| notes        | String?  | Any special requests                    |
| createdAt    | DateTime |                                         |
| updatedAt    | DateTime |                                         |

---

### 5.4 Review

| Field      | Type     | Notes                                 |
| ---------- | -------- | ------------------------------------- |
| id         | String   | UUID, primary key                     |
| userId     | String   | FK → User                             |
| tourId     | String   | FK → Tour                             |
| rating     | Int      | 1–5                                   |
| comment    | String   |                                       |
| status     | Enum     | `PENDING` \| `APPROVED` \| `REJECTED` |
| adminReply | String?  |                                       |
| createdAt  | DateTime |                                       |

---

### 5.5 Wishlist

| Field     | Type     | Notes             |
| --------- | -------- | ----------------- |
| id        | String   | UUID, primary key |
| userId    | String   | FK → User         |
| tourId    | String   | FK → Tour         |
| createdAt | DateTime |                   |

**Constraint:** `UNIQUE(userId, tourId)`

---

## 6. Authentication

- Google OAuth only via Auth.js
- `User` record auto-created on first login with `role: USER`
- First admin created via `prisma/seed.ts`
- Middleware in `middleware.ts` checks `role === ADMIN` for all `/admin/*` routes — returns `403` otherwise

---

## 7. Core Features

### 7.1 Tours

- Grid listing with search, filters, and sort
- Tour detail page: images, description, highlights, included/not-included, itinerary accordion
- Locale passed as query param (`lang`) to service — service resolves `translations[locale]` with EN fallback
- Badges: Bestseller, Free Cancellation (from boolean fields on Tour)

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
6. Admin notified via Email (and optionally WhatsApp)
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

---

## 10. UI Design

### Key Components

| Component            | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| `Navbar`             | Logo, nav links, language switcher, login/avatar button               |
| `TourCard`           | Image, title, location, price, average rating, badges                 |
| `TourFilters`        | Sidebar filters: category, location, price slider, duration           |
| `BookingWidget`      | Sticky sidebar: date picker, people counter, price total, book button |
| `PriceBreakdown`     | Itemized cost display below booking widget                            |
| `ItineraryAccordion` | Collapsible day-by-day itinerary on tour detail                       |
| `ReviewCard`         | Stars, comment text, admin reply block                                |
| `RatingBreakdown`    | 5★→1★ bar chart on tour detail                                        |
| `SearchBar`          | Global search with autocomplete dropdown                              |
| `Skeleton`           | Loading placeholders for tour grid and detail page                    |
| `Toast`              | Success/error notifications                                           |

### Theme

| Token   | Value     |
| ------- | --------- |
| Primary | `#0EA5E9` |
| Accent  | `#F59E0B` |

---

## 11. Admin Dashboard

| Page                | Description                                                                     |
| ------------------- | ------------------------------------------------------------------------------- |
| `/admin`            | Overview: pending bookings count, reviews awaiting approval, total active tours |
| `/admin/tours`      | Tour list with active/featured toggles; links to create and edit                |
| `/admin/tours/new`  | Full tour creation form including `translations` JSON editor per language       |
| `/admin/tours/[id]` | Edit tour — same form as create                                                 |
| `/admin/bookings`   | All bookings with status filter; confirm or cancel actions                      |
| `/admin/reviews`    | Approve/reject queue; inline admin reply form                                   |

---

## 12. Multi-language

| Item              | Approach                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------- |
| URL routing       | `/[locale]/*` — e.g. `/en/tours`, `/ru/tours`                                             |
| Root `/`          | Middleware redirects to `/en` (or detected locale from `Accept-Language` header)         |
| Supported locales | Defined in `lib/constants.ts` as `SUPPORTED_LOCALES` array                                |
| Tour content      | Resolved from `Tour.translations[locale]` with EN fallback                                |
| UI strings        | Static files: `lib/i18n/en.ts`, `lib/i18n/ru.ts`                                          |
| New language      | Add locale to `SUPPORTED_LOCALES`, add UI strings file, fill `translations` JSON in admin |

---

## 13. SEO

| Feature          | Implementation                                                          |
| ---------------- | ----------------------------------------------------------------------- |
| Meta title       | `tour.title` (locale-resolved)                                          |
| Meta description | `tour.shortDesc` (locale-resolved)                                      |
| Open Graph       | Tour images                                                             |
| JSON-LD          | `TourActivity` + `Organization` structured data on detail pages       |
| Sitemap          | Auto-generated from all `isActive: true` tours across supported locales |
| robots.txt       | Allow `/[locale]/*`; disallow `/admin/*`                                 |

---

## 14. Pages Structure

### Public

| Path                     | Page                                        |
| ------------------------ | ------------------------------------------- |
| `/`                      | Redirect to `/en` (or detected locale)     |
| `/[locale]`              | Home: hero, search bar, featured tours grid |
| `/[locale]/tours`        | Tours listing + filter sidebar              |
| `/[locale]/tours/[slug]` | Tour detail + booking widget                |
| `/[locale]/wishlist`     | Wishlist (auth required)                    |
| `/[locale]/booking/[id]` | Booking confirmation                        |
| `/[locale]/about`        | About page                                  |
| `/[locale]/contact`      | Contact page                                |

### Admin

| Path                | Page                |
| ------------------- | ------------------- |
| `/admin`            | Dashboard overview  |
| `/admin/tours`      | Tours list          |
| `/admin/tours/new`  | Create tour         |
| `/admin/tours/[id]` | Edit tour           |
| `/admin/bookings`   | Bookings management |
| `/admin/reviews`    | Reviews management  |

---

## 15. Phased Roadmap

| Phase     | Description                                                                                                | Days        |
| --------- | ---------------------------------------------------------------------------------------------------------- | ----------- |
| 1         | Project setup: Next.js 16, Tailwind, shadcn/ui, ESLint, folder structure, `.env` template                  | 1           |
| 2         | Database: Prisma schema, migration, seed (first admin + sample tours with translations)                    | 1           |
| 3         | I18n routing: `[locale]` dynamic segment, middleware redirect, `SUPPORTED_LOCALES` config, UI string files | 1           |
| 4         | Auth: Google OAuth via Auth.js, session endpoint, admin middleware guard                                   | 1           |
| 5         | Core public pages: Home, Tours listing, Tour detail (with locale-resolved content)                         | 3           |
| 6         | Booking: widget, capacity check, `POST /api/bookings`, email notification to admin                         | 2           |
| 7         | Reviews: submit form, admin approve/reject/reply                                                           | 1           |
| 8         | Wishlist: add/remove, wishlist page                                                                        | 1           |
| 9         | Admin dashboard: tours CRUD (with translations editor), bookings, reviews                                  | 2           |
| 10        | SEO: meta tags, JSON-LD, sitemap, robots.txt                                                               | 1           |
| 11        | Polish: mobile audit, Lighthouse ≥ 90, image optimization                                                  | 1           |
| 12        | Deploy: Vercel + production PostgreSQL, env vars, smoke test                                               | 1           |
| **Total** |                                                                                                            | **16 days** |

---

_Sharm Cloud Tours PRD v4.0 — May 2025_