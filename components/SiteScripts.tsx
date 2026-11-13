"use client";

import { useEffect } from "react";
import { initSite } from "@/lib/interactions";

// Wires up every interactive part of the page once it has rendered: nav, theme toggle, showcase tabs,
// logo marquee, the Gap scroll effect, bento visuals, platform scenes, SDK tabs, testimonials, FAQ and the globe.
export default function SiteScripts() {
  useEffect(() => {
    initSite();
  }, []);
  return null;
}
