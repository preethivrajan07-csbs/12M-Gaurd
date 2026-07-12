/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        banking: {
          primary: '#003366',
          secondary: '#4A90E2',
          accent: '#0056b3',
          success: '#28A745',
          warning: '#FFC107',
          danger: '#DC3545',
          light: '#F5F5F5',
          dark: '#1a1a2e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
