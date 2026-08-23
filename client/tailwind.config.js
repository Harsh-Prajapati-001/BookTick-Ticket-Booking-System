/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#64748B",
        accent: "#06B6D4",
        background: "#0F172A",
        surface: "#1E293B",
        text: "#F8FAFC",
      },
      fontFamily: {
        sans: ['"Carl Brown"', 'sans-serif'],
      },
      screens: {
        'mobile': '320px',
        'tablet': '768px',
        'desktop-sm': '1024px',
        'desktop-lg': '1280px',
      },
    },
  },
  plugins: [],
}
