# Reviews API

## Overview
API endpoint for managing reviews.

## Base URL
```
/api/reviews
```

## Methods

### GET - List Reviews

Returns approved reviews.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number | Number of reviews, default: 6 |

**Example Request:**
```
GET /api/reviews?limit=4
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Great tour!",
      "createdAt": "2024-12-15T10:00:00Z",
      "userName": "John Doe",
      "tourTitle": "Pyramids Tour"
    }
  ]
}
```

### POST - Create Review

Creates a new review (requires authentication).

**Request Body:**
```json
{
  "tourId": "uuid",
  "rating": 5,
  "comment": "Amazing experience!"
}
```

**Validation:**
- `tourId`: Required, valid UUID
- `rating`: Required, number 1-5
- `comment`: Required, string 10-1000 characters

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tourId": "uuid",
    "rating": 5,
    "comment": "Amazing experience!",
    "status": "PENDING",
    "createdAt": "2024-12-15T10:00:00Z"
  }
}
```

**Error Responses:**
- 401: Not authenticated
- 400: Validation error

## File Location
`app/api/reviews/route.ts`