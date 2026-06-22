/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#050816',
        accent: '#00E5FF',
        secondary: '#7C3AED',
        muted: '#A1A1AA',
        glass: 'rgba(255,255,255,0.08)',
        glassBorder: 'rgba(255,255,255,0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
