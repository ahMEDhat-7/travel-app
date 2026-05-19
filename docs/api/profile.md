# Profile API

## Overview
API endpoint for user profile management.

## Base URL
```
/api/profile
```

## Methods

### GET - Get Profile

Returns current user's profile.

**Authentication:** Required

**Example Request:**
```
GET /api/profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### PATCH - Update Profile

Updates user profile.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Updated"
}
```

Or change password:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ...updated profile }
}
```

## File Location
`app/api/profile/route.ts`