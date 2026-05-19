# Contact Page

## Overview
The contact page (`/[locale]/contact`) allows users to send messages to the company.

## Route
- `/en/contact` - English contact page
- `/ru/contact` - Russian contact page

## Components

### Contact Form
- Name input
- Email input
- Subject dropdown
- Message textarea
- Submit button

## API Calls

### Send Message
```
POST /api/messages
```

**Body:**
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

## Dependencies
- Uses `next-intl` for translations

## File Location
`app/[locale]/contact/page.tsx`