import { type Booking, type User, type Tour } from './tour.types';

export { type Booking, type User, type Tour };

export type BookingWithDetails = Booking & {
  user: User;
  tour: Tour;
};

export interface CreateBookingInput {
  tourId: string;
  tourDate: string;
  people: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
}