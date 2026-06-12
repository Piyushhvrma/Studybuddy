/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#0a0a0f",
          800: "#0f0f1a",
          700: "#141428",
          600: "#1a1a35",
          500: "#1e1e40",
        },
        accent: {
          purple: "#7c3aed",
          violet: "#8b5cf6",
          indigo: "#6366f1",
          glow: "#a78bfa",
        },
        surface: {
          DEFAULT: "#13131f",
          hover: "#1a1a2e",
          border: "#2a2a4a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "purple-glow": "radial-gradient(ellipse at top, #7c3aed22 0%, transparent 70%)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(124, 58, 237, 0.3)",
        "glow-sm": "0 0 10px rgba(124, 58, 237, 0.2)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
