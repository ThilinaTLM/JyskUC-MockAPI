import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import colors from 'vuetify/util/colors'


export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        theme: {
            themes: {
                light: {
                    dark: false,
                    colors: {
                        primary: colors.blue.darken1,
                        secondary: colors.yellow.darken4,
                    }
                },
            },
        },
    })
    app.vueApp.use(vuetify)
})