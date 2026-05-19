import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Service | Sharm Cloud Tours',
    description: 'Terms and conditions for using Sharm Cloud Tours booking services.',
  };
}

export default async function TermsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'footer' });

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--theme-text)] mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-[var(--theme-text-secondary)]">
          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the Sharm Cloud Tours website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">2. Use License</h2>
            <p>Permission is granted to temporarily use Sharm Cloud Tours for personal, non-commercial transitory viewing only.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">3. Booking and Payments</h2>
            <p className="mb-2">When you make a booking through Sharm Cloud Tours:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You agree to provide accurate and complete information</li>
              <li>Payment is processed securely through our payment partners</li>
              <li>Bookings are confirmed subject to availability</li>
              <li>You will receive a confirmation email upon successful booking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">4. Cancellation Policy</h2>
            <p className="mb-2">Cancellations are subject to the following terms:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Free cancellation up to 24 hours before the tour date</li>
              <li>Cancellations within 24 hours may be subject to a fee</li>
              <li>No-shows are non-refundable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">5. Limitation of Liability</h2>
            <p>Sharm Cloud Tours acts as a intermediary between customers and tour operators. We are not liable for any damages, injuries, or losses that may occur during the tour.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">6. Intellectual Property</h2>
            <p>All content on this website is the property of Sharm Cloud Tours and may not be reproduced without permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">7. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">8. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us through our contact page.</p>
          </section>

          <p className="text-sm text-[var(--theme-text-muted)] mt-8">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}