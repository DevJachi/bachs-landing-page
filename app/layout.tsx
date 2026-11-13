import type { Metadata, Viewport } from "next";
import "./styles/base.css";
import "./styles/astro-scoped.css";
import "./styles/site.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bachs — Payments & Billing for Internet Businesses",
  description:
    "Accept payments, automate billing, and monetize your software globally. Checkout, subscriptions, usage billing, tax and settlement to African bank accounts in one platform.",
  icons: { icon: "/images/icon-256.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0c10" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

// Dark is the default. A visitor's choice from the toggle is remembered; this runs before paint so there is no flash.
const themeScript = `(function(){var t=null;try{t=localStorage.getItem("bachs-theme")}catch(e){}if(t!=="light")document.documentElement.classList.add("theme-dark")})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
