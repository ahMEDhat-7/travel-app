import nodemailer from 'nodemailer';
import { features } from './flags';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  if (!features.EMAIL_ENABLED) {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('  [DEV MODE] Email disabled — would send to:', to);
    console.log('  Subject:', subject);
    console.log('═══════════════════════════════════════════════════');
    console.log('');
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
    return { success: true, data: info };
  } catch (error: any) {
    console.error('[Email] Error:', error.message, error.stack);
    return { success: false, error: error.message };
  }
}
