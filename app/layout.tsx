import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grok-Magic-Chat | Epic Tech AI • Cinematic Portal",
  description: "Grok-Magic-Chat: AI-Powered Magic & Creativity Unleashed. An immersive cyberpunk cinematic trailer experience featuring the anti-hero of the neon sprawl. Enter the portal at https://grok-magic-chat.vercel.app",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Grok-Magic-Chat: AI-Powered Magic & Creativity Unleashed",
    description: "The trailer IS the website. Golden hour cyberpunk. One anti-hero. Infinite portal.",
    images: [{ url: "https://picsum.photos/id/1015/1200/630" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        {children}
      </body>
    </html>
  );
}
