import { sendMail } from './mail';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layoutHtml(headerTitle: string, bodyHtml: string, headerGradient = 'linear-gradient(135deg, #FFD700 0%, #FFEA00 100%)', headerColor = '#000000') {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background-color:#f5f5f5;margin:0;padding:20px">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden">
    <div style="background:${headerGradient};padding:30px;text-align:center">
      <h1 style="color:${headerColor};margin:0;font-size:28px">${escapeHtml(headerTitle)}</h1>
    </div>
    <div style="padding:30px">${bodyHtml}</div>
    <div style="background-color:#1a1a1a;padding:20px;text-align:center">
      <p style="color:#888888;margin:0;font-size:12px">&copy; ${new Date().getFullYear()} Sharm Cloud Tours. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendVerificationEmail(options: {
  to: string;
  verificationCode: string;
  userName: string;
}) {
  const { to, verificationCode, userName } = options;
  const safeName = escapeHtml(userName);

  const html = layoutHtml('Verify Your Email', `
    <p style="color:#333333;font-size:16px">Dear <strong>${safeName}</strong>,</p>
    <p style="color:#333333;font-size:16px">Thank you for creating an account with Sharm Cloud Tours. Please use the verification code below to verify your email address:</p>
    <div style="text-align:center;margin:30px 0">
      <div style="display:inline-block;background-color:#f9f9f9;border:2px dashed #FFD700;border-radius:12px;padding:20px 40px">
        <p style="color:#999999;font-size:14px;margin:0 0 8px 0">Your Verification Code</p>
        <p style="color:#000000;font-size:48px;font-weight:bold;letter-spacing:8px;margin:0;font-family:monospace">${escapeHtml(verificationCode)}</p>
      </div>
    </div>
    <p style="color:#666666;font-size:14px">This code will expire in 15 minutes. If you didn&apos;t create an account with Sharm Cloud Tours, please ignore this email.</p>
    <p style="color:#999999;font-size:12px;margin-top:30px">Sharm Cloud Tours - Your Trusted Sharm El-Sheikh Travel Partner</p>
  `);

  const result = await sendMail({ to, subject: 'Verify Your Sharm Cloud Tours Account', html });

  if (result.disabled || !result.success) {
    console.log('  [DEV] Verification Code:', verificationCode);
    console.log('═══════════════════════════════════════════════════');
  }

  return result;
}

export async function sendPasswordReset(options: {
  to: string;
  resetToken: string;
  userName: string;
}) {
  const { to, resetToken, userName } = options;
  const safeName = escapeHtml(userName);
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${encodeURIComponent(resetToken)}`;

  const html = layoutHtml('Reset Your Password', `
    <p style="color:#333333;font-size:16px">Dear <strong>${safeName}</strong>,</p>
    <p style="color:#333333;font-size:16px">You requested to reset your password. Click the button below to create a new password:</p>
    <div style="text-align:center;margin:30px 0">
      <a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:linear-gradient(135deg,#FFD700 0%,#FFEA00 100%);color:#000000;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">Reset Password</a>
    </div>
    <p style="color:#666666;font-size:14px">This link will expire in 1 hour. If you didn&apos;t request this, please ignore this email.</p>
    <p style="color:#999999;font-size:12px;margin-top:30px">If the button doesn&apos;t work, copy and paste this link into your browser:<br />${escapeHtml(resetUrl)}</p>
  `);

  return sendMail({ to, subject: 'Reset Your Sharm Cloud Tours Password', html });
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
  const safeCustomerName = escapeHtml(customerName);
  const safeTourName = escapeHtml(tourName);
  const safeTourDate = escapeHtml(tourDate);
  const safeBookingId = escapeHtml(bookingId);

  const html = layoutHtml('Booking Confirmed!', `
    <p style="color:#333333;font-size:16px;margin-bottom:20px">Dear <strong>${safeCustomerName}</strong>,</p>
    <p style="color:#333333;font-size:16px">Thank you for booking with Sharm Cloud Tours! Your booking has been confirmed.</p>
    <div style="background-color:#f9f9f9;border-radius:8px;padding:20px;margin:20px 0">
      <h3 style="color:#000000;margin-top:0">Booking Details</h3>
      <p style="color:#555555;margin:10px 0"><strong>Booking ID:</strong> ${safeBookingId}</p>
      <p style="color:#555555;margin:10px 0"><strong>Tour:</strong> ${safeTourName}</p>
      <p style="color:#555555;margin:10px 0"><strong>Date:</strong> ${safeTourDate}</p>
      <p style="color:#555555;margin:10px 0"><strong>Guests:</strong> ${people}</p>
      <p style="color:#555555;margin:10px 0"><strong>Total Price:</strong> ${escapeHtml(currency)} ${totalPrice.toFixed(2)}</p>
    </div>
    <p style="color:#666666;font-size:14px">We look forward to having you on this tour! If you have any questions, please don&apos;t hesitate to contact us.</p>
    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eeeeee;text-align:center">
      <p style="color:#999999;font-size:12px;margin:0">Sharm Cloud Tours - Your Trusted Sharm El-Sheikh Travel Partner</p>
    </div>
  `);

  return sendMail({ to, subject: `Booking Confirmed - ${escapeHtml(tourName)}`, html });
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
  const { to, customerName, tourName, tourDate, people, totalPrice, currency = 'EGP', bookingId, status, adminNotes } = options;
  const safeCustomerName = escapeHtml(customerName);
  const safeTourName = escapeHtml(tourName);
  const safeTourDate = escapeHtml(tourDate);
  const safeBookingId = escapeHtml(bookingId);

  const statusColor = status === 'CONFIRMED' ? '#22c55e' : status === 'COMPLETED' ? '#3b82f6' : '#ef4444';
  const statusText = status === 'CONFIRMED' ? 'Confirmed' : status === 'COMPLETED' ? 'Completed' : 'Cancelled';
  const statusMessage = status === 'CONFIRMED'
    ? 'Great news! Your booking has been confirmed by our team.'
    : 'Your booking has been cancelled. Please contact us if you have any questions.';
  const subject = `Your Booking (${bookingId.slice(0, 8)}) - ${statusText}`;

  const notesHtml = adminNotes ? `
    <div style="background-color:#fffbeb;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #FFD700">
      <p style="color:#333333;margin:0"><strong>Note from Admin:</strong><br />${escapeHtml(adminNotes)}</p>
    </div>
  ` : '';

  const html = layoutHtml(`Booking ${statusText}`, `
    <p style="color:#333333;font-size:16px;margin-bottom:20px">Dear <strong>${safeCustomerName}</strong>,</p>
    <p style="color:#333333;font-size:16px">${escapeHtml(statusMessage)}</p>
    <div style="background-color:#f9f9f9;border-radius:8px;padding:20px;margin:20px 0">
      <h3 style="color:#000000;margin-top:0">Booking Details</h3>
      <p style="color:#555555;margin:10px 0"><strong>Booking ID:</strong> ${safeBookingId}</p>
      <p style="color:#555555;margin:10px 0"><strong>Tour:</strong> ${safeTourName}</p>
      <p style="color:#555555;margin:10px 0"><strong>Date:</strong> ${safeTourDate}</p>
      <p style="color:#555555;margin:10px 0"><strong>Number of People:</strong> ${people}</p>
      <p style="color:#555555;margin:10px 0"><strong>Total Price:</strong> ${escapeHtml(currency)} ${totalPrice.toLocaleString()}</p>
      <p style="color:#555555;margin:10px 0"><strong>Status:</strong> <span style="color:${statusColor};font-weight:bold">${statusText}</span></p>
    </div>
    ${notesHtml}
    <p style="color:#666666;font-size:14px;margin-top:20px">If you have any questions, please don&apos;t hesitate to contact us at support@sharmcloudtours.com or call us directly.</p>
    <p style="color:#666666;font-size:14px">Thank you for choosing Sharm Cloud Tours!</p>
  `, statusColor, '#ffffff');

  return sendMail({ to, subject, html });
}

export async function sendAdminBookingNotification(options: {
  tourName: string;
  tourDate: string;
  people: number;
  totalPrice: number;
  currency?: string;
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

  const { tourName, tourDate, people, totalPrice, currency = 'EGP', contactName, contactEmail, contactPhone, notes, bookingId } = options;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const safeTourName = escapeHtml(tourName);
  const safeTourDate = escapeHtml(tourDate);
  const safeContactName = escapeHtml(contactName);
  const safeContactEmail = escapeHtml(contactEmail);
  const safeContactPhone = escapeHtml(contactPhone);
  const safeBookingId = escapeHtml(bookingId);

  const notesHtml = notes ? `<p style="color:#555555;margin:10px 0"><strong>Notes:</strong> ${escapeHtml(notes)}</p>` : '';

  const html = layoutHtml('New Booking Received!', `
    <p style="color:#333333;font-size:16px">A new booking has been submitted and requires your attention.</p>
    <div style="background-color:#f9f9f9;border-radius:8px;padding:20px;margin:20px 0">
      <h3 style="color:#000000;margin-top:0">Booking Details</h3>
      <p style="color:#555555;margin:10px 0"><strong>Booking ID:</strong> ${safeBookingId}</p>
      <p style="color:#555555;margin:10px 0"><strong>Tour:</strong> ${safeTourName}</p>
      <p style="color:#555555;margin:10px 0"><strong>Date:</strong> ${safeTourDate}</p>
      <p style="color:#555555;margin:10px 0"><strong>Guests:</strong> ${people}</p>
      <p style="color:#555555;margin:10px 0"><strong>Total Price:</strong> ${escapeHtml(currency)} ${totalPrice.toFixed(2)}</p>
    </div>
    <div style="background-color:#f9f9f9;border-radius:8px;padding:20px;margin:20px 0">
      <h3 style="color:#000000;margin-top:0">Customer Details</h3>
      <p style="color:#555555;margin:10px 0"><strong>Name:</strong> ${safeContactName}</p>
      <p style="color:#555555;margin:10px 0"><strong>Email:</strong> ${safeContactEmail}</p>
      <p style="color:#555555;margin:10px 0"><strong>Phone:</strong> ${safeContactPhone}</p>
      ${notesHtml}
    </div>
    <p style="color:#666666;font-size:14px">Please log in to the admin dashboard to confirm or cancel this booking.</p>
    <div style="text-align:center;margin:30px 0">
      <a href="${escapeHtml(appUrl + '/admin/bookings')}" style="display:inline-block;background:linear-gradient(135deg,#0EA5E9 0%,#0284C7 100%);color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">View in Admin Dashboard</a>
    </div>
  `, 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', '#ffffff');

  return sendMail({ to: adminEmail, subject: `New Booking: ${safeTourName} - ${people} guests`, html });
}
