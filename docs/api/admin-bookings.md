# Admin Bookings API

## Overview
API endpoint for admin booking management.

## Base URL
```
/api/admin/bookings
```

## Methods

### GET - List All Bookings

Returns all bookings (admin view).

**Authentication:** Required (ADMIN)

**Example Request:**
```
GET /api/admin/bookings
```

### POST - Create Booking

Creates a booking on behalf of user.

**Authentication:** Required (ADMIN)

### PATCH - Update Booking

Updates booking status/details.

**Authentication:** Required (ADMIN)

**Request Body:**
```json
{
  "id": "uuid",
  "status": "CONFIRMED|CANCELLED|COMPLETED"
}
```

### DELETE - Delete Booking

Deletes a booking.

**Authentication:** Required (ADMIN)

## File Location
`app/api/admin/bookings/route.ts`