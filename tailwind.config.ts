
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
} satisfies Config
