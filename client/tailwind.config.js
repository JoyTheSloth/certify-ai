/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        "text-primary": "hsl(var(--text))",
        muted: "hsl(var(--muted))",
        stroke: "hsl(var(--stroke))",
        gold: {
          50: '#fbf8eb',
          100: '#f5edcc',
          200: '#ebd79b',
          300: '#debd61',
          400: '#d2a133',
          500: '#c58a24',
          600: '#a76a1b',
          700: '#834c17',
          800: '#6a3c18',
          900: '#583217',
        },
        navy: {
          50: '#f0f5fa',
          100: '#ddecf5',
          200: '#c0deef',
          300: '#94c9e4',
          400: '#62add6',
          500: '#4092c3',
          600: '#2e75a6',
          700: '#275e87',
          800: '#245071',
          900: '#21445f',
        }
      },
      fontFamily: {
        body: ['"Inter"', 'sans-serif'],
        display: ['"Instrument Serif"', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Outfit"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
        alex: ['"Alex Brush"', 'cursive'],
        great: ['"Great Vibes"', 'cursive'],
        cinzel: ['"Cinzel"', 'serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
