import { EmailLayout } from './layout';

interface ReviewReplyNotificationProps {
  userName: string;
  tourName: string;
  reply: string;
}

export function ReviewReplyNotification({ userName, tourName, reply }: ReviewReplyNotificationProps) {
  return (
    <EmailLayout headerTitle="New Reply to Your Review">
      <p style={{ color: '#333333', fontSize: '16px' }}>
        Dear <strong>{userName}</strong>,
      </p>

      <p style={{ color: '#333333', fontSize: '16px' }}>
        The admin has replied to your review for <strong>{tourName}</strong>:
      </p>

      <div style={{
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px 0',
        borderLeft: '4px solid #FFD700',
      }}>
        <p style={{ color: '#333333', margin: 0, fontStyle: 'italic' }}>
          &ldquo;{reply}&rdquo;
        </p>
      </div>

      <p style={{ color: '#666666', fontSize: '14px' }}>
        Thank you for your feedback!
      </p>
    </EmailLayout>
  );
}
