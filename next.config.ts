import type { NextConfig } from "next";

/* Same setup as Vaky.me: a fully static export served by Cloudflare Pages. */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
