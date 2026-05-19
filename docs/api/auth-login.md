# Auth Login API

## Overview
API endpoint for user authentication.

## Base URL
```
/api/auth/login
```

## Methods

### POST - Login

Authenticates user with credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

**Error Responses:**
- 401: Invalid credentials

## Notes
- Uses NextAuth credentials provider

## File Location
`app/api/auth/login/route.ts`