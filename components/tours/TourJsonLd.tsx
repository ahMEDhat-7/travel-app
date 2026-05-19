interface TourJsonLdProps {
  tour: {
    name: string;
    description: string;
    image?: string;
    price?: number;
    rating?: number;
    reviewCount?: number;
    location?: string;
    duration?: string;
  };
}

export default function TourJsonLd({ tour }: TourJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: tour.name,
    description: tour.description,
    image: tour.image,
    ...(tour.price && {
      offers: {
        '@type': 'Offer',
        price: tour.price,
        priceCurrency: 'USD',
      },
    }),
    ...(tour.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tour.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: tour.reviewCount || 0,
      },
    }),
    ...(tour.location && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: tour.location,
        addressCountry: 'EG',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}