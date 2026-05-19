# Admin Reviews Management

## Overview
The admin reviews page (`/admin/reviews`) allows administrators to manage reviews.

## Route
- `/admin/reviews` - Admin reviews management

## Features

### Reviews Table
- List all reviews
- Approve/reject pending reviews
- Delete reviews
- View associated tour

### Filters
- Status filter (pending, approved, rejected)

## API Calls

### Get All Reviews
```
GET /api/admin/reviews
```

### Update Review Status
```
PATCH /api/admin/reviews
```

**Body:**
```json
{
  "id": "uuid",
  "status": "APPROVED|REJECTED"
}
```

### Delete Review
```
DELETE /api/admin/reviews?id={id}
```

## Notes
- Requires ADMIN role

## File Location
`app/admin/reviews/page.tsx`