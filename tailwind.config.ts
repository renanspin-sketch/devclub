import type { Config } from "tailwindcss";

/**
 * Espelha 1:1 os tokens definidos em DESIGN-SYSTEM.md.
 * Qualquer valor usado em um componente deve referenciar um token daqui —
 * nunca um valor mágico inline.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        canvas: "#0A0A0F",
        surface: {
          DEFAULT: "#13131A",
          elevated: "#1C1C26",
        },
        border: {
          DEFAULT: "#27272F",
          strong: "#3A3A46",
        },
        text: {
          primary: "#F5F5F7",
          secondary: "#A1A1AA",
          muted: "#6B7280",
        },
        accent: {
          violet: "#7C5CFC",
          cyan: "#22D3EE",
        },
        state: {
          success: "#34D399",
          warning: "#FBBF24",
          danger: "#F87171",
        },
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #7C5CFC 0%, #22D3EE 100%)",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "2xl": ["clamp(1.5rem, 1.3rem + 1vw, 1.875rem)", { lineHeight: "1.25" }],
        "3xl": ["clamp(1.875rem, 1.5rem + 1.8vw, 2.5rem)", { lineHeight: "1.2" }],
        "4xl": ["clamp(2.25rem, 1.7rem + 2.7vw, 3.5rem)", { lineHeight: "1.1" }],
        "5xl": ["clamp(2.75rem, 1.9rem + 4vw, 4.5rem)", { lineHeight: "1.05" }],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        sm: "0 1px 2px rgb(0 0 0 / 0.4)",
        md: "0 4px 12px rgb(0 0 0 / 0.35)",
        lg: "0 12px 32px rgb(0 0 0 / 0.4)",
        "glow-violet": "0 0 24px rgb(124 92 252 / 0.35)",
        "glow-cyan": "0 0 24px rgb(34 211 238 / 0.25)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
        slower: "600ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        container: "1320px",
      },
    },
  },
  plugins: [],
} satisfies Config;
