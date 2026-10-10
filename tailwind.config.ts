import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: { "2xl": "1240px" },
    },
    extend: {
      colors: {
        navy: {
          950: "#050B14",
          900: "#07111F",
          850: "#0A1523",
          800: "#0F172A",
          700: "#16223B",
          600: "#1D2D4A",
          500: "#27395C",
        },
        accent: {
          blue: "#4D8DFF",
          cyan: "#2AD4E8",
          teal: "#2DD4BF",
          violet: "#8B5CF6",
          pink: "#C084FC",
        },
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Sora", "Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(148,163,184,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.055) 1px, transparent 1px)",
        "brand-gradient": "linear-gradient(100deg, #4D8DFF 0%, #2AD4E8 55%, #8B5CF6 110%)",
        "brand-gradient-soft": "linear-gradient(120deg, rgba(77,141,255,0.14), rgba(42,212,232,0.10), rgba(139,92,246,0.14))",
      },
      boxShadow: {
        glow: "0 10px 44px -12px rgba(77,141,255,0.5)",
        "glow-cyan": "0 10px 40px -14px rgba(42,212,232,0.45)",
        card: "0 24px 70px -34px rgba(2,8,20,0.85)",
        "card-hover": "0 30px 80px -34px rgba(77,141,255,0.28)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-soft": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "grow-line": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-soft": "float-soft 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        shimmer: "shimmer 2.6s linear infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
        "grow-line": "grow-line 1.4s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      typography: undefined,
    },
  },
  plugins: [],
};

export default config;
