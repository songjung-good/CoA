import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
        appGrey1: "#F1F7F5",
        appGrey2: "#E2E8E6",
      },
    },
  },
  plugins: [],
};
export default config;
