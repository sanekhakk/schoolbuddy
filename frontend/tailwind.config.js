/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Colors picked directly from the SchoolBuddy logo
        navy: {
          DEFAULT: '#0B1F3F',
          50: '#EEF1F7',
          100: '#D7DEEC',
          400: '#33476B',
          700: '#0F2A52',
          900: '#0B1F3F'
        },
        pink: {
          DEFAULT: '#F2547D',
          light: '#FF8CA8'
        },
        orange: {
          DEFAULT: '#F6A623',
          light: '#FFC65C'
        },
        green: {
          DEFAULT: '#5CB85C',
          light: '#8FD18F'
        },
        blue: {
          DEFAULT: '#2E9BD6',
          light: '#6FC1EA'
        },
        purple: {
          DEFAULT: '#7B5CD6',
          light: '#A48CE8'
        },
        surface: {
          light: '#FFFFFF',
          DEFAULT: '#F7F8FC',
          dark: '#0B1426',
          darkCard: '#121C33'
        }
      },
      fontFamily: {
        sans: ['"Baloo 2"', '"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
}
