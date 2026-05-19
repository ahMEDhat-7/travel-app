# Admin Tours Management

## Overview
The admin tours page (`/admin/tours`) allows administrators to manage tours.

## Route
- `/admin/tours` - Admin tours management

## Features

### Tours Table
- List all tours
- Edit tour details
- Delete tour
- Toggle featured/bestseller status

### Add New Tour
- Form with title, description, price, images
- Category selection
- Duration and location

## API Calls

### Get All Tours (Admin)
```
GET /api/admin/tours
```

### Create Tour
```
POST /api/admin/tours
```

### Update Tour
```
PATCH /api/admin/tours
```

### Delete Tour
```
DELETE /api/admin/tours?id={id}
```

## Notes
- Requires ADMIN role
- Uses `/api/tours` for some operations

## File Location
`app/admin/tours/page.tsx`