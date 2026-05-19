# Bookings API

## Overview
API endpoint for managing bookings.

## Base URL
```
/api/bookings
```

## Methods

### GET - List Bookings

Returns user's bookings (or all for admin).

**Authentication:** Required

**Example Request:**
```
GET /api/bookings
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tourId": "uuid",
      "userId": "uuid",
      "date": "2024-12-15",
      "guests": 2,
      "guestName": "John Doe",
      "guestEmail": "john@example.com",
      "status": "CONFIRMED",
      "totalPrice": 598,
      "createdAt": "2024-12-01T10:00:00Z"
    }
  ]
}
```

### POST - Create Booking

Creates a new booking.

**Request Body:**
```json
{
  "tourId": "uuid",
  "date": "2024-12-15",
  "guests": 2,
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1234567890",
  "specialRequests": "Dietary restrictions"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ...new booking }
}
```

## File Location
`app/api/bookings/route.ts`