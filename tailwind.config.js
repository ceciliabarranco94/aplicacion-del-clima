/** @type {import('tailwindcss').Config} */
module.exports = {
  // Mantenemos tus rutas de contenido para que Tailwind detecte las clases
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Aquí añadimos los colores del diseño "naranja/melocotón"
      colors: {
        'peach-start': '#ffb88c', 
        'peach-end': '#ff7e5f',   
        'card-bg': '#ffffff',      
        'text-primary': '#1A1A1A',  
        'text-secondary': '#6B7280',
      },
      // Esto nos permite usar la fuente Inter si la importaste en globals.css
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}