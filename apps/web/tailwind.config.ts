import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101418",
        sand: "#f6f2e8",
        accent: "#d96c06",
        pine: "#1b4332",
      },
    },
  },
  plugins: [],
};

export default config;

