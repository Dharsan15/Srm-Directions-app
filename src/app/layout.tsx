import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SRM Campus Directions & Navigation | Kattankulathur (KTR)",
  description: "Instant GPS walking directions across SRM University Kattankulathur campus. Find Canteens, Academic Blocks, Tech Park, Hostels, and Gates directly in Google Maps.",
  keywords: ["SRM University", "SRM KTR", "Campus Directions", "Tech Park", "Java Canteen", "SRM Navigation", "Kattankulathur"],
  authors: [{ name: "SRM IST Campus Navigation Team" }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/srm-logo.png', type: 'image/jpeg' }
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png'
  },
  openGraph: {
    title: "SRM Campus Directions & Navigation (KTR)",
    description: "Scan & navigate to any spot in SRM Kattankulathur with live Google Maps walking directions.",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#071d49"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
