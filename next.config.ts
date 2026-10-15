import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // 90 para as thumbs dos projetos, que aparecem grandes
    qualities: [75, 90],
  },
};

export default nextConfig;
