/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#FDF7F4',
          100: '#FAF0E8',
          200: '#F3DBCE',
          300: '#EABFA9',
          400: '#DF9D7E',
          500: '#E07A5F',
          600: '#C85A32',
          700: '#A34320',
          800: '#83381E',
          900: '#6C301C',
        },
        earth: {
          50: '#FAF7F2',
          100: '#F4F1DE',
          200: '#E6E1C5',
          300: '#D5CDA5',
          400: '#BDB17A',
          500: '#A39556',
          600: '#84763C',
          700: '#655A2D',
          800: '#4A4222',
          900: '#332E18',
        },
        slate: {
          750: '#26343C',
          850: '#1D272E',
          900: '#2F3E46',
        },
        brand: {
          warm: '#FAF7F2',
          card: '#FFFFFF',
          dark: '#1E293B',
          muted: '#64748B',
          accent: '#C85A32',
          secondary: '#354F52',
          green: '#2A9D8F',
          amber: '#E76F51'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(200, 90, 50, 0.08)',
        'warm-md': '0 8px 24px -4px rgba(200, 90, 50, 0.12)',
        'warm-lg': '0 16px 32px -8px rgba(47, 62, 70, 0.15)',
      }
    },
  },
  plugins: [],
};
