import { EmailLayout } from './layout';

interface AdminBookingNotificationProps {
  tourName: string;
  tourDate: string;
  people: number;
  totalPrice: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string | null;
  bookingId: string;
  appUrl: string;
}

export function AdminBookingNotification({
  tourName,
  tourDate,
  people,
  totalPrice,
  contactName,
  contactEmail,
  contactPhone,
  notes,
  bookingId,
  appUrl,
}: AdminBookingNotificationProps) {
  return (
    <EmailLayout
      headerTitle="New Booking Received!"
      headerGradient="linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)"
      headerColor="#ffffff"
    >
      <p style={{ color: '#333333', fontSize: '16px' }}>
        A new booking has been submitted and requires your attention.
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
          <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
        </p>
      </div>

      <div style={{
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px 0',
      }}>
        <h3 style={{ color: '#000000', marginTop: 0 }}>Customer Details</h3>

        <p style={{ color: '#555555', margin: '10px 0' }}>
          <strong>Name:</strong> {contactName}
        </p>
        <p style={{ color: '#555555', margin: '10px 0' }}>
          <strong>Email:</strong> {contactEmail}
        </p>
        <p style={{ color: '#555555', margin: '10px 0' }}>
          <strong>Phone:</strong> {contactPhone}
        </p>
        {notes && (
          <p style={{ color: '#555555', margin: '10px 0' }}>
            <strong>Notes:</strong> {notes}
          </p>
        )}
      </div>

      <p style={{ color: '#666666', fontSize: '14px' }}>
        Please log in to the admin dashboard to confirm or cancel this booking.
      </p>

      <div style={{ textAlign: 'center' as const, margin: '30px 0' }}>
        <a
          href={`${appUrl}/admin/bookings`}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
            color: '#ffffff',
            padding: '14px 28px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          View in Admin Dashboard
        </a>
      </div>
    </EmailLayout>
  );
}
