// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  ],
  pinia: {
    autoImports: [

      'defineStore',
      'storeToRefs'
    ]
  },

  experimental: {
    componentIslands: true
  }
})