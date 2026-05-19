# Messages Page

## Overview
The messages page (`/[locale]/messages`) displays user's conversation with the support team.

## Route
- `/en/messages` - English messages page
- `/ru/messages` - Russian messages page

## Components

### Chat Interface
- Message list
- Message input
- Send button
- Timestamp display

## API Calls

### Get Messages
```
GET /api/messages
```

### Send Message
```
POST /api/messages
```

**Body:**
```json
{
  "subject": "string",
  "message": "string"
}
```

### Mark as Read
```
PATCH /api/messages
```

## Notes
- Requires authentication

## File Location
`app/[locale]/messages/page.tsx`