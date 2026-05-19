# Booking Page

## Overview
The booking page (`/[locale]/booking/[id]`) allows users to complete a booking for a specific tour.

## Route
- `/en/booking/[id]` - English booking page
- `/ru/booking/[id]` - Russian booking page

## Components

### Booking Form
- Tour summary
- Date picker
- Guest information (name, email, phone)
- Special requests textarea
- Total price breakdown
- Payment integration (Stripe)

### Price Breakdown
- Base price calculation
- Extra services
- Total amount

## API Calls

### Create Booking
```
POST /api/bookings
```

**Body:**
```json
{
  "tourId": "uuid",
  "date": "2024-12-15",
  "guests": 2,
  "guestName": "string",
  "guestEmail": "string",
  "guestPhone": "string",
  "specialRequests": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": Booking
}
```

### Create Payment Intent
```
POST /api/payments/create-intent
```

**Body:**
```json
{
  "bookingId": "uuid",
  "amount": 299
}
```

## Dependencies
- `BookingWidget` component
- `PriceBreakdown` component
- Stripe integration

## File Location
`app/[locale]/booking/[id]/page.tsx`