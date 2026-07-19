import { Resend } from 'resend';
import { features } from './flags';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Sharm Cloud Tours <noreply@sharmcloudtours.com>',
      to,
      subject,
      html,
    });

    console.log('[Email] Sent successfully to:', to, 'ID:', data.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('[Email] Error:', error.message);
    return { success: false, error: error.message };
  }
}
