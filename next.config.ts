import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Yalnızca telif açısından serbest kullanımlı Pexels fotoğrafları (bkz.
    // legacy/DATA-KURALLARI.md ve src/types/news.ts > newsPhotoSchema).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
