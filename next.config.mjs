/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — produces a fully static site in `out/`.
  output: 'export',
  reactStrictMode: true,
  // next/image optimization is unavailable in a static export.
  images: {
    unoptimized: true,
  },
  // Emit `/route/index.html` so static hosts resolve clean URLs.
  trailingSlash: true,
};

export default nextConfig;
