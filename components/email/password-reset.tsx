import { EmailLayout } from './layout';

interface PasswordResetProps {
  userName: string;
  resetUrl: string;
}

export function PasswordReset({ userName, resetUrl }: PasswordResetProps) {
  return (
    <EmailLayout headerTitle="Reset Your Password">
      <p style={{ color: '#333333', fontSize: '16px' }}>
        Dear <strong>{userName}</strong>,
      </p>

      <p style={{ color: '#333333', fontSize: '16px' }}>
        You requested to reset your password. Click the button below to create a new password:
      </p>

      <div style={{ textAlign: 'center' as const, margin: '30px 0' }}>
        <a
          href={resetUrl}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFEA00 100%)',
            color: '#000000',
            padding: '14px 28px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Reset Password
        </a>
      </div>

      <p style={{ color: '#666666', fontSize: '14px' }}>
        This link will expire in 1 hour. If you didn&apos;t request this, please ignore this email.
      </p>

      <p style={{ color: '#999999', fontSize: '12px', marginTop: '30px' }}>
        If the button doesn&apos;t work, copy and paste this link into your browser:<br />
        {resetUrl}
      </p>
    </EmailLayout>
  );
}
