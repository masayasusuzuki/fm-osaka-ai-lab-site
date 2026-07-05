import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF/WebP へ自動変換 + デバイス幅に応じたリサイズ配信（FV 2MB → 数十〜百KB台になる）
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.microcms-assets.io" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
    proxyClientMaxBodySize: "25mb",
  },
};

export default nextConfig;
