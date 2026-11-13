import type { Config } from "tailwindcss";

// Design tokens from the approved landing page. The section styles live in app/styles/*.css
// (ported 1:1 from the artifact so nothing shifts); use these tokens for new work.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: ["class", ".theme-dark"],
  corePlugins: { preflight: false }, // the ported styles carry their own reset
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#5266eb", deep: "#2f5be0", checkout: "#2f4bf5" },
        ink: { DEFAULT: "#111111", soft: "#1e1e2a", muted: "#6b6d7a", faint: "#a3a6b3" },
        surface: { card: "#f6f7f9", dark: "#0b0c10", "dark-card": "#131419" },
        mint: { DEFAULT: "#cfe6da", deep: "#188554" },
      },
      fontFamily: {
        sans: ["Geist Sans", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
        pixel: ["Geist Pixel", "monospace"],
      },
      maxWidth: { rail: "84rem" },
      borderRadius: { card: "1rem" },
    },
  },
  plugins: [],
};
export default config;
