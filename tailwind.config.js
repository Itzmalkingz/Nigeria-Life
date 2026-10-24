/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Nigeria Life Brand Palette
        'navy': '#202331',
        'life-red': '#F0443E',
        'choice-blue': '#2764D8',
        'warm-ivory': '#F5F1E8',
        'dark-bg': '#11131C',
        'muted-text': '#626776',
        'earth-accent': '#8A6048',
        // Semantic aliases
        'brand-primary': '#202331',
        'brand-accent': '#F0443E',
        'brand-secondary': '#2764D8',
        'surface-light': '#F5F1E8',
        'surface-dark': '#11131C',
        'text-muted': '#626776',
        // Interface tokens (dark world / auth surfaces)
        'abyss': '#0B0E16',
        'surface': '#0F1622',
        'surface-raised': '#141C2A',
        'input-bg': '#171F2C',
        'edge': 'rgba(148, 163, 184, 0.12)',
        'edge-strong': 'rgba(148, 163, 184, 0.22)',
        'text-dim': '#94A0B4',
        'success': '#3FB27F',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'display-sm': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'brand': '0.75rem',
        'brand-lg': '1rem',
        'brand-xl': '1.5rem',
        'control': '0.75rem',
        'panel': '1.25rem',
      },
      boxShadow: {
        'brand': '0 4px 14px rgba(32, 35, 49, 0.12)',
        'brand-lg': '0 10px 40px rgba(32, 35, 49, 0.18)',
        'focus': '0 0 0 3px rgba(39, 100, 216, 0.4)',
        'panel': '0 24px 80px rgba(0, 0, 0, 0.55)',
        'glow-blue': '0 0 40px rgba(39, 100, 216, 0.28)',
      },
      transitionDuration: {
        'brand': '200ms',
      },
      transitionTimingFunction: {
        'brand': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}