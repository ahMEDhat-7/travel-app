# Notifications API

## Overview
API endpoint for user notifications.

## Base URL
```
/api/notifications
```

## Methods

### GET - Get Notifications

Returns user's notifications.

**Authentication:** Required

**Example Request:**
```
GET /api/notifications
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "BOOKING_CONFIRMED",
      "title": "Booking Confirmed",
      "message": "Your booking #123 has been confirmed",
      "isRead": false,
      "createdAt": "2024-12-15T10:00:00Z"
    }
  ]
}
```

## File Location
`app/api/notifications/route.ts`