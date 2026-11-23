/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vice: {
          bg: '#080A12',
          dark: '#101421',
          card: '#151B2B',
          'card-hover': '#1B2338',
          pink: '#FF4FA3',
          'pink-hover': '#FF2E8E',
          cyan: '#35DDF5',
          'cyan-hover': '#1ACDE7',
          orange: '#FF9B61',
          'orange-hover': '#FF8642',
          purple: '#A855F7',
          muted: '#A3A9BA',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-pink': 'rgba(255, 79, 163, 0.35)',
          'border-cyan': 'rgba(53, 221, 245, 0.35)',
        }
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        anton: ['"Anton"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 25px -5px rgba(255, 79, 163, 0.5)',
        'neon-cyan': '0 0 25px -5px rgba(53, 221, 245, 0.5)',
        'neon-orange': '0 0 25px -5px rgba(255, 155, 97, 0.5)',
        'glow-sm': '0 0 10px rgba(255, 79, 163, 0.3)',
        'glow-cyan-sm': '0 0 10px rgba(53, 221, 245, 0.3)',
        'card-glow': '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'vice-gradient': 'linear-gradient(135deg, #FF4FA3 0%, #FF9B61 50%, #35DDF5 100%)',
        'sunset-gradient': 'linear-gradient(180deg, rgba(255, 79, 163, 0.25) 0%, rgba(255, 155, 97, 0.15) 50%, transparent 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(255, 79, 163, 0.18) 0%, rgba(53, 221, 245, 0.08) 45%, transparent 70%)',
      },
      letterSpacing: {
        'cinematic': '0.25em',
        'cinematic-wide': '0.35em',
      }
    },
  },
  plugins: [],
};
