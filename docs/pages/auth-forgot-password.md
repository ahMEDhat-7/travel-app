# Forgot Password Page

## Overview
The forgot password page (`/[locale]/auth/forgot-password`) allows users to reset their password.

## Route
- `/en/auth/forgot-password` - English forgot password page

## Components

### Form
- Email input
- Submit button

## API Calls

### Request Password Reset
```
POST /api/auth/forgot-password
```

**Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reset link sent to email"
}
```

## File Location
`app/[locale]/auth/forgot-password/page.tsx`