/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    light: '#14b8a6',
                    DEFAULT: '#14b8a6',
                    dark: '#0d9488',
                },
                accent: {
                    light: '#fb923c',
                    DEFAULT: '#fb923c',
                }
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
                'super': '32px',
            },
            boxShadow: {
                'teal': '0 10px 25px -5px rgba(20, 184, 166, 0.2), 0 8px 10px -6px rgba(20, 184, 166, 0.2)',
            },
        },
    },
    plugins: [],
}
