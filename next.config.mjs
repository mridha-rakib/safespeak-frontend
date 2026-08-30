import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

function stripTrailingSlashes(value) {
  return value.replace(/\/+$/, "");
}

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => ({
  typedRoutes: true,
  async rewrites() {
    const backendOrigin = stripTrailingSlashes(
      process.env.SAFESPEAK_BACKEND_ORIGIN || "http://127.0.0.1:8000"
    );

    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
      {
        source: "/api/auth/:path*",
        destination: `${backendOrigin}/api/auth/:path*`,
      },
    ];
  },
  ...(phase === PHASE_DEVELOPMENT_SERVER
    ? { distDir: process.env.NEXT_DIST_DIR || ".next-dev" }
    : {}),
});

export default nextConfig;
