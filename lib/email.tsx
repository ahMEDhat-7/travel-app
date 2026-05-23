import { renderToString } from 'react-dom/server';
import { sendMail } from './mail';
import { VerificationEmail } from '@/components/email/verification-email';
import { BookingConfirmation } from '@/components/email/booking-confirmation';
import { PasswordReset } from '@/components/email/password-reset';
import { BookingStatusUpdate } from '@/components/email/booking-status-update';
import { ReviewReplyNotification } from '@/components/email/review-reply-notification';
import { AdminBookingNotification } from '@/components/email/admin-booking-notification';

export async function sendBookingConfirmation(options: {
  to: string;
  customerName: string;
  tourName: string;
  tourDate: string;
  people: number;
  totalPrice: number;
  currency?: string;
  bookingId: string;
}) {
  const { to, ...props } = options;

  return sendMail({
    to,
    subject: `Booking Confirmed - ${options.tourName}`,
    html: renderToString(<BookingConfirmation {...props} />),
  });
}

export async function sendPasswordReset(options: {
  to: string;
  resetToken: string;
  userName: string;
}) {
  const { to, resetToken, userName } = options;
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

  return sendMail({
    to,
    subject: 'Reset Your Sharm Cloud Tours Password',
    html: renderToString(<PasswordReset userName={userName} resetUrl={resetUrl} />),
  });
}

export async function sendVerificationEmail(options: {
  to: string;
  verificationCode: string;
  userName: string;
}) {
  const { to, verificationCode, userName } = options;

  const html = renderToString(<VerificationEmail userName={userName} verificationCode={verificationCode} />);

  const result = await sendMail({
    to,
    subject: 'Verify Your Sharm Cloud Tours Account',
    html,
  });

  if (result.disabled || !result.success) {
    console.log('  [DEV] Verification Code:', verificationCode);
    console.log('═══════════════════════════════════════════════════');
  }

  return result;
}

export async function sendAdminBookingNotification(options: {
  tourName: string;
  tourDate: string;
  people: number;
  totalPrice: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string | null;
  bookingId: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.log('[Admin Email] ADMIN_EMAIL not set, skipping notification');
    return { success: true, disabled: true };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return sendMail({
    to: adminEmail,
    subject: `New Booking: ${options.tourName} - ${options.people} guests`,
    html: renderToString(<AdminBookingNotification {...options} appUrl={appUrl} />),
  });
}

export async function sendReviewReplyNotification(options: {
  to: string;
  userName: string;
  tourName: string;
  reply: string;
}) {
  const { to, ...props } = options;

  return sendMail({
    to,
    subject: `New Reply to Your ${options.tourName} Review`,
    html: renderToString(<ReviewReplyNotification {...props} />),
  });
}

export async function sendBookingStatusUpdate(options: {
  to: string;
  customerName: string;
  tourName: string;
  tourDate: string;
  people: number;
  totalPrice: number;
  currency?: string;
  bookingId: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  adminNotes?: string | null;
}) {
  const { to, ...props } = options;

  return sendMail({
    to,
    subject: `Your Booking (${options.bookingId.slice(0, 8)}) - ${options.status === 'CONFIRMED' ? 'Confirmed' : options.status === 'COMPLETED' ? 'Completed' : 'Cancelled'}`,
    html: renderToString(<BookingStatusUpdate {...props} />),
  });
}
