import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'op-red': '#E61E25',      // Rojo de Luffy
        'op-yellow': '#FDD835',   // Amarillo del logo
        'op-blue': '#2196F3',     // Azul del mar
        'op-orange': '#FF9800',   // Naranja de Ace
        'op-green': '#4CAF50',    // Verde de Zoro
        'op-dark': {
          DEFAULT: '#1a1a1a',
          light: '#2d2d2d',
          lighter: '#3d3d3d',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-op': 'linear-gradient(to right, #E61E25, #FDD835)',
      },
    },
  },
  plugins: [],
}

export default config;
