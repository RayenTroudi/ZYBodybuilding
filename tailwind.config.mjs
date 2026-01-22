/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors from Logo
        primary: {
          DEFAULT: '#CC1303', // Main Engineering Orange
          50: '#FEC9C4',
          100: '#FD9288',
          200: '#FC5C4D',
          300: '#FB2512',
          400: '#CC1303',
          500: '#CC1303',
          600: '#A51003',
          700: '#7C0C02',
          800: '#520801',
          900: '#290401',
        },
        secondary: {
          DEFAULT: '#C30B02', // Accent Engineering Orange
          50: '#FEC4C1',
          100: '#FE8A84',
          200: '#FD4F46',
          300: '#FD1509',
          400: '#C30B02',
          500: '#C30B02',
          600: '#9E0902',
          700: '#760701',
          800: '#4F0501',
          900: '#270200',
        },
        accent: {
          DEFAULT: '#B80C02', // Deep Orange
          50: '#FEC2BE',
          100: '#FE847E',
          200: '#FD473D',
          300: '#F60F02',
          400: '#B80C02',
          500: '#B80C02',
          600: '#910901',
          700: '#6D0601',
          800: '#490401',
          900: '#240200',
        },
        dark: {
          DEFAULT: '#000000',
          50: '#CCCCCC',
          100: '#999999',
          200: '#666666',
          300: '#333333',
          400: '#1A1A1A',
          500: '#000000',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
        // Complementary Colors
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Legacy support
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.3)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
