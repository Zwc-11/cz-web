/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#050505',
        surface: '#0a0a0a',
        glass: 'rgba(255,255,255,0.04)',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'border-sweep': 'borderSweep 4s linear infinite',
        orbit: 'orbit 20s linear infinite',
        'spin-slow': 'spin 24s linear infinite',
      },
      keyframes: {
        borderSweep: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(var(--orbit-r)) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
};
