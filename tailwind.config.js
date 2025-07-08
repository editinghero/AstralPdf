export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5e6ff",
          100: "#e0c2ff",
          200: "#c894ff",
          300: "#b166ff",
          400: "#9933ff",
          500: "#8000ff",
          600: "#6600cc",
          700: "#4d0099",
          800: "#330066",
          900: "#1a0033"
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}; 