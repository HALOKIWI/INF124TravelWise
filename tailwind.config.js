/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Deep teal/navy ink anchored on Celadon Blue
        ink: {
          900: '#0a2433',
          800: '#0f3147',
          700: '#143f5b',
          600: '#1c5478',
        },
        // Brand: Celadon Blue (#1B729D)
        brand: {
          50: '#eff7fb',
          100: '#daedf4',
          200: '#b8dbe8',
          300: '#87c1d6',
          400: '#4ea3bf',
          500: '#1B729D',
          600: '#155f86',
          700: '#114e6f',
          800: '#0e3f5a',
          900: '#0c344a',
        },
        // Green Caper (#B1D573)
        caper: {
          50: '#f6fbeb',
          100: '#ebf7d4',
          200: '#dcf0b3',
          300: '#c9e88c',
          400: '#B1D573',
          500: '#9bc855',
          600: '#7eaa3f',
          700: '#608233',
          800: '#4a662b',
          900: '#3a5125',
        },
        // Saffron Yellow (#EFCB59)
        saffron: {
          50: '#fdf8e6',
          100: '#fbf0c2',
          200: '#f6e293',
          300: '#f3d875',
          400: '#EFCB59',
          500: '#e6b833',
          600: '#c69624',
          700: '#9c731f',
          800: '#7c5a1c',
          900: '#634819',
        },
        // Dolly Pink (#FA9397)
        dolly: {
          50: '#fff0f1',
          100: '#ffe1e3',
          200: '#fcc1c4',
          300: '#fcaaad',
          400: '#FA9397',
          500: '#f06f74',
          600: '#d6494f',
          700: '#b1383d',
          800: '#8d2d31',
          900: '#702529',
        },
        // Macadamia Brown (#D7C6AC)
        sand: {
          DEFAULT: '#D7C6AC',
          50: '#faf6ee',
          100: '#f3ecdc',
          200: '#ead9be',
          300: '#D7C6AC',
          400: '#c1a87f',
          500: '#a98a5d',
          600: '#8a6f49',
          700: '#69553a',
          800: '#4f4030',
          900: '#3a2f25',
        },
      },
      boxShadow: {
        glow: '0 10px 40px -10px rgba(27, 114, 157, 0.45)',
        card: '0 8px 30px -8px rgba(10, 36, 51, 0.18)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, rgba(10,36,51,0.55) 0%, rgba(10,36,51,0.15) 60%, rgba(10,36,51,0.0) 100%)',
        'dash-gradient':
          'linear-gradient(135deg, #0a2433 0%, #0f3147 40%, #143f5b 100%)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-mid': 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
