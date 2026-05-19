# Reset Password Page

## Overview
The reset password page (`/[locale]/auth/reset-password`) allows users to set a new password using a token.

## Route
- `/en/auth/reset-password` - English reset password page

## Components

### Form
- New password input
- Confirm password input
- Submit button

## API Calls

### Reset Password
```
POST /api/auth/reset-password
```

**Body:**
```json
{
  "token": "string",
  "password": "string"
}
```

## Notes
- Token is received via email query parameter

## File Location
`app/[locale]/auth/reset-password/page.tsx`