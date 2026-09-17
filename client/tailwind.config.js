/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexvia: {
          cream: '#F5F1E7',
          ivory: '#FAF8F2',
          charcoal: '#171713',
          'charcoal-card': '#24241F',
          'charcoal-subtle': '#2E2E28',
          'charcoal-border': '#3A3A32',
          amber: '#F4B33E',
          'amber-hover': '#E5A32E',
          'amber-light': '#FDF5E6',
          beige: '#DDD7C8',
          'beige-dark': '#C5BFAF',
          muted: '#77756D'
        },
        brand: {
          yellow: '#F4B33E',
          'yellow-hover': '#E5A32E',
          'yellow-light': '#FDF5E6',
          'yellow-dark': '#D99824',
          charcoal: '#171713',
          'charcoal-card': '#24241F',
          'charcoal-subtle': '#2E2E28',
          'charcoal-border': '#3A3A32',
          canvas: '#F5F1E7',
          beige: '#DDD7C8',
          muted: '#77756D'
        },
        pastel: {
          green: '#E5F3EB',
          'green-text': '#1D6F42',
          blue: '#E8ECF8',
          'blue-text': '#314482',
          pink: '#F8E8EE',
          'pink-text': '#8A2D4F',
          purple: '#EFE8F8',
          'purple-text': '#5A3185',
          yellow: '#F8F1DC',
          'yellow-text': '#8A6818'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
