# Admin Tours API

## Overview
API endpoint for admin tour management.

## Base URL
```
/api/admin/tours
```

## Methods

### GET - List All Tours

Returns all tours (admin view).

**Authentication:** Required (ADMIN)

**Example Request:**
```
GET /api/admin/tours
```

**Response:**
```json
{
  "success": true,
  "data": [ ...all tours with admin fields ]
}
```

### POST - Create Tour

Creates a new tour.

**Authentication:** Required (ADMIN)

**Request Body:**
```json
{
  "title": "New Tour",
  "shortDesc": "Description",
  "description": "Full description",
  "price": 299,
  "location": "Cairo",
  "duration": "5 days",
  "category": "Historical",
  "images": ["url1", "url2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": { ...new tour }
}
```

### PATCH - Update Tour

Updates an existing tour.

**Authentication:** Required (ADMIN)

### DELETE - Delete Tour

Deletes a tour.

**Authentication:** Required (ADMIN)

**Query Parameter:** `?id={tour-uuid}`

## File Location
`app/api/admin/tours/route.ts`