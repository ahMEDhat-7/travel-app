# tasks.md — Sharm Cloud Tours Platform

## Project Milestones & Tasks

---

### Milestone 1 — Foundation

Set up the full project foundation: repository, tooling, database, authentication, and internationalization routing. By the end of this milestone the app boots, the database is migrated and seeded, Google login works, admin routes are guarded, and locale-based URLs (`/en/`, `/ru/`) resolve correctly.

#### Phase 1 — Project Setup

- [ ] Install and configure shadcn/ui component library
- [ ] Set up ESLint with recommended Next.js rules
- [ ] Create the full folder structure: `app/`, `components/`, `services/`, `repositories/`, `lib/`, `types/`, `prisma/`, `public/`
- [ ] Create `.env.example` with all required variable keys (`DATABASE_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc.)
- [ ] Create `.env.local` locally (gitignored)

#### Phase 2 — Database

- [ ] Write `prisma/schema.prisma` with all 5 models: `User`, `Tour`, `Booking`, `Review`, `Wishlist`
- [ ] Define all enums: `Role`, `BookingStatus`, `ReviewStatus`
- [ ] Run `prisma migrate dev` to generate the initial migration
- [ ] Write `prisma/seed.ts` to create the first admin user
- [ ] Add sample tours with English content and Russian translations in the seed
- [ ] Run `prisma db seed` and verify data in the database

#### Phase 3 — i18n Routing & UI Strings

- [ ] Define `SUPPORTED_LOCALES = ["en", "ru"]` and `Locale` type in `lib/constants.ts`
- [ ] Install `next-intl`
- [ ] Create `i18n.ts` request config — loads `lib/i18n/<locale>.ts` message file per request
- [ ] Register `next-intl` plugin in `next.config.ts` alongside locale routing config
- [ ] Create `lib/i18n/en.ts` with all English UI strings, namespaced by feature: `nav`, `booking`, `reviews`, `wishlist`, `filters`, `common`, `auth`, `errors`
- [ ] Create `lib/i18n/ru.ts` with identical key structure, all values translated to Russian
- [ ] Wrap `app/[locale]/layout.tsx` with `next-intl`'s `NextIntlClientProvider` so Client Components can access translations
- [ ] Create the `app/[locale]/` dynamic segment and a placeholder root `page.tsx`
- [ ] Write `middleware.ts` to detect locale from `Accept-Language` header and redirect `/` → `/en` or `/ru`
- [ ] Add supported locales to `next.config.ts`
- [ ] Verify `/en` and `/ru` both resolve without errors
- [ ] Verify `useTranslations()` works in a Client Component and `getTranslations()` works in a Server Component

#### Phase 4 — Authentication

- [ ] Install Auth.js and configure Google OAuth provider in `lib/auth.ts`
- [ ] Create `app/api/auth/[...nextauth]/route.ts` handler
- [ ] Implement auto-creation of `User` record with `role: USER` on first Google login
- [ ] Extend `middleware.ts` to check `role === ADMIN` for all `/admin/*` routes and return `403` otherwise
- [ ] Create a placeholder `app/admin/page.tsx` to verify the admin guard works
- [ ] Test login flow: new user created in DB, session returned, admin route blocked for non-admin

---

### Milestone 2 — Core Public Experience

Build the three main public pages tourists interact with. All content must be locale-resolved with English fallback.

#### Services & Repositories

- [ ] Write `repositories/tour.repository.ts`: `findMany` (with filters), `findBySlug`, filter by `isActive: true`
- [ ] Write `services/tour.service.ts`: implement `getLocalizedTour(tour, locale)` with EN fallback, list tours with filters/sort, get single tour
- [ ] Create `app/api/tours/route.ts`: validate query params with Zod, call service, return response envelope
- [ ] Create `app/api/tours/[slug]/route.ts`: validate slug, call service, return full tour detail

#### Shared UI Components

- [ ] Build `components/layout/Navbar.tsx`: logo, nav links, login/avatar button — accepts `currentLocale` prop from parent Server Component; use `getTranslations("nav")` for all link labels
- [ ] Build `components/layout/Footer.tsx` — use `getTranslations("common")` for footer strings
- [ ] Build `components/ui/Skeleton.tsx` loading placeholders
- [ ] Build `components/ui/Toast.tsx` — use `useTranslations("common")` for success/error message strings
- [ ] Build `components/tours/TourBadge.tsx`: Bestseller and Free Cancellation badges — labels from `useTranslations("common")`

#### Language Switcher

- [x] Add a human-readable `languageLabel` key to each `lib/i18n/<locale>.ts` file (e.g. `"English"`, `"Русский"`) so the switcher shows proper names instead of raw locale codes
- [ ] Build `components/layout/LanguageSwitcher.tsx` as a `"use client"` component — receives `currentLocale: string` as a prop
- [ ] Loop over `SUPPORTED_LOCALES` from `lib/constants.ts` to render options — never hardcode language options
- [ ] On language change, replace only the locale segment of the current pathname (`/en/tours/pyramids` → `/ru/tours/pyramids`) using `usePathname` + `useRouter` — preserve the full path
- [ ] Integrate `LanguageSwitcher` into `Navbar.tsx`, passing `currentLocale` down from the page's Server Component
- [ ] Verify switching language on the Tours listing page preserves active filters in the URL
- [ ] Verify switching language on a Tour detail page lands on the same tour in the new locale

#### Home Page — `/[locale]`

- [x] Build hero section with headline and CTA
- [ ] Integrate `SearchBar` component with basic input
- [ ] Fetch and display featured tours grid (`isFeatured: true`) using `TourCard`
- [ ] Build `components/tours/TourCard.tsx`: image, title, location, price, average rating, badges

#### Tours Listing Page — `/[locale]/tours`

- [ ] Build `components/tours/TourFilters.tsx`: category, location, price range slider, duration — all labels from `useTranslations("filters")`
- [ ] Build `components/tours/TourGrid.tsx` with sort controls (price asc/desc, rating, popularity) — sort labels from `useTranslations("filters")`
- [ ] Build `components/search/SearchBar.tsx` and `SearchAutocomplete.tsx` — placeholder text from `useTranslations("common")`
- [ ] Wire filters, sort, and search as URL query params for shareable/bookmarkable URLs
- [ ] Show skeleton placeholders while loading

#### Tour Detail Page — `/[locale]/tours/[slug]`

- [ ] Display image gallery
- [ ] Display locale-resolved title, description, highlights, included/not-included lists (content from DB via `getLocalizedTour`)
- [ ] Build `components/tours/ItineraryAccordion.tsx` — section heading from `getTranslations("common")`
- [ ] Display average rating, review count, and `RatingBreakdown` bar chart — labels from `getTranslations("reviews")`
- [ ] Add locale-resolved page `<title>` and meta description

---

### Milestone 3 — Booking & Transactions

Implement the full booking flow end-to-end.

#### Service & Repository

- [ ] Write `repositories/booking.repository.ts`: capacity aggregate query, `createBooking`, `findByUser`
- [ ] Write `services/booking.service.ts`: capacity check logic, `totalPrice = people × price` calculation, create booking, send admin email notification
- [ ] Create `app/api/bookings/route.ts`: `POST` (auth required) — validate with Zod, call service, return `{ id, status: "PENDING" }`; `GET` (auth required) — return user's bookings

#### Booking UI

- [ ] Build `components/booking/BookingWidget.tsx`: sticky sidebar with date picker, people counter (min 1), running price total, Book button — all labels from `useTranslations("booking")`
- [ ] Build `components/booking/PriceBreakdown.tsx`: itemized cost display — labels from `useTranslations("booking")`
- [ ] Add auth gate to BookingWidget — prompt login if session is absent, message from `useTranslations("auth")`
- [ ] Integrate BookingWidget into the Tour detail page layout
- [ ] Build `app/[locale]/booking/[id]/page.tsx`: booking confirmation page — all UI strings from `getTranslations("booking")`

#### Notifications

- [ ] Configure email sending library (e.g. Nodemailer or Resend) in `lib/`
- [ ] Implement admin email notification on new booking with tour name, date, contact details, and booking ID

---

### Milestone 4 — Social & Engagement Features

Reviews and wishlists can be built in parallel.

#### Reviews

- [ ] Write `repositories/review.repository.ts`: `createReview`, `findApprovedByTour`, `updateStatus`, `addAdminReply`
- [ ] Write `services/review.service.ts`: submit review, filter to `APPROVED` only for public queries
- [ ] Create `app/api/reviews/route.ts`: `POST` (auth required) — validate with Zod, create review as `PENDING`
- [ ] Create `app/api/tours/[slug]/reviews/route.ts`: `GET` — return only `APPROVED` reviews
- [ ] Build `components/reviews/ReviewForm.tsx`: star rating input + comment textarea, submit button — all labels from `useTranslations("reviews")`
- [ ] Build `components/reviews/ReviewCard.tsx`: stars, comment, admin reply block, user name/avatar — labels from `useTranslations("reviews")`
- [ ] Build `components/reviews/RatingBreakdown.tsx`: 5★→1★ bar chart — labels from `useTranslations("reviews")`
- [ ] Integrate review list and form into Tour detail page

#### Wishlist

- [ ] Write `repositories/wishlist.repository.ts`: `add`, `remove`, `findByUser`
- [ ] Write `services/wishlist.service.ts`: add with duplicate guard, remove, list
- [ ] Create `app/api/wishlist/route.ts`: `GET` and `POST` (auth required)
- [ ] Create `app/api/wishlist/[tourId]/route.ts`: `DELETE` (auth required)
- [ ] Add wishlist toggle button (heart icon) to `TourCard` and Tour detail page
- [ ] Build `app/[locale]/wishlist/page.tsx`: grid of wishlisted tours, auth-required guard — page heading and empty state from `getTranslations("wishlist")`

---

### Milestone 5 — Admin Dashboard

Build the full admin shell and all admin pages.

#### Admin Shell

- [ ] Build `app/admin/layout.tsx`: sidebar + topbar shell
- [ ] Build `components/layout/AdminSidebar.tsx`: links to Dashboard, Tours, Bookings, Reviews
- [ ] Build `components/layout/AdminTopbar.tsx`: page title, logged-in admin name/avatar

#### Dashboard Overview — `/admin`

- [ ] Display count of `PENDING` bookings
- [ ] Display count of reviews awaiting approval (`PENDING`)
- [ ] Display total active tours count

#### Tours Management — `/admin/tours`

- [ ] Build tours list table with `isActive` and `isFeatured` toggle switches
- [ ] Link to create and edit pages
- [ ] Create `app/api/admin/tours/route.ts`: `POST` — validate full `TourCreateInput` with Zod, call service
- [ ] Create `app/api/admin/tours/[id]/route.ts`: `PUT` and `DELETE`
- [ ] Build `app/admin/tours/new/page.tsx` and `app/admin/tours/[id]/page.tsx` with a shared tour form
- [ ] Tour form fields: all scalar fields + image URL list + included/notIncluded lists + itinerary builder
- [ ] Add per-language translation editor (tabs for EN, RU — extensible) for `title`, `shortDesc`, `description`, `highlights`, `itinerary`
- [ ] Translation tabs must be driven by `SUPPORTED_LOCALES` — adding a new locale to the constant automatically adds a new tab
- [ ] Show a translation completeness indicator per language tab (e.g. `[ EN ✓ ] [ RU ✓ ] [ AR — not translated ]`) based on whether `translations.<locale>` fields are filled

#### Bookings Management — `/admin/bookings`

- [ ] Build bookings table with status filter (`PENDING`, `CONFIRMED`, `CANCELLED`)
- [ ] Create `app/api/admin/bookings/[id]/route.ts`: `PATCH` with `{ status }` — validate with Zod
- [ ] Add Confirm and Cancel action buttons per booking row

#### Reviews Management — `/admin/reviews`

- [ ] Build reviews queue showing `PENDING` reviews first
- [ ] Create `app/api/admin/reviews/[id]/route.ts`: `PATCH` with `{ status, adminReply? }` — validate with Zod
- [ ] Add Approve and Reject buttons per review
- [ ] Add inline admin reply input field that saves on submit

---

### Milestone 6 — SEO & Performance

#### SEO

- [ ] Add locale-resolved `<title>` and `<meta name="description">` to Tour detail pages
- [ ] Add Open Graph tags (`og:title`, `og:description`, `og:image`) using first tour image
- [ ] Add JSON-LD `TourActivity` structured data to Tour detail pages
- [ ] Add JSON-LD `Organization` structured data to the Home page
- [ ] Generate `sitemap.xml` from all `isActive: true` tours across all supported locales
- [ ] Create `robots.txt`: allow `/[locale]/*`, disallow `/admin/*`

#### Performance & Polish

- [ ] Run full mobile responsiveness audit across all public pages
- [ ] Replace any `<img>` tags with Next.js `<Image>` for automatic optimization
- [ ] Add `loading="lazy"` and correct `sizes` attributes on tour images
- [ ] Run Lighthouse audit — address any issues until score ≥ 90 on Performance, Accessibility, SEO
- [ ] Add `Skeleton` placeholders to all data-fetching pages that are missing them
- [ ] Verify all pages render correctly for both `/en` and `/ru` locales

---

## Summary

| Milestone | Focus                              | Days | Tasks |
| --------- | ---------------------------------- | ---- | ----- |
| 1         | Foundation (setup, DB, auth, i18n) | 4    | 28    |
| 2         | Core public pages                  | 3    | 24    |
| 3         | Booking flow                       | 2    | 13    |
| 4         | Reviews & Wishlist                 | 2    | 16    |
| 5         | Admin dashboard                    | 2    | 19    |
| 6         | SEO & Performance                  | 2    | 12    |

---

_Sharm Cloud Tours tasks.md — generated from PRD v4.0_