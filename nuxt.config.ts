// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    port: 4000
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      // @ts-expect-error
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  alias: {
    "@": resolve(__dirname, "/")
  },
  css: [
    "~/assets/main.scss"
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    storage: {
      inst: {
        driver: 'fs',
        base: './data/inst'
      }
    },
    routeRules: {
      '/api/enactor/v2/orders/importOrder/**': { proxy: '/api/enactor/order/import/**' },
      '/apis/enactor/v2/orders/importOrder/**': { proxy: '/api/enactor/order/import/**' },
      '/apis/enactor/v2/offer/validateQuoteConversion': { proxy: '/api/enactor/offer/validate-quote-conversion' },
      '/apis/enactor/v2/offer/shareOffer': { proxy: '/api/enactor/offer/share-offer' },
      '/rest/enactor/orders/importOrder/**': { proxy: '/api/enactor/order/import/**' },
      '/rest/enactor/orders/importOrder': { proxy: '/api/enactor/order/import' },
    }
  }
})
