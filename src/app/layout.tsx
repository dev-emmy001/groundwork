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
    <html
      lang="en"
       className={`${GoogleSans.className} font-sans h-full antialiased`}
    >
      <body className="min-h-full tracking-tighter flex flex-col">{children}</body>
    </html>
  );
}
