export const features = {
  STRIPE_ENABLED: process.env.NEXT_PUBLIC_STRIPE_ENABLED === 'true',
  EMAIL_ENABLED: !!process.env.RESEND_API_KEY,
};
