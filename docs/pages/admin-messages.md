# Admin Messages Management

## Overview
The admin messages page (`/admin/messages`) allows administrators to manage customer messages.

## Route
- `/admin/messages` - Admin messages management

## Features

### Messages List
- List all customer messages
- View message details
- Mark as read/unread
- Delete messages

### Broadcast
- Send message to all users

## API Calls

### Get All Messages
```
GET /api/admin/messages?filter={filter}
```

**Parameters:**
- `filter` (string): Filter by status (all/unread/read)

### Create Message
```
POST /api/admin/messages
```

### Mark as Read
```
PATCH /api/admin/messages
```

### Delete Message
```
DELETE /api/admin/messages/{id}
```

### Broadcast Message
```
POST /api/admin/broadcast
```

**Body:**
```json
{
  "subject": "string",
  "message": "string"
}
```

## Notes
- Requires ADMIN role

## File Location
`app/admin/messages/page.tsx`