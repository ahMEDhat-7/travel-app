# Messages API

## Overview
API endpoint for managing messages (contact form and support).

## Base URL
```
/api/messages
```

## Methods

### GET - List Messages

Returns user's messages or all messages (admin).

**Authentication:** Required

**Example Request:**
```
GET /api/messages
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "subject": "Question about tour",
      "message": "I'd like to know more...",
      "isRead": false,
      "createdAt": "2024-12-15T10:00:00Z"
    }
  ]
}
```

### POST - Send Message

Creates a new message.

**Request Body:**
```json
{
  "subject": "Question about tour",
  "message": "I'd like to know more about the pyramids tour"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ...new message }
}
```

### PATCH - Mark as Read

Marks messages as read.

**Request Body:**
```json
{
  "ids": ["uuid1", "uuid2"]
}
```

## File Location
`app/api/messages/route.ts`