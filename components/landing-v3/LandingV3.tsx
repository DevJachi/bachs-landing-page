import Script from "next/script";
import { landingV3Markup } from "@/lib/landing-v3/markup";

// Each deploy gets its own script address, so a browser holding an older copy of the chat
// code always loads the new one. Vercel provides the commit; elsewhere the build time stands in.
const VERSION = (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 8) || Date.now().toString(36);

// Landing page v3, rendered exactly as the approved design artifact.
// The markup is static; its interactions run from one classic script once the page is interactive.
export default function LandingV3() {
  return (
    <>
      <div className="lp-v3" dangerouslySetInnerHTML={{ __html: landingV3Markup }} />
      <Script src={`/landing/landing-v3.js?v=${VERSION}`} strategy="afterInteractive" />
    </>
  );
}
