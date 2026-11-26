import Script from "next/script";
import { landingV3Markup } from "@/lib/landing-v3/markup";

// Landing page v3, rendered exactly as the approved design artifact.
// The markup is static; its interactions run from one classic script once the page is interactive.
export default function LandingV3() {
  return (
    <>
      <div className="lp-v3" dangerouslySetInnerHTML={{ __html: landingV3Markup }} />
      <Script src="/landing/landing-v3.js" strategy="afterInteractive" />
    </>
  );
}
