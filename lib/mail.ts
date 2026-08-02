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
    return { success: true, data: { id: info.messageId } };
  } catch (error: any) {
    console.error('[Email] Error:', error.message);
    return { success: false, error: error.message };
  }
}
