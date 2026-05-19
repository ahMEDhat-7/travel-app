'use client';

import { useState, use } from 'react';
import { useTheme } from 'next-themes';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I book a tour?',
    answer: 'Simply browse our tours, select your preferred tour, choose your date and number of guests, fill in your details, and complete the booking. You will receive a confirmation email instantly.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards including Visa, Mastercard, and American Express. All payments are processed securely through our payment partners.',
  },
  {
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking free of charge up to 24 hours before the tour date. Cancellations within 24 hours may be subject to a partial fee.',
  },
  {
    question: 'How do I get my booking confirmation?',
    answer: 'After completing your booking, you will receive an instant confirmation email with all the details. You can also view your bookings in your profile page.',
  },
  {
    question: 'Are the tours suitable for families?',
    answer: 'Yes, many of our tours are family-friendly. Each tour page specifies the minimum age requirements and any family-friendly amenities.',
  },
  {
    question: 'What should I bring on the tour?',
    answer: 'Comfortable clothing, sunscreen, and a camera are recommended. Specific requirements vary by tour and will be mentioned in your confirmation email.',
  },
  {
    question: 'Is transportation included?',
    answer: 'Most tours include hotel pickup and drop-off. Check each tour&apos;s "Included" section for specific details.',
  },
  {
    question: 'What happens if the tour is cancelled?',
    answer: 'In the rare event of cancellation by the operator, we will notify you immediately and offer alternative dates or a full refund.',
  },
  {
    question: 'Can I modify my booking after confirmation?',
    answer: 'Yes, you can modify your booking (date, number of guests) subject to availability. Contact our support team for assistance.',
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach us through the contact page, by email, or by phone. Our support team is available 24/7 to assist you.',
  },
];

export default function FAQPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const locale = params.locale;
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--theme-text)] mb-4 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-[var(--theme-text-secondary)] text-center mb-12">
          Find answers to common questions about our tours and booking process
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
              >
                <span className="font-medium text-[var(--theme-text)] pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-[var(--theme-text-muted)] flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-4 pt-2 text-[var(--theme-text-secondary)]">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[var(--theme-text-secondary)] mb-4">
            Can&apos;t find the answer you&apos;re looking for?
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-block px-6 py-3 bg-[var(--theme-btn-primary-bg)] text-[var(--theme-btn-primary-text)] font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}