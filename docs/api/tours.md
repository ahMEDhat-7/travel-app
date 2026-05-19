# Tours API

## Overview
API endpoint for managing tours.

## Base URL
```
/api/tours
```

## Methods

### GET - List Tours

Returns a list of tours with optional filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `locale` | string | Language code (en/ru), default: en |
| `category` | string | Filter by category |
| `location` | string | Filter by location |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `duration` | string | Filter by duration |
| `search` | string | Search query |
| `featured` | boolean | Filter featured tours |
| `bestseller` | boolean | Filter bestseller tours |
| `sort` | string | Sort field (price/rating/popularity) |
| `order` | string | Sort order (asc/desc) |
| `limit` | number | Number of results, default: 20 |
| `offset` | number | Pagination offset, default: 0 |

**Example Request:**
```
GET /api/tours?locale=en&category=Historical&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "pyramids-tour",
      "title": "Pyramids & Luxor Adventure",
      "shortDesc": "Visit the Great Pyramids...",
      "price": 299,
      "location": "Cairo & Luxor",
      "duration": "5 days",
      "images": ["url1", "url2"],
      "category": "Historical",
      "isFeatured": true,
      "isBestseller": true
    }
  ]
}
```

### PATCH - Update Tour

Updates tour properties (admin only).

**Request Body:**
```json
{
  "id": "uuid",
  "isActive": true,
  "isFeatured": true,
  "isBestseller": true
}
```

**Response:**
```json
{
  "success": true,
  "data": { ...updated tour }
}
```

## File Location
`app/api/tours/route.ts`