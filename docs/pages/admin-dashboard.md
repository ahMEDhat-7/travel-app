# Admin Dashboard

## Overview
The admin dashboard (`/admin`) is the main control panel for administrators.

## Route
- `/admin` - Admin dashboard

## Components

### Overview Cards
- Total tours
- Active bookings
- Pending reviews

### Quick Actions
- Add new tour
- View bookings
- Manage reviews

## API Calls

### Get All Bookings
```
GET /api/admin/bookings
```

### Get All Tours
```
GET /api/tours
```

### Get All Reviews
```
GET /api/admin/reviews
```

## Notes
- Requires ADMIN role
- Redirects to sign in if not authenticated

## File Location
`app/admin/page.tsx`