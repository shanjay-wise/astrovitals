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
        space: {
          950: '#05070D', // Dark mode background
          900: '#0B1220', // Panels dark
          800: '#111B30',
          700: '#1A2742', // Borders dark
          600: '#263859',
          500: '#3A5078',
        },
        nasa: {
          blue: '#0B3D91',
          blueLight: '#1E6BFF',
          red: '#FC3D21',
        },
        status: {
          nominal: '#22C55E',
          caution: '#F59E0B',
          warning: '#F59E0B',
          critical: '#EF4444',
          nodata: '#64748B',
          info: '#1E6BFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-critical': 'glowCritical 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowCritical: {
          '0%': { boxShadow: '0 0 5px rgba(239, 68, 68, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
