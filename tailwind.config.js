/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Generična, neutralna tema. Identitet (boje/logo) dolazi kasnije kroz
      // Claude Design — mijenja se preko CSS varijabli u src/index.css.
      colors: {
        brand: {
          DEFAULT: 'var(--color-brand)',
          soft: 'var(--color-brand-soft)',
          contrast: 'var(--color-brand-contrast)',
        },
        // Semantičke boje za razine podnošljivosti
        tol: {
          green: 'var(--color-tol-green)',
          yellow: 'var(--color-tol-yellow)',
          red: 'var(--color-tol-red)',
        },
      },
    },
  },
  plugins: [],
}
