# Tour by ID API

## Overview
API endpoint for retrieving a single tour by ID.

## Base URL
```
/api/tours/id/{id}
```

## Methods

### GET - Get Tour by ID

Returns a single tour by its UUID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Tour UUID |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `locale` | string | Language code (en/ru) |

**Example Request:**
```
GET /api/tours/id/550e8400-e29b-41d4-a716-446655440000?locale=en
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "pyramids-tour",
    "title": "Pyramids & Luxor Adventure",
    "shortDesc": "Visit the Great Pyramids...",
    "description": "Full description...",
    "price": 299,
    "location": "Cairo & Luxor",
    "duration": "5 days",
    "images": ["url1", "url2"],
    "category": "Historical",
    "isFeatured": true,
    "isBestseller": true,
    "itinerary": [...],
    "included": [...],
    "notIncluded": [...]
  }
}
```

**Error Responses:**
- 404: Tour not found

## File Location
`app/api/tours/id/[id]/route.ts`