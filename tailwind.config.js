// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./src/**/*.{html,js,svelte,ts}"],

//   theme: {
//     extend: {}
//   },

//   plugins: [require("@tailwindcss/typography")]
// };
import { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      border: {
        borderRadius: {
          'list': '6px 0px 0px 6px;'
        }
      },
      boxShadow: {
        'header': '0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px -1px rgba(0, 0, 0, 0.10)',
        'custom-table': '0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px -1px rgba(0, 0, 0, 0.10)',
        'map': '0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -2px rgba(0, 0, 0, 0.05);',
        'chart': ' 0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px -1px rgba(0, 0, 0, 0.10)'
      },
      colors: {
        gray: {
          50: 'var(--gray-50, #F9FAFB)',
        },
      }
    }
  },
  plugins: [flowbitePlugin]
} 
