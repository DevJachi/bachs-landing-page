/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: false },
  // The home page is the approved design, served as one static HTML file so it matches the review artifact exactly.
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/home.html" }] };
  },
};
export default nextConfig;
