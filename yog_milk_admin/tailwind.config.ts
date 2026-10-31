import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#051256", // Deep Royal Navy
          container: "#1f2a6b",
          foreground: "#ffffff",
          "on-container": "#8994db",
        },
        secondary: {
          DEFAULT: "#994700", // Warm Terracotta
          container: "#fc8127", // Saffron Amber
          foreground: "#ffffff",
          "on-container": "#ffdbc8",
        },
        destructive: {
          DEFAULT: "#b91c1c",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f2f3ff",
          foreground: "#5e6272",
        },
        accent: {
          DEFAULT: "#eaedff",
          foreground: "#051256",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#161b2b",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#161b2b",
        },
        dairy: {
          surface: "#faf8ff",
          "surface-low": "#f2f3ff",
          "surface-card": "#ffffff",
          "surface-high": "#e3e7fe",
          "surface-highest": "#dde1f8",
          outline: "#c6c5d2",
          subtle: "#dde1f8",
          dark: "#161b2b",
        },
        status: {
          placed: {
            bg: "#e0f2fe",
            text: "#0369a1",
            dot: "#0284c7",
          },
          confirmed: {
            bg: "#e0e7ff",
            text: "#3730a3",
            dot: "#4f46e5",
          },
          processing: {
            bg: "#fef3c7",
            text: "#b45309",
            dot: "#d97706",
          },
          ready: {
            bg: "#fae8ff",
            text: "#86198f",
            dot: "#c026d3",
          },
          out: {
            bg: "#f3e8ff",
            text: "#7e22ce",
            dot: "#9333ea",
          },
          delivered: {
            bg: "#dcfce7",
            text: "#15803d",
            dot: "#16a34a",
          },
          cancelled: {
            bg: "#fee2e2",
            text: "#b91c1c",
            dot: "#dc2626",
          },
          pending: {
            bg: "#fef3c7",
            text: "#b45309",
            dot: "#d97706",
          },
          paid: {
            bg: "#dcfce7",
            text: "#15803d",
            dot: "#16a34a",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: [
          "var(--font-jakarta)",
          "Plus Jakarta Sans",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;

