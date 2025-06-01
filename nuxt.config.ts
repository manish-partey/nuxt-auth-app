export default defineNuxtConfig({
  compatibilityDate: '2025-05-15', // Or latest stable, helps with future compatibility 
  devtools: { enabled: true }, // Enable Nuxt DevTools in development 
  // // Runtime configuration for environment variables 
  runtimeConfig: { // These are server-side only by default, accessible via `useRuntimeConfig()` in server code 
    mongodbUri: process.env.MONGO_CONNECTION_STRING, jwtSecret: process.env.JWT_SECRET, emailHost: process.env.EMAIL_HOST,
    emailPort: parseInt(process.env.EMAIL_PORT || '587'), // Default SMTP port 
    emailUser: process.env.EMAIL_USER, emailPass: process.env.EMAIL_PASS,
    public: { // These are exposed to both client and server side, accessible via `useRuntimeConfig().public` 
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }
  },
  // Nuxt Modules 
 modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  // Tailwind CSS configuration 
   tailwindcss: {
    cssPath: '~/assets/css/main.css', // <--- CHANGED THIS LINE
    configPath: 'tailwind.config',
    viewer: true,
  },
  // Nitro server engine configuration 
  nitro: { // Auto-import directories for server-side code (eliminates manual imports in many cases) 
    imports: {
      dirs: ['./server/utils/**', // For utility functions (e.g., email service) 
        './server/middleware/**', // For server middleware 
        './server/api/**', // API routes (though often defined via file system) 
        './server/services/**', // Business logic layer 
        './server/models/**' // Mongoose models 
      ]
    }
  },
 serverMiddleware: [
    { path: '/api', handler: '~/server/middleware/auth.ts' }
  ],
  // Global CSS/SCSS files 
  css: [
    '~/assets/css/main.css' // <--- CHANGED THIS LINE
  ],
})