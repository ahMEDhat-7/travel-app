import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { db } from '@/lib/db';

interface Props {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'booking' });
  
  return {
    title: t('title') || 'Booking Confirmation | Sharm Cloud Tours',
  };
}

export default async function BookingConfirmationPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'booking' });

  try {
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
            duration: true,
            location: true,
          },
        },
      },
    });

    if (!booking) {
      notFound();
    }

    const statusColors: Record<string, string> = {
      PENDING: 'bg-yellow-500/20 text-yellow-500',
      CONFIRMED: 'bg-green-500/20 text-green-500',
      CANCELLED: 'bg-red-500/20 text-red-500',
    };

    const statusLabels: Record<string, string> = {
      PENDING: t('statusPending') || 'Pending',
      CONFIRMED: t('statusConfirmed') || 'Confirmed',
      CANCELLED: t('statusCancelled') || 'Cancelled',
    };

    return (
      <div className="min-h-screen bg-[var(--theme-bg)] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[var(--theme-card)] rounded-2xl border border-[var(--theme-border)] overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-400 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">
                {t('thankYou') || 'Thank You for Your Booking!'}
              </h1>
              <p className="text-white/80 mt-2">
                {t('bookingReceived') || 'Your booking has been received and is being processed.'}
              </p>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-[var(--theme-text-muted)]">
                    {t('bookingId') || 'Booking ID'}
                  </p>
                  <p className="font-mono text-lg font-semibold text-[var(--theme-text)]">
                    {booking.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[booking.status]}`}>
                  {statusLabels[booking.status]}
                </div>
              </div>

              <div className="border-t border-[var(--theme-border)] pt-6 mb-6">
                <h2 className="text-lg font-semibold text-[var(--theme-text)] mb-4">
                  {t('tourDetails') || 'Tour Details'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="aspect-video bg-[var(--theme-bg-tertiary)] rounded-lg overflow-hidden">
                    {Array.isArray(booking.tour.images) && booking.tour.images[0] ? (
                      <img 
                        src={booking.tour.images[0] as string} 
                        alt={booking.tour.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--theme-text-muted)]">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[var(--theme-text-muted)]">{t('tour') || 'Tour'}</p>
                      <p className="font-semibold text-[var(--theme-text)]">{booking.tour.title}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[var(--theme-text-muted)]">{t('date') || 'Date'}</p>
                        <p className="text-[var(--theme-text)]">
                          {new Date(booking.tourDate).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--theme-text-muted)]">{t('guests') || 'Guests'}</p>
                        <p className="text-[var(--theme-text)]">{booking.people}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[var(--theme-text-muted)]">{t('duration') || 'Duration'}</p>
                        <p className="text-[var(--theme-text)]">{booking.tour.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--theme-text-muted)]">{t('location') || 'Location'}</p>
                        <p className="text-[var(--theme-text)]">{booking.tour.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--theme-border)] pt-6 mb-6">
                <h2 className="text-lg font-semibold text-[var(--theme-text)] mb-4">
                  {t('contactInfo') || 'Contact Information'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[var(--theme-text-muted)]">{t('name') || 'Name'}</p>
                    <p className="text-[var(--theme-text)]">{booking.contactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--theme-text-muted)]">{t('email') || 'Email'}</p>
                    <p className="text-[var(--theme-text)]">{booking.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--theme-text-muted)]">{t('phone') || 'Phone'}</p>
                    <p className="text-[var(--theme-text)]">{booking.contactPhone}</p>
                  </div>
                  {booking.notes && (
                    <div>
                      <p className="text-sm text-[var(--theme-text-muted)]">{t('notes') || 'Notes'}</p>
                      <p className="text-[var(--theme-text)]">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-[var(--theme-border)] pt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-[var(--theme-text)]">
                    {t('totalPrice') || 'Total Price'}
                  </h2>
                  <p className="text-2xl font-bold text-amber-500">
                    ${booking.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link 
              href={`/${locale}/tours/${booking.tour.slug}`}
              className="px-6 py-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] hover:bg-[var(--theme-bg-tertiary)] transition-colors"
            >
              {t('viewTour') || 'View Tour'}
            </Link>
            <Link 
              href={`/${locale}/tours`}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              {t('browseMore') || 'Browse More Tours'}
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Booking page error:', error);
    notFound();
  }
}