# Admin Messages API

## Overview
API endpoint for admin message management.

## Base URL
```
/api/admin/messages
```

## Methods

### GET - List All Messages

Returns all customer messages.

**Authentication:** Required (ADMIN)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | string | Filter: all/unread/read |

**Example Request:**
```
GET /api/admin/messages?filter=unread
```

### POST - Create Message

Creates a message (admin reply).

**Authentication:** Required (ADMIN)

### PATCH - Mark as Read

Marks messages as read.

**Authentication:** Required (ADMIN)

### DELETE - Delete Message

Deletes a message.

**Authentication:** Required (ADMIN)

## File Location
`app/api/admin/messages/route.ts`