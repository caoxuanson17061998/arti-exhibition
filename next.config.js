const path = require("path");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    outputFileTracingIgnores: ["./generated/client/**/*"],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "./global";`,
  },
  // Remove rewrites for production and Vercel deployment
  async rewrites() {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
      return [];
    }
    return [
      {
        source: "/((?!api).*)", // Exclude API routes from proxy
        destination: `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/$1`, // Proxy to API server (dev only)
      },
    ];
  },
  webpack(config) {
    // From https://nanxiaobei.medium.com/disable-css-modules-in-next-js-project-756835172b6e
    // remove css module
    // Find and remove NextJS css rules.
    for (const rule of config.module.rules) {
      if (rule.oneOf) {
        rule.oneOf.forEach((one) => {
          if (!`${one.issuer ? one.issuer.and : "undefined"}`.includes("_app"))
            return;
          one.issuer.and = [path.resolve(__dirname)];
        });
      }
    }

    return config;
  },
};

// Only use standalone output when not on Vercel
if (process.env.VERCEL !== "1") {
  nextConfig.output = "standalone";
}

module.exports = withBundleAnalyzer(nextConfig);
