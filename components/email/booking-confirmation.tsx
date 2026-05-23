import { EmailLayout } from './layout';

interface BookingConfirmationProps {
  customerName: string;
  tourName: string;
  tourDate: string;
  people: number;
  totalPrice: number;
  currency?: string;
  bookingId: string;
}

export function BookingConfirmation({
  customerName,
  tourName,
  tourDate,
  people,
  totalPrice,
  currency = 'EGP',
  bookingId,
}: BookingConfirmationProps) {
  return (
    <EmailLayout headerTitle="Booking Confirmed!">
      <p style={{ color: '#333333', fontSize: '16px', marginBottom: '20px' }}>
        Dear <strong>{customerName}</strong>,
      </p>

      <p style={{ color: '#333333', fontSize: '16px' }}>
        Thank you for booking with Sharm Cloud Tours! Your booking has been confirmed.
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
          <strong>Guests:</strong> {people}
        </p>
        <p style={{ color: '#555555', margin: '10px 0' }}>
          <strong>Total Price:</strong> {currency} {totalPrice.toFixed(2)}
        </p>
      </div>

      <p style={{ color: '#666666', fontSize: '14px' }}>
        We look forward to having you on this tour! If you have any questions, please don&apos;t hesitate to contact us.
      </p>

      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eeeeee', textAlign: 'center' as const }}>
        <p style={{ color: '#999999', fontSize: '12px', margin: 0 }}>
          Sharm Cloud Tours - Your Trusted Sharm El-Sheikh Travel Partner
        </p>
      </div>
    </EmailLayout>
  );
}
