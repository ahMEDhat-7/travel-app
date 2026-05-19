# Auth Reset Password API

## Overview
API endpoint for resetting password with token.

## Base URL
```
/api/auth/reset-password
```

## Methods

### POST - Reset Password

Resets user password using reset token.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}
```

**Validation:**
- `token`: Required, valid reset token
- `password`: Required, min 8 characters

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Error Responses:**
- 400: Invalid or expired token

## File Location
`app/api/auth/reset-password/route.ts`