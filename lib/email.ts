import { Resend } from 'resend';
import { features } from './flags';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.EMAIL_FROM || 'Sharm Cloud Tours <support@sharmcloudtours.com>';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!features.EMAIL_ENABLED || !resend) {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('  [DEV MODE] Email disabled — would send to:', to);
    console.log('  Subject:', subject);
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    return { success: true, disabled: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html,
    });

    console.log('[Email] Sent successfully to:', to);
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
            Thank you for booking with Sharm Cloud Tours! Your booking has been confirmed.
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
              Sharm Cloud Tours - Your Trusted Sharm El-Sheikh Travel Partner
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
    subject: 'Reset Your Sharm Cloud Tours Password',
    html,
  });
}

export async function sendVerificationEmail(options: {
  to: string;
  verificationCode: string;
  userName: string;
}) {
  const { to, verificationCode, userName } = options;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #FFD700 0%, #FFEA00 100%); padding: 30px; text-align: center;">
          <h1 style="color: #000000; margin: 0; font-size: 24px;">Verify Your Email</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="color: #333333; font-size: 16px;">
            Dear <strong>${userName}</strong>,
          </p>
          
          <p style="color: #333333; font-size: 16px;">
            Thank you for creating an account with Sharm Cloud Tours. Please use the verification code below to verify your email address:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #f9f9f9; border: 2px dashed #FFD700; border-radius: 12px; padding: 20px 40px;">
              <p style="color: #999999; font-size: 14px; margin: 0 0 8px 0;">Your Verification Code</p>
              <p style="color: #000000; font-size: 48px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: monospace;">${verificationCode}</p>
            </div>
          </div>
          
          <p style="color: #666666; font-size: 14px;">
            This code will expire in 15 minutes. If you didn't create an account with Sharm Cloud Tours, please ignore this email.
          </p>
          
          <p style="color: #999999; font-size: 12px; margin-top: 30px;">
            Sharm Cloud Tours - Your Trusted Sharm El-Sheikh Travel Partner
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const result = await sendEmail({
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
  notes?: string;
  bookingId: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.log('[Admin Email] ADMIN_EMAIL not set, skipping notification');
    return { success: true, disabled: true };
  }

  const { tourName, tourDate, people, totalPrice, contactName, contactEmail, contactPhone, notes, bookingId } = options;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking Received</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Booking Received!</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="color: #333333; font-size: 16px;">
            A new booking has been submitted and requires your attention.
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
              <strong>Total Price:</strong> $${totalPrice.toFixed(2)}
            </p>
          </div>

          <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #000000; margin-top: 0;">Customer Details</h3>
            
            <p style="color: #555555; margin: 10px 0;">
              <strong>Name:</strong> ${contactName}
            </p>
            <p style="color: #555555; margin: 10px 0;">
              <strong>Email:</strong> ${contactEmail}
            </p>
            <p style="color: #555555; margin: 10px 0;">
              <strong>Phone:</strong> ${contactPhone}
            </p>
            ${notes ? `<p style="color: #555555; margin: 10px 0;"><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
          
          <p style="color: #666666; font-size: 14px;">
            Please log in to the admin dashboard to confirm or cancel this booking.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/bookings" style="display: inline-block; background: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%); color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              View in Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `🔔 New Booking: ${tourName} - ${people} guests`,
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
  adminNotes?: string;
}) {
  const { to, customerName, tourName, tourDate, people, totalPrice, currency = 'EGP', bookingId, status, adminNotes } = options;
  
  const statusColor = status === 'CONFIRMED' ? '#22c55e' : status === 'COMPLETED' ? '#3b82f6' : '#ef4444';
  const statusText = status === 'CONFIRMED' ? 'Confirmed' : status === 'COMPLETED' ? 'Completed' : 'Cancelled';
  const statusMessage = status === 'CONFIRMED' 
    ? 'Great news! Your booking has been confirmed by our team.'
    : 'Your booking has been cancelled. Please contact us if you have any questions.';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Status Update</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: ${statusColor}; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Booking ${statusText}</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
            Dear <strong>${customerName}</strong>,
          </p>
          
          <p style="color: #333333; font-size: 16px;">
            ${statusMessage}
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
              <strong>Number of People:</strong> ${people}
            </p>
            <p style="color: #555555; margin: 10px 0;">
              <strong>Total Price:</strong> ${currency} ${totalPrice.toLocaleString()}
            </p>
            <p style="color: #555555; margin: 10px 0;">
              <strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
            </p>
          </div>
          
          ${adminNotes ? `
          <div style="background-color: #fffbeb; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #FFD700;">
            <p style="color: #333333; margin: 0;">
              <strong>Note from Admin:</strong><br/>
              ${adminNotes}
            </p>
          </div>
          ` : ''}
          
          <p style="color: #666666; font-size: 14px; margin-top: 20px;">
            If you have any questions, please don't hesitate to contact us at support@sharmcloudtours.com or call us directly.
          </p>
          
          <p style="color: #666666; font-size: 14px;">
            Thank you for choosing Sharm Cloud Tours!
          </p>
        </div>
        
        <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
          <p style="color: #888888; margin: 0; font-size: 12px;">
            © 2026 Sharm Cloud Tours. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Your Booking (${bookingId.slice(0, 8)}) - ${statusText}`,
    html,
  });
}