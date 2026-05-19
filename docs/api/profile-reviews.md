# Profile Reviews API

## Overview
API endpoint for user's submitted reviews.

## Base URL
```
/api/profile/reviews
```

## Methods

### GET - Get User Reviews

Returns current user's reviews.

**Authentication:** Required

**Example Request:**
```
GET /api/profile/reviews
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
      "rating": 5,
      "comment": "Great tour!",
      "status": "APPROVED",
      "createdAt": "2024-12-15T10:00:00Z"
    }
  ]
}
```

## File Location
`app/api/profile/reviews/route.ts`