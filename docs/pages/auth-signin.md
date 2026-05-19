# Sign In Page

## Overview
The sign in page (`/[locale]/auth/signin`) allows users to authenticate.

## Route
- `/en/auth/signin` - English sign in page

## Components

### Login Form
- Email input
- Password input
- Remember me checkbox
- Forgot password link
- Sign in button

### Social Login
- NextAuth providers (Google, etc.)

## API Calls

### Get Session
```
GET /api/auth/session
```

### Credentials Login
- Handled by NextAuth at `/api/auth/[...nextauth]`

## Dependencies
- NextAuth for authentication

## File Location
`app/[locale]/auth/signin/page.tsx`