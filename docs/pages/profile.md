# Profile Page

## Overview
The profile page (`/[locale]/profile`) displays user account information and booking history.

## Route
- `/en/profile` - English profile page
- `/ru/profile` - Russian profile page

## Components

### Account Settings
- Name input
- Email display
- Password change

### Bookings List
- Active bookings
- Past bookings
- Booking details

### Reviews Section
- User's submitted reviews
- Review status (pending/approved)

## API Calls

### Get Profile
```
GET /api/profile
```

### Update Profile
```
PATCH /api/profile
```

**Body:**
```json
{
  "name": "string",
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Get User Bookings
```
GET /api/profile/bookings
```

### Get User Reviews
```
GET /api/profile/reviews
```

## Dependencies
- Uses NextAuth for authentication

## File Location
`app/[locale]/profile/page.tsx`