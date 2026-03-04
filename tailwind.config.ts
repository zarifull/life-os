import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'liquid': '0 20px 50px rgba(0, 0, 0, 0.1), inset 0px 2px 2px rgba(255, 255, 255, 0.5)',
        'button-inner': 'inset 0px 1px 4px rgba(255, 255, 255, 0.8), 0px 4px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;