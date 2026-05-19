# Stats API

## Overview
API endpoint for retrieving site statistics.

## Base URL
```
/api/stats
```

## Methods

### GET - Get Stats

Returns aggregated site statistics (admin only).

**Authentication:** Required (ADMIN role)

**Example Request:**
```
GET /api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tours": 50,
    "bookings": 2000,
    "destinations": 15,
    "reviews": 150,
    "pendingReviews": 5
  }
}
```

**Error Responses:**
- 401: Unauthorized (not admin)

## File Location
`app/api/stats/route.ts`