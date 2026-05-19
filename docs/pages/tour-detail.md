# Tour Detail Page

## Overview
The tour detail page (`/[locale]/tours/[id]`) displays comprehensive information about a specific tour.

## Route
- `/en/tours/[id]` - English tour detail
- `/ru/tours/[id]` - Russian tour detail

## Components

### Tour Header
- Hero image gallery
- Tour title and short description
- Location and duration badges
- Price display

### Tour Details
- Full description
- Itinerary accordion
- Included/Not included lists
- Additional info

### Booking Widget
- Date selection
- Guest count
- Price calculation
- Book now button

### Reviews Section
- Review list
- Rating breakdown
- Review submission form

### Related Tours
- Similar tours carousel

## API Calls

### Get Tour by ID
```
GET /api/tours/id/{id}?locale={locale}
```

**Parameters:**
- `id` (string): Tour UUID
- `locale` (string): Language code

**Response:**
```json
{
  "success": true,
  "data": Tour
}
```

### Submit Review
```
POST /api/reviews
```

**Body:**
```json
{
  "tourId": "uuid",
  "rating": 5,
  "comment": "string"
}
```

## Dependencies
- `TourJsonLd` for SEO
- `ItineraryAccordion` component
- `BookingWidget` component
- `ReviewForm` component

## File Location
`app/[locale]/tours/[id]/page.tsx`