# Languages API

## Overview
API endpoint for available languages.

## Base URL
```
/api/languages
```

## Methods

### GET - Get Languages

Returns available languages for the application.

**Example Request:**
```
GET /api/languages
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "code": "en", "name": "English" },
    { "code": "ru", "name": "Russian" }
  ]
}
```

## File Location
`app/api/languages/route.ts`