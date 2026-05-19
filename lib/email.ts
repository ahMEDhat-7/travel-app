import { Resend } from 'resend';
import { features } from './flags';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.EMAIL_FROM || 'Traveloo <noreply@traveloo.com>';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!features.EMAIL_ENABLED || !resend) {
    console.log('[Email] Disabled - would send to:', to, 'subject:', subject);
    return { success: true, disabled: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('[Email] Error:', error.message);
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
  const { to, customerName, tourName, tourDate, people, totalPrice, currency = 'EGP', bookingId } = options;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #FFD700 0%, #FFEA00 100%); padding: 30px; text-align: center;">
          <h1 style="color: #000000; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
            Dear <strong>${customerName}</strong>,
          </p>
          
          <p style="color: #333333; font-size: 16px;">
            Thank you for booking with Traveloo! Your booking has been confirmed.
          </p>
          
          <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #000000; margin-top: 0;">Booking Details</h3>
            
            <p style="color: #555555; margin: 10px 0;">
              <strong>Booking ID:</strong> ${bookingId}
            </p>
            <p style="color: #555555; margin: 10px 0;">
              <strong>Tour:</strong> ${tourName}
            </p>
            <p style="color: #555555; margin: 10px 0;">
              <strong>Date:</strong> ${tourDate}
            </p>
            <p style="color: #555555; margin: 10px 0;">
              <strong>Guests:</strong> ${people}
            </p>
            <p style="color: #555555; margin: 10px 0;">
              <strong>Total Price:</strong> ${currency} ${totalPrice.toFixed(2)}
            </p>
          </div>
          
          <p style="color: #666666; font-size: 14px;">
            We look forward to having you on this tour! If you have any questions, please don't hesitate to contact us.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
              Traveloo - Your Trusted Travel Partner
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Booking Confirmed - ${tourName}`,
    html,
  });
}

export async function sendPasswordReset(options: {
  to: string;
  resetToken: string;
  userName: string;
}) {
  const { to, resetToken, userName } = options;
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #FFD700 0%, #FFEA00 100%); padding: 30px; text-align: center;">
          <h1 style="color: #000000; margin: 0; font-size: 24px;">Reset Your Password</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="color: #333333; font-size: 16px;">
            Dear <strong>${userName}</strong>,
          </p>
          
          <p style="color: #333333; font-size: 16px;">
            You requested to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #FFEA00 100%); color: #000000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666666; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
          
          <p style="color: #999999; font-size: 12px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            ${resetUrl}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: 'Reset Your Traveloo Password',
    html,
  });
}

export async function sendReviewReplyNotification(options: {
  to: string;
  userName: string;
  tourName: string;
  reply: string;
}) {
  const { to, userName, tourName, reply } = options;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Reply to Your Review</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #FFD700 0%, #FFEA00 100%); padding: 30px; text-align: center;">
          <h1 style="color: #000000; margin: 0; font-size: 24px;">New Reply to Your Review</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="color: #333333; font-size: 16px;">
            Dear <strong>${userName}</strong>,
          </p>
          
          <p style="color: #333333; font-size: 16px;">
            The admin has replied to your review for <strong>${tourName}</strong>:
          </p>
          
          <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #FFD700;">
            <p style="color: #333333; margin: 0; font-style: italic;">"${reply}"</p>
          </div>
          
          <p style="color: #666666; font-size: 14px;">
            Thank you for your feedback!
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `New Reply to Your ${tourName} Review`,
    html,
  });
}