# Payments API

## Overview
API endpoints for payment processing.

## Base URLs
```
/api/payments/create-intent
/api/payments/webhook
```

## Methods

### POST - Create Payment Intent

Creates a Stripe payment intent for booking.

**Request Body:**
```json
{
  "bookingId": "uuid",
  "amount": 29900
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx"
  }
}
```

### POST - Webhook

Handles Stripe webhook events.

**Purpose:**
- Payment success/failure
- Payment intent updates

**Note:** Requires Stripe signature verification

## File Location
- `app/api/payments/create-intent/route.ts`
- `app/api/payments/webhook/route.ts`