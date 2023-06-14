/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VDataTable } from 'vuetify/labs/VDataTable'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labs from 'vuetify/labs/components'

const customDarkTheme = {
  dark: true,
  colors: {
    background: '#151f32',
    surface: '#18273f',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDataTable,
    ...components,
    ...labs
  },
  directives,
  theme: {
    defaultTheme: 'customDarkTheme',
    themes: {
      customDarkTheme,
    },
  },
})
