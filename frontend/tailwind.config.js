/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B1F3A', // Navy
          light: '#1A365D',
          dark: '#051124',
        },
        gold: {
          DEFAULT: '#D4AF37', // Gold Accent
          light: '#F3E5AB',
          hover: '#C29F32',
        },
        cream: {
          DEFAULT: '#F8F5EE', // Cream Background
          dark: '#EBE5D9',
        },
        dark: {
          DEFAULT: '#1E1E1E', // Dark Text
          light: '#333333',
        },
        teal: {
          DEFAULT: '#0F6C73', // Teal Accent
          light: '#1699A3',
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(11, 31, 58, 0.08)',
        'premium-hover': '0 20px 40px -15px rgba(11, 31, 58, 0.15)',
        'glass': '0 8px 32px 0 rgba(11, 31, 58, 0.05)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        'premium-gradient': 'linear-gradient(135deg, #0B1F3A 0%, #1A365D 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      spacing: {
        'section': '8rem',
        'section-mobile': '4rem',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      }
    },
  },
  plugins: [],
}
