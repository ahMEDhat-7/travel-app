# Auth Register API

## Overview
API endpoint for user registration.

## Base URL
```
/api/auth/register
```

## Methods

### POST - Register

Creates a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation:**
- `name`: Required, string
- `email`: Required, valid email
- `password`: Required, min 8 characters

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent to your inbox"
}
```

**Error Responses:**
- 400: Validation error or email already exists

## Notes
- Sends verification email after registration

## File Location
`app/api/auth/register/route.ts`