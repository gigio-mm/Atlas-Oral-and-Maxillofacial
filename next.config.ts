import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    position: 'bottom-right',
  } as any,
};

export default nextConfig;
