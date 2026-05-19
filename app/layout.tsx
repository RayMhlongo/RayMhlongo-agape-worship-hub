import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Agape Worship Hub",
  description: "Church worship team management, setlists, scheduling, PDFs, and AI assistance.",
  manifest: "/manifest.json",
  icons: {
    icon: "/agape-logo.jpeg",
    apple: "/agape-logo.jpeg"
  }
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>{children}</body>
    </html>
  );
}
