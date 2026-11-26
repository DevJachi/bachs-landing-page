import type { Metadata, Viewport } from "next";
import "./styles/landing-v3.css";
import "./globals.css";
import { landingV3FontLinks } from "@/lib/landing-v3/fonts";

export const metadata: Metadata = {
  title: "Bachs — The money platform for businesses and agents",
  description:
    "Get paid by customers anywhere. They pay by bank transfer, mobile money or stablecoins, and you get the money in your account, in your currency.",
  icons: { icon: "/images/icon-256.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {landingV3FontLinks.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
