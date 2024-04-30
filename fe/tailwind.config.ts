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
        appGrey1: "#F3F6F8",
        appGrey2: "#E2E8E6",
      },
      height: {
        appVh: "calc(100vh - 80px)",
      },
      boxShadow: {
        appShadow:
          "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;",
        a3: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
      },
    },
  },
  plugins: [],
};
export default config;
