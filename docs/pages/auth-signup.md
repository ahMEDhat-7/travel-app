# Sign Up Page

## Overview
The sign up page (`/[locale]/auth/signup`) allows new users to register.

## Route
- `/en/auth/signup` - English sign up page

## Components

### Registration Form
- Name input
- Email input
- Password input
- Confirm password
- Terms acceptance checkbox
- Sign up button

## API Calls

### Register
```
POST /api/auth/register
```

**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

## Notes
- Sends verification email after registration

## File Location
`app/[locale]/auth/signup/page.tsx`