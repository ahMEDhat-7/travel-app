import './globals.css';

export const metadata = {
  title: 'Sharm Cloud Tours',
  description: 'Best tours and travel experiences in Sharm El-Sheikh',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}