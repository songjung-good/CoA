// next.config.js
import path from 'path';
/** @type {import('next').NextConfig} */

import removeImports from 'next-remove-imports'; // mdEidtor 설정1

const removeImportsFun = removeImports({ 
  options: { }, 
}) // mdEidtor 설정2

export default removeImportsFun({ 
  webpack: (config, options) => {
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
});




// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "standalone",
// };

// export default nextConfig;
