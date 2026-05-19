# Home Page

## Overview
The home page (`/`, `/en`, `/ru`) serves as the main landing page for the Sharm Cloud Tours application. It showcases featured tours, bestsellers, customer reviews, and site statistics.

## Route
- `/` - Redirects to locale-based route
- `/en` - English home page
- `/ru` - Russian home page

## Components

### ImagePreviewer
- Slideshow displaying Sharm El-Sheikh destination images
- Auto-rotates every 2 seconds
- Shows image indicator dots at bottom

### Hero Section
- Displays main heading with gradient text
- Subtitle with live indicator
- Call-to-action buttons (View Tours, Learn More)
- Statistics display (Tours+, Bookings+, Destinations+)

### Featured Tours Section
- Grid layout of featured and bestseller tours
- Tour cards with image, title, location, duration, price
- "Bestseller" and "Featured" badges
- Links to tour detail pages

### Reviews Section
- Customer reviews carousel
- Star ratings display
- User name and tour title

## API Calls

### 1. Get Featured Tours
```
GET /api/tours?featured=true&limit=6
```

**Parameters:**
- `featured` (boolean): Filter for featured tours
- `limit` (number): Number of tours to return

**Response:**
```json
{
  "success": true,
  "data": [Tour...]
}
```

### 2. Get Bestsellers
```
GET /api/tours?bestseller=true&limit=3
```

**Parameters:**
- `bestseller` (boolean): Filter for bestseller tours
- `limit` (number): Number of tours to return

### 3. Get Reviews
```
GET /api/reviews?limit=4
```

**Parameters:**
- `limit` (number): Number of reviews to return

### 4. Get Stats
```
GET /api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tours": "50+",
    "bookings": "2k+",
    "destinations": "15+"
  }
}
```

## Metadata

### English
- **Title:** Sharm Cloud Tours - Best Tours & Travel Experiences in Sharm El-Sheikh
- **Description:** Discover amazing tours in Sharm El-Sheikh. Book Pyramids, Nile Cruises, Desert Adventures and more.

### Russian
- **Title:** Sharm Cloud Tours - Лучшие туры и путешествия в Египте
- **Description:** Откройте для себя удивительные туры в Египте.

## Dependencies
- `next-intl` for internationalization
- `next-themes` for theming
- `@/services/tour.service` for data fetching
- `@/components/ImagePreviewer`
- `@/components/ScrollButton`

## File Location
`app/[locale]/page.tsx`