# Auth Forgot Password API

## Overview
API endpoint for requesting password reset.

## Base URL
```
/api/auth/forgot-password
```

## Methods

### POST - Request Reset

Sends password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account exists, a reset link has been sent"
}
```

## Notes
- Returns generic message to prevent email enumeration

## File Location
`app/api/auth/forgot-password/route.ts`