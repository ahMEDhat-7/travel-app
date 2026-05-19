import { type Review, type User, type Tour } from './tour.types';

export { type Review, type User, type Tour };

export interface CreateReviewInput {
  tourId: string;
  rating: number;
  comment: string;
}

export type ReviewWithUser = Review & {
  user: User;
};