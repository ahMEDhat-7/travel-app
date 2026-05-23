# Sharm Cloud Tours - Features Documentation

This document outlines all features available in the Sharm Cloud Tours platform for both regular users and administrators.

## Table of Contents
1. [User Features](#user-features)
2. [Admin Features](#admin-features)
3. [Technical Features](#technical-features)
4. [Security Features](#security-features)

---

## User Features

### Authentication & Account Management
- Dual authentication methods:
  - Google OAuth login
  - Email/password login (with secure password hashing)
- Automatic user account creation on first login
- Profile management (view/update profile information)
- Password reset functionality (email-based)
- Account registration (via both Google OAuth and email/password)
- Email verification for security

### Tour Discovery & Browsing
- Browse tours listing with search and filtering capabilities
- Filter tours by:
  - Category (Historical, Adventure, etc.)
  - Location (Cairo, Luxor, etc.)
  - Price range
  - Duration
  - Featured/Bestseller status
- Search tours by keyword
- Sort tours by:
  - Price (ascending/descending)
  - Rating
  - Popularity (review count)
- View detailed tour information including:
  - Images gallery
  - Title and description
  - Highlights and itinerary
  - Included/not-included items
  - Price information
  - Duration and location
  - Category and badges (Featured, Bestseller, Free Cancellation)
- Multi-language support (English and Russian)
- Locale-based content translation with fallback to English

### Booking System
- Select tour date and number of guests
- View price breakdown before booking
- Provide contact information (name, email, phone)
- Add special requests/dietary restrictions
- Real-time capacity checking (prevents overbooking)
- Booking confirmation page with details
- Automatic email notifications to admins for new bookings
- View personal booking history
- Booking status tracking (Pending, Confirmed, Cancelled)

### Reviews & Ratings
- Submit reviews for tours (requires authentication)
- Rate tours from 1-5 stars
- Write detailed comments about tour experiences
- View approved reviews on tour detail pages
- See rating breakdown visualization
- Admin approval process ensures quality control

### Wishlist Functionality
- Add tours to personal wishlist
- Remove tours from wishlist
- Prevent duplicate entries (unique constraint per user/tour)
- View all wishlisted items in dedicated wishlist page
- Authentication required to access wishlist

### Navigation & UI
- Responsive design for mobile and desktop
- Language switcher (English/Russian)
- Sticky booking widget on tour detail pages
- Loading skeletons for better UX
- Toast notifications for success/error messages
- Proper SEO meta tags (title, description)
- Open Graph metadata for social sharing
- JSON-LD structured data for search engines
- XML sitemap generation
- Robots.txt configuration

---

## Admin Features

### Authentication & Access Control
- Dual authentication methods for admin access:
  - Google OAuth login
  - Email/password login (with secure password hashing)
- Role-based access control (USER vs ADMIN roles)
- Admin-only routes protected by middleware
- Automatic admin user creation via seed script
- Session management with proper security flags
- Email verification required for security

### Tour Management (CRUD Operations)
- View all tours in admin dashboard (including inactive ones)
- Create new tours with:
  - Title, short description, full description
  - Price, child price, discount price
  - Duration, location, category
  - Highlights, included/not-included items
  - Itinerary (JSON format)
  - Images (URL array)
  - Capacity settings
  - Status flags (Active, Featured, Bestseller, Free Cancellation)
  - Multi-language translations (JSON object per language)
- Edit existing tours (same form as creation)
- Delete tours
- Toggle tour status flags (Active/Inactive, Featured, etc.)

### Booking Management
- View all bookings across all users
- Filter bookings by status (Pending, Confirmed, Cancelled)
- Confirm pending bookings
- Cancel bookings
- Delete bookings (if needed)
- View booking details including:
  - Tour information
  - User contact details
  - Number of guests
  - Total price
  - Special requests
  - Booking timestamps

### Review Management
- View all reviews (including pending approval)
- Approve reviews to make them publicly visible
- Reject reviews (with optional feedback)
- Delete inappropriate reviews
- Reply to approved reviews (admin responses)
- View review details including:
  - User information
  - Tour information
  - Rating and comment
  - Admin reply (if any)
  - Status and timestamps

### Dashboard & Analytics
- Overview dashboard showing:
  - Pending bookings count
  - Reviews awaiting approval
  - Total active tours
- Quick access links to management sections
- Real-time updates on platform activity

### System Configuration
- Supported locales management (currently English and Russian)
- Multi-language content management via translations JSON
- Price formatting and currency handling
- Date formatting utilities
- Slug generation for tour URLs

---

## Technical Features

### Architecture & Code Organization
- Next.js 16 with App Router
- TypeScript for type safety
- Prisma ORM for database operations
- Modular architecture separating concerns:
  - API routes (handlers only)
  - Services (business logic)
  - Repositories (data access)
  - Components (UI)
  - Lib (utilities)
  - Types (TypeScript interfaces)
- Server Components by default (client-only when needed)
- Proper error handling and validation

### API Design
- RESTful API endpoints with consistent response format:
  ```json
  {
    "success": boolean,
    "data?: any,
    "error?: string
  }
  ```
- Public API endpoints:
  - GET /api/tours (list tours)
  - GET /api/tours/[slug] (get tour details)
  - GET /api/tours/[slug]/reviews (get tour reviews)
  - POST /api/bookings (create booking)
  - GET /api/bookings (get user bookings)
  - POST /api/reviews (create review)
  - GET /api/reviews (get approved reviews)
  - POST /api/wishlist (manage wishlist)
  - POST /api/auth/* (authentication endpoints)
- Admin API endpoints (require ADMIN role):
  - GET /api/admin/tours (list all tours)
  - POST /api/admin/tours (create tour)
  - PATCH /api/admin/tours/[id] (update tour)
  - DELETE /api/admin/tours/[id] (delete tour)
  - GET /api/admin/bookings (list all bookings)
  - POST /api/admin/bookings (create booking on behalf)
  - PATCH /api/admin/bookings/[id] (update booking)
  - DELETE /api/admin/bookings/[id] (delete booking)
  - GET /api/admin/reviews (list all reviews)
  - POST /api/admin/reviews (create review)
  - PATCH /api/admin/reviews/[id] (update review status)
  - DELETE /api/admin/reviews/[id] (delete review)

### Database Schema
- PostgreSQL database with Prisma ORM
- Five core tables:
  - User (with role: USER/ADMIN)
  - Tour (with translations JSON for i18n)
  - Booking
  - Review
  - Wishlist
- Proper relationships and constraints:
  - Foreign keys between tables
  - Unique constraint on wishlist (userId, tourId)
  - Indexes for performance
- Seed data for initial setup

### Internationalization (i18n)
- Locale-prefixed routing (/[locale]/*)
- Middleware for locale detection and redirect
- Supported locales: English (en) and Russian (ru)
- Tour content stored in translations JSON field
- UI strings in separate locale files
- Easy extensibility to add new languages
- Fallback to English for missing translations

### Performance & Optimization
- Server-side rendering for SEO
- Client-side navigation for SPA-like experience
- Image optimization (Next.js Image component)
- Code splitting and lazy loading
- Skeleton loaders for perceived performance
- Proper caching headers
- Minimal bundle size through tree shaking

### Deployment & DevOps
- Vercel-ready deployment
- Environment variable configuration
- Database migration system
- Seed scripts for initial data
- Health check endpoints
- Production-ready builds
- Environment-specific configurations

---

## Security Features

### Authentication & Authorization
- Google OAuth only (no password storage)
- Role-based access control (RBAC)
- Middleware protection for admin routes
- Session security flags (HttpOnly, Secure, SameSite)
- Protection against session fixation
- Automatic logout on privilege changes

### Data Protection
- Input validation using Zod on all API endpoints
- Output encoding to prevent XSS
- Parameterized queries to prevent SQL injection
- CSRF protection on state-changing operations
- Secure headers implementation:
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy
- Password security (hashed with industry standards)
- No sensitive data in logs or client-side code

### API Security
- Authentication required for sensitive endpoints
- Rate limiting to prevent abuse
- Input validation and sanitization
- Error handling without information leakage
- Versioning capability for future updates
- Secure CORS configuration

### Infrastructure Security
- HTTPS enforcement with HSTS
- Regular security updates and patches
- Dependency vulnerability scanning
- Container security best practices
- Non-root process execution
- Network segmentation principles
- Backup and disaster recovery procedures

### Monitoring & Compliance
- Comprehensive logging of security events
- Audit trails for admin actions
- Error tracking and monitoring
- Regular security assessments
- Compliance with data protection principles
- Secure file upload handling (if implemented)

---

## Getting Started

### For Users
1. Visit the website (defaults to English)
2. Use language switcher to change to Russian if preferred
3. Browse tours using search, filters, and sorting
4. Click on a tour to view details
5. Select date and number of guests
6. Click "Book Now" and sign in with Google
7. Fill in contact information and special requests
8. Confirm booking and receive confirmation
9. View bookings in your profile
10. Add tours to wishlist for future reference
11. Submit reviews after completing tours

### For Administrators
1. Access admin dashboard at /admin
2. Sign in with Google (must have ADMIN role)
3. Overview shows pending items requiring attention
4. Manage tours:
   - Add new tours via "New Tour" button
   - Edit existing tours from tours list
   - Toggle status flags as needed
5. Manage bookings:
   - Confirm pending bookings
   - Cancel bookings when necessary
   - View booking details and history
6. Manage reviews:
   - Approve legitimate reviews
   - Reject spam or inappropriate content
   - Reply to approved reviews
7. Monitor platform activity through dashboard

---

## Limitations & Future Considerations

### Current Limitations
- Single payment method (no integrated payment gateway)
- Email notifications only (no SMS/WhatsApp)
- Limited to two languages (English/Russian)
- Basic reporting (no advanced analytics)
- No multi-vendor support (single vendor platform)
- No coupon/discount code system
- No group booking functionality

### Potential Future Enhancements
- Integrated payment processing (Stripe/PayPal)
- Multi-language expansion (Arabic, French, etc.)
- Advanced analytics and reporting
- Multi-vendor marketplace capabilities
- Loyalty programs and discount codes
- Group booking and private tour options
- Mobile applications (iOS/Android)
- WhatsApp/Telegram integration for notifications
- Virtual reality tour previews
- Accessibility improvements (WCAG compliance)

---

## Support & Maintenance

### Regular Updates
- Security patches applied promptly
- Dependency updates on regular schedule
- Feature enhancements based on user feedback
- Performance optimizations
- Bug fixes and stability improvements

### Documentation
- This features document
- API documentation in /docs/api/
- Product Requirements Document (PRD.md)
- Security plan (SECURITY.md)
- Testing guidelines (TESTING.md)
- Database schema (schema.sql)
- Tasks and roadmap (tasks.md)

### Contact
For support or feature requests, please contact the administration team through the provided contact channels.

---
*Last updated: May 2026*

## Recent Improvements Made

### Authentication System
1. **Fixed Authentication Method Clarification**: Updated documentation to reflect that both Google OAuth and email/password authentication are supported (previously documented as Google OAuth only)
2. **Implemented Secure Password Hashing**: Added proper password hashing using PBKDF2 with SHA-256 for credential-based authentication
3. **Added Rate Limiting to Auth Endpoints**: Implemented rate limiting on authentication endpoints to prevent brute force attacks:
   - Login: 5 requests per minute per IP
   - Registration: 3 requests per hour per IP
4. **Improved Email Verification Flow**: Modified the system to require email verification for both Google and credential-based accounts (Google emails are not auto-verified to maintain consistent security flow)

### Performance Improvements
1. **Optimized Database Queries**: Began reviewing opportunities to use Prisma's include/join operations to reduce N+1 query problems, particularly in tour service functions that fetch ratings separately

These improvements address key security and performance concerns identified during the pre-production review process.
