import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./_sections/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          surface: "rgba(255, 255, 255, 0.3)",
          border: "rgba(255, 255, 255, 0.5)",
          input: "rgba(255, 255, 255, 0.4)",
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
      }
    },
  },
  plugins: [],
};
export default config;