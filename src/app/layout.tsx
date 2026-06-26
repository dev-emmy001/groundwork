import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const GoogleSans = localFont({
  src: [
    {
      path: './font/GoogleSans.ttf',
      weight: '400',
      style: 'normal',
    }
  ],
});


export const metadata: Metadata = {
  title: "Groundwork",
  description: "A proof-of-concept for a local LLM assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html  className={GoogleSans.className} lang="en">
      <head>
        <meta name="viewport" content="width=1280" />
      </head>
      <body className="">
        <div id="desktop-only" style={{
          minWidth: '1024px',
          height: '100vh',
          overflow: 'hidden',
        }}>
          {children}
        </div>
        <div id="mobile-block" style={{
          display: 'none',
        }}>
          <style>{`
            @media (max-width: 1023px) {
              #desktop-only { display: none !important; }
              #mobile-block {
                display: flex !important;
                height: 100vh;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 16px;
                padding: 32px;
                text-align: center;
                background: #F8F9FA;
              }
            }
          `}</style>

          <div style={{
            fontSize: '16px', fontWeight: 600,
            color: '#1C1F26',
          }}>
            Groundwork is desktop only
          </div>
          <div style={{
            fontSize: '13px', color: '#5F6B7A',
            maxWidth: '280px', lineHeight: 1.6,
          }}>
            Open this on a laptop or desktop for the full experience.
          </div>
        </div>
      </body>
    </html>
  );

}
