import type {
  User,
  Tour,
  Booking,
  Review,
  Wishlist,
  Message,
  Notification,
  Role,
  BookingStatus,
  ReviewStatus,
  SenderType,
  NotificationType,
} from '@prisma/client';

export type {
  User,
  Tour,
  Booking,
  Review,
  Wishlist,
  Message,
  Notification,
  Role,
  BookingStatus,
  ReviewStatus,
  SenderType,
  NotificationType,
};

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export const BookingStatusEnum = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
} as const;

export const ReviewStatusEnum = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export const SenderTypeEnum = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export const NotificationTypeEnum = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  MESSAGE_REPLY: 'MESSAGE_REPLY',
} as const;