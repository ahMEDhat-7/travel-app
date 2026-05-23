import { EmailLayout } from './layout';

interface VerificationEmailProps {
  userName: string;
  verificationCode: string;
}

export function VerificationEmail({ userName, verificationCode }: VerificationEmailProps) {
  return (
    <EmailLayout headerTitle="Verify Your Email">
      <p style={{ color: '#333333', fontSize: '16px' }}>
        Dear <strong>{userName}</strong>,
      </p>

      <p style={{ color: '#333333', fontSize: '16px' }}>
        Thank you for creating an account with Sharm Cloud Tours. Please use the verification code below to verify your email address:
      </p>

      <div style={{ textAlign: 'center' as const, margin: '30px 0' }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#f9f9f9',
          border: '2px dashed #FFD700',
          borderRadius: '12px',
          padding: '20px 40px',
        }}>
          <p style={{ color: '#999999', fontSize: '14px', margin: '0 0 8px 0' }}>
            Your Verification Code
          </p>
          <p style={{
            color: '#000000',
            fontSize: '48px',
            fontWeight: 'bold',
            letterSpacing: '8px',
            margin: 0,
            fontFamily: 'monospace',
          }}>
            {verificationCode}
          </p>
        </div>
      </div>

      <p style={{ color: '#666666', fontSize: '14px' }}>
        This code will expire in 15 minutes. If you didn&apos;t create an account with Sharm Cloud Tours, please ignore this email.
      </p>

      <p style={{ color: '#999999', fontSize: '12px', marginTop: '30px' }}>
        Sharm Cloud Tours - Your Trusted Sharm El-Sheikh Travel Partner
      </p>
    </EmailLayout>
  );
}
