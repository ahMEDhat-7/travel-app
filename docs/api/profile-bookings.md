# Profile Bookings API

## Overview
API endpoint for user's booking history.

## Base URL
```
/api/profile/bookings
```

## Methods

### GET - Get User Bookings

Returns current user's bookings.

**Authentication:** Required

**Example Request:**
```
GET /api/profile/bookings
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tourId": "uuid",
      "tour": { ...tour data },
      "date": "2024-12-15",
      "guests": 2,
      "status": "CONFIRMED",
      "totalPrice": 598,
      "createdAt": "2024-12-01T10:00:00Z"
    }
  ]
}
```

## File Location
`app/api/profile/bookings/route.ts`