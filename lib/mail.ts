import nodemailer from 'nodemailer';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

function createTransporter() {
  const email = process.env.GMAIL_EMAIL;
  const password = process.env.GMAIL_APP_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('');
    console.warn('═══════════════════════════════════════════════════');
    console.warn('  [WARNING] Email is DISABLED — GMAIL_EMAIL or');
    console.warn('  GMAIL_APP_PASSWORD is not set.');
    console.warn('  Emails will NOT be sent in production!');
    console.warn('  Would send to:', to);
    console.warn('  Subject:', subject);
    console.warn('═══════════════════════════════════════════════════');
    console.warn('');
    return { success: true, disabled: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Sharm Cloud Tours" <${process.env.GMAIL_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log('[Email] Sent successfully to:', to, 'ID:', info.messageId);
    return { success: true, data: { id: info.messageId } };
  } catch (error: any) {
    console.error('[Email] Error:', error.message);
    return { success: false, error: error.message };
  }
}
