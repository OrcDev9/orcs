module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
        fontFamily: {
            sans: ['Iskara', 'sans-serif'],
            serif: ['MedievalSharp', 'cursive'],
        },
        backgroundImage: {
          'light-image': "url('https://i.imgur.com/Nu7emt2.png')",
          'dark-image': "url('https://i.imgur.com/Nu7emt2.png')",
          
         }
    },
},
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    // ...
  ],
}
///background color///#f2f2f2