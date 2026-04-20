import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Grok Magic • The Grok-4 interface that finally matches",
  description: "Private. Beautiful. Streaming intelligence with voice that works. One payment for lifetime access to the UI that doesn't suck.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Grok Magic • The Grok-4 interface that finally matches",
    description: "Private. Beautiful. Streaming intelligence with voice that works.",
    images: [{ url: "https://grok-magic-chat.vercel.app/og.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          async
          src="https://js.stripe.com/v3/buy-button.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
