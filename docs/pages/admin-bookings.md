# Admin Bookings Management

## Overview
The admin bookings page (`/admin/bookings`) allows administrators to manage bookings.

## Route
- `/admin/bookings` - Admin bookings management

## Features

### Bookings Table
- List all bookings
- View booking details
- Update booking status
- Cancel/delete booking

### Filters
- Status filter (pending, confirmed, completed, cancelled)
- Date range filter

## API Calls

### Get All Bookings
```
GET /api/admin/bookings
```

### Create Booking
```
POST /api/admin/bookings
```

### Update Booking
```
PATCH /api/admin/bookings
```

### Delete Booking
```
DELETE /api/admin/bookings?id={id}
```

## Notes
- Requires ADMIN role

## File Location
`app/admin/bookings/page.tsx`