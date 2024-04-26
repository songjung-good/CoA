// next.config.js
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "standalone",
// };

// export default nextConfig;
