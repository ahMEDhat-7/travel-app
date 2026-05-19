# Tours Listing Page

## Overview
The tours listing page (`/[locale]/tours`) displays all available tours with filtering and sorting capabilities.

## Route
- `/en/tours` - English tours page
- `/ru/tours` - Russian tours page

## Components

### Search Bar
- Search input for tour names
- Auto-complete suggestions from API

### Filter Section
- Category filter (All, Historical, Cruise, Adventure, Nature)
- Price range filter
- Duration filter

### Tours Grid
- Responsive grid layout
- Tour cards with image, title, location, duration, price
- Bestseller/Featured badges

### Pagination
- Page navigation controls

## API Calls

### Get Tours
```
GET /api/tours?locale={locale}&category={category}&minPrice={min}&maxPrice={max}&duration={duration}&search={query}&sort={field}&order={asc|desc}&limit={limit}&offset={offset}
```

**Parameters:**
- `locale` (string): Language code (en/ru)
- `category` (string): Filter by category
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `duration` (string): Duration filter
- `search` (string): Search query
- `sort` (string): Sort field (price/rating/popularity)
- `order` (string): Sort order (asc/desc)
- `limit` (number): Number of tours per page
- `offset` (number): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [Tour...]
}
```

## Dependencies
- `SearchBar` component
- `TourFilters` component
- `TourGrid` component

## File Location
`app/[locale]/tours/page.tsx`