import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  headerGradient?: string;
  headerTitle: string;
  headerColor?: string;
}

export function EmailLayout({
  children,
  headerGradient = 'linear-gradient(135deg, #FFD700 0%, #FFEA00 100%)',
  headerTitle,
  headerColor = '#000000',
}: LayoutProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        backgroundColor: '#f5f5f5',
        margin: 0,
        padding: '20px',
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <div style={{
            background: headerGradient,
            padding: '30px',
            textAlign: 'center' as const,
          }}>
            <h1 style={{
              color: headerColor,
              margin: 0,
              fontSize: '28px',
            }}>
              {headerTitle}
            </h1>
          </div>

          <div style={{ padding: '30px' }}>
            {children}
          </div>

          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '20px',
            textAlign: 'center' as const,
          }}>
            <p style={{
              color: '#888888',
              margin: 0,
              fontSize: '12px',
            }}>
              &copy; 2026 Sharm Cloud Tours. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
