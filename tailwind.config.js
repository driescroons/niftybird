module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 0.2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}