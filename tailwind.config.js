/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-purple': '#2D242D',
      },
      fontFamily: {
        sans: ['Pretendard', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        pretendard: ['Pretendard', 'system-ui', 'sans-serif'],
        bitmap: ['"Press Start 2P"', '"DotGothic16"', 'monospace'],
        pixel: ['"DotGothic16"', 'monospace'],
      },
      boxShadow: {
        'bitmap': '4px 4px 0 0 rgba(255, 255, 255, 0.1)',
        'bitmap-lg': '6px 6px 0 0 rgba(255, 255, 255, 0.15)',
        'bitmap-btn': '2px 2px 0 0 currentColor, 4px 4px 0 0 rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
