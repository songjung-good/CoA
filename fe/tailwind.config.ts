import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        analyze: "url('/image/urlAnalyze.png')",
        'tailwindbg': "url('/image/tailwindbg.webp')",
        'blur-circle': "url('/image/blur-circle.webp')",
        'header-bg': "url('/image/header-bg.webp')",
      },
      colors: {
        appBlue1: "#48CAF8",
        appBlue2: "#88DDFB",
        appBlue3: "#C8EFFD",
        appBlue4: "#E2F6FE",
        appRed: "#FB88AF",
        appYellow: "#FBEB88",
        appOrange: "#FBA688",
        appGreen: "#DCFB88",
        appPink: "#FB88DD",
        appGrey1: "#F3F6F8",
        appGrey2: "#E2E8E6",
      },
      height: {
        appVh: "calc(100vh - 96px)",
      },
      minWidth: {
        "760px": "760px",
      },
      screens: {
        'xs': "480px"
      }
    },
  },
  plugins: [],
};
export default config;
