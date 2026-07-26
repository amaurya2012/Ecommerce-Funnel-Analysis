/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F4EC',
        paperDeep: '#EFEADB',
        navy: {
          DEFAULT: '#17223B',
          deep: '#0F1728',
          soft: 'rgba(23, 34, 59, 0.08)',
        },
        orange: {
          DEFAULT: '#E2793D',
          deep: '#C8611F',
          soft: 'rgba(226, 121, 61, 0.14)',
        },
        card: '#FFFFFF',
        line: '#E6E0D0',
        ink: {
          high: '#1C1B17',
          mid: '#635C4E',
          low: '#A39C88',
        },
        signal: {
          danger: '#C24A3A',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23, 34, 59, 0.04), 0 8px 24px rgba(23, 34, 59, 0.06)',
        'card-hover': '0 4px 10px rgba(23, 34, 59, 0.06), 0 16px 34px rgba(23, 34, 59, 0.1)',
        panel: '0 20px 50px rgba(15, 23, 40, 0.35)',
      },
      keyframes: {
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        riseIn: 'riseIn 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
