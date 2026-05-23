import { Resend } from 'resend';
import { features } from './flags';
import { VerificationEmail } from '@/components/email/verification-email';
import { BookingConfirmation } from '@/components/email/booking-confirmation';
import { PasswordReset } from '@/components/email/password-reset';
import { BookingStatusUpdate } from '@/components/email/booking-status-update';
import { ReviewReplyNotification } from '@/components/email/review-reply-notification';
import { AdminBookingNotification } from '@/components/email/admin-booking-notification';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.EMAIL_FROM || 'Sharm Cloud Tours <support@sharmcloudtours.com>';

interface EmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
}

async function sendEmail({ to, subject, react }: EmailOptions) {
  if (!features.EMAIL_ENABLED || !resend) {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('  [DEV MODE] Email disabled — would send to:', to);
    console.log('  Subject:', subject);
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    return { success: true, disabled: true };
  }

  console.log('[Email] Attempting to send to:', to, 'from:', fromEmail);

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      react,
    });

    if (error) {
      console.error('[Email] Resend API returned error:', JSON.stringify(error));
      return { success: false, error: error.message };
    }

    console.log('[Email] Sent successfully to:', to, 'ID:', data?.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('[Email] Exception while sending:', error.message, error.stack);
    return { success: false, error: error.message };
  }
}

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

  return sendEmail({
    to,
    subject: `Booking Confirmed - ${options.tourName}`,
    react: <BookingConfirmation {...props} />,
  });
}

export async function sendPasswordReset(options: {
  to: string;
  resetToken: string;
  userName: string;
}) {
  const { to, resetToken, userName } = options;
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

  return sendEmail({
    to,
    subject: 'Reset Your Sharm Cloud Tours Password',
    react: <PasswordReset userName={userName} resetUrl={resetUrl} />,
  });
}

export async function sendVerificationEmail(options: {
  to: string;
  verificationCode: string;
  userName: string;
}) {
  const { to, verificationCode, userName } = options;

  const result = await sendEmail({
    to,
    subject: 'Verify Your Sharm Cloud Tours Account',
    react: <VerificationEmail userName={userName} verificationCode={verificationCode} />,
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

  return sendEmail({
    to: adminEmail,
    subject: `New Booking: ${options.tourName} - ${options.people} guests`,
    react: <AdminBookingNotification {...options} appUrl={appUrl} />,
  });
}

export async function sendReviewReplyNotification(options: {
  to: string;
  userName: string;
  tourName: string;
  reply: string;
}) {
  const { to, ...props } = options;

  return sendEmail({
    to,
    subject: `New Reply to Your ${options.tourName} Review`,
    react: <ReviewReplyNotification {...props} />,
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

  return sendEmail({
    to,
    subject: `Your Booking (${options.bookingId.slice(0, 8)}) - ${options.status === 'CONFIRMED' ? 'Confirmed' : options.status === 'COMPLETED' ? 'Completed' : 'Cancelled'}`,
    react: <BookingStatusUpdate {...props} />,
  });
}
