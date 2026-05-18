/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Baloo 2', 'cursive'],
        body: ['Be Vietnam Pro', 'sans-serif'],
      },
      colors: {
        cream: '#fffaf5',
        peach: '#ffd9c9',
        melon: '#ffc4d8',
        mint: '#c9f6e6',
        sky: '#d3eaff',
        ink: '#3a3255',
        candy: '#ff6e9e',
        coral: '#ff8b7a',
      },
      boxShadow: {
        candy: '0 10px 28px rgba(255, 110, 158, 0.22)',
        cloud: '0 10px 35px rgba(58, 50, 85, 0.08)',
      },
      borderRadius: {
        soft: '1.2rem',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.96)', opacity: '0.6' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        floaty: 'floaty 3.4s ease-in-out infinite',
        pop: 'pop 220ms ease-out',
      },
    },
  },
  plugins: [],
}
