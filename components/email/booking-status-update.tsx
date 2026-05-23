import { ReactNode } from 'react';
import { EmailLayout } from './layout';

interface BookingStatusUpdateProps {
  customerName: string;
  tourName: string;
  tourDate: string;
  people: number;
  totalPrice: number;
  currency?: string;
  bookingId: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  adminNotes?: string | null;
}

export function BookingStatusUpdate({
  customerName,
  tourName,
  tourDate,
  people,
  totalPrice,
  currency = 'EGP',
  bookingId,
  status,
  adminNotes,
}: BookingStatusUpdateProps) {
  const statusColor = status === 'CONFIRMED' ? '#22c55e' : status === 'COMPLETED' ? '#3b82f6' : '#ef4444';
  const statusText = status === 'CONFIRMED' ? 'Confirmed' : status === 'COMPLETED' ? 'Completed' : 'Cancelled';
  const statusMessage = status === 'CONFIRMED'
    ? 'Great news! Your booking has been confirmed by our team.'
    : 'Your booking has been cancelled. Please contact us if you have any questions.';

  return (
    <EmailLayout
      headerTitle={`Booking ${statusText}`}
      headerGradient={statusColor}
      headerColor="#ffffff"
    >
      <p style={{ color: '#333333', fontSize: '16px', marginBottom: '20px' }}>
        Dear <strong>{customerName}</strong>,
      </p>

      <p style={{ color: '#333333', fontSize: '16px' }}>
        {statusMessage}
      </p>

      <div style={{
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px 0',
      }}>
        <h3 style={{ color: '#000000', marginTop: 0 }}>Booking Details</h3>

        <p style={{ color: '#555555', margin: '10px 0' }}>
          <strong>Booking ID:</strong> {bookingId}
        </p>
        <p style={{ color: '#555555', margin: '10px 0' }}>
          <strong>Tour:</strong> {tourName}
        </p>
        <p style={{ color: '#555555', margin: '10px 0' }}>
          <strong>Date:</strong> {tourDate}
        </p>
        <p style={{ color: '#555555', margin: '10px 0' }}>
          <strong>Number of People:</strong> {people}
        </p>
        <p style={{ color: '#555555', margin: '10px 0' }}>
          <strong>Total Price:</strong> {currency} {totalPrice.toLocaleString()}
        </p>
        <p style={{ color: '#555555', margin: '10px 0' }}>
          <strong>Status:</strong>{' '}
          <span style={{ color: statusColor, fontWeight: 'bold' }}>{statusText}</span>
        </p>
      </div>

      {adminNotes && (
        <div style={{
          backgroundColor: '#fffbeb',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px 0',
          borderLeft: '4px solid #FFD700',
        }}>
          <p style={{ color: '#333333', margin: 0 }}>
            <strong>Note from Admin:</strong><br />
            {adminNotes}
          </p>
        </div>
      )}

      <p style={{ color: '#666666', fontSize: '14px', marginTop: '20px' }}>
        If you have any questions, please don&apos;t hesitate to contact us at support@sharmcloudtours.com or call us directly.
      </p>

      <p style={{ color: '#666666', fontSize: '14px' }}>
        Thank you for choosing Sharm Cloud Tours!
      </p>
    </EmailLayout>
  );
}
