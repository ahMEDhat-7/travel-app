import { z } from 'zod';

export const sanitizeString = (input: string): string => {
  return input.replace(/[<>\"'&]/g, '');
};

export const sanitizedString = (minLen = 1, maxLen = 1000) =>
  z.string()
    .min(minLen)
    .max(maxLen)
    .transform(sanitizeString);

export const emailSchema = z
  .string()
  .email()
  .transform((email) => email.toLowerCase().trim());

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]{5,20}$/, 'Invalid phone number format');

export const uuidSchema = z.string().uuid();

export const isoDateSchema = z
  .string()
  .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format');

export const positiveInt = z
  .number()
  .int('Must be an integer')
    .positive('Must be positive');

export const urlSchema = z
  .string()
  .url()
  .or(z.literal(''));

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { success: false, error: firstError?.message || 'Invalid input' };
    }
    return { success: false, error: 'Invalid input' };
  }
}