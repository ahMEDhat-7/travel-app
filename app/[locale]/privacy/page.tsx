import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy | Sharm Cloud Tours',
    description: 'Learn how Sharm Cloud Tours protects and handles your personal data.',
  };
}

export default async function PrivacyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'footer' });

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--theme-text)] mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-[var(--theme-text-secondary)]">
          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">1. Information We Collect</h2>
            <p className="mb-2">We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, phone)</li>
              <li>Booking information (tour preferences, travel dates)</li>
              <li>Payment information (processed securely via third parties)</li>
              <li>Communications with our support team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">2. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and confirm your bookings</li>
              <li>Send booking confirmations and updates</li>
              <li>Provide customer support</li>
              <li>Improve our services and user experience</li>
              <li>Send promotional emails (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">3. Data Sharing</h2>
            <p className="mb-2">We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tour operators (necessary for booking fulfillment)</li>
              <li>Payment processors (for transaction processing)</li>
              <li>Service providers (for email, analytics, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">4. Cookies and Tracking</h2>
            <p>We use cookies and similar tracking technologies to enhance your browsing experience and analyze site traffic.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">5. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">6. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">7. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">8. Children&apos;s Privacy</h2>
            <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">9. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-3">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through our contact page.</p>
          </section>

          <p className="text-sm text-[var(--theme-text-muted)] mt-8">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}