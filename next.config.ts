import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // www and the old Vercel alias land on the canonical domain. /studio stays on
  // the Vercel alias until romanczuk.online is added to Sanity's CORS origins.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.romanczuk.online" }],
        destination: "https://romanczuk.online/:path*",
        permanent: true,
      },
      {
        source: "/:path((?!studio).*)",
        has: [{ type: "host" as const, value: "romanczuk.vercel.app" }],
        destination: "https://romanczuk.online/:path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
