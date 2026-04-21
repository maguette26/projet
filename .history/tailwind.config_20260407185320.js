/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [ "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [],
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease forwards;
}
