/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B6B",
          dark: "#FF5252",
          light: "#FF8E8E",
        },
        secondary: {
          DEFAULT: "#4ECDC4",
          dark: "#45B7AE",
          light: "#6ED7D0",
        },
        accent: {
          DEFAULT: "#FFE66D",
          dark: "#FFD93D",
          light: "#FFF0A3",
        },
        background: {
          DEFAULT: "#F7F7F7",
          dark: "#E9E9E9",
        },
        text: {
          DEFAULT: "#2D3436",
          light: "#636E72",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
