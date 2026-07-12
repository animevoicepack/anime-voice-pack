import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anime Voice Pack Bundle - 1000+ Premium Anime Audio Samples",
  description: "Download 1000+ ultra-clear anime voice files from 16+ iconic series. Perfect for WhatsApp voice messages, Discord sounds, and premium content creation.",
  keywords: "anime voice pack, anime sound effects, anime audio samples, WhatsApp voice message, Discord soundboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
