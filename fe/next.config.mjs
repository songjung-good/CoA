// next.config.js
import path from "path";

// mdEidtor 설정1
import removeImports from "next-remove-imports";

// mdEidtor 설정2
const removeImportsFun = removeImports({
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = removeImportsFun({
  webpack: (config, options) => {
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/robots",
      },
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
});

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "standalone",
// };

// export default nextConfig;
