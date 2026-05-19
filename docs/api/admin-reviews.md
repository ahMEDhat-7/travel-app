# Admin Reviews API

## Overview
API endpoint for admin review management.

## Base URL
```
/api/admin/reviews
```

## Methods

### GET - List All Reviews

Returns all reviews including pending.

**Authentication:** Required (ADMIN)

**Example Request:**
```
GET /api/admin/reviews
```

### POST - Create Review

Creates a review (admin only).

**Authentication:** Required (ADMIN)

### PATCH - Update Review Status

Approves or rejects a review.

**Authentication:** Required (ADMIN)

**Request Body:**
```json
{
  "id": "uuid",
  "status": "APPROVED|REJECTED"
}
```

### DELETE - Delete Review

Deletes a review.

**Authentication:** Required (ADMIN)

## File Location
`app/api/admin/reviews/route.ts`