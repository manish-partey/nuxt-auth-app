import { defineNuxtPlugin } from '#app';
import type { Pinia } from 'pinia'; // Use type-only import

export default defineNuxtPlugin((nuxtApp) => {
    // @pinia/nuxt module ensures vueApp.use(pinia) is called automatically.
    // This plugin's primary role is to ensure `getActivePinia()` is set correctly for SSR.

    const piniaInstance = nuxtApp.$pinia as Pinia; // Type assertion

    if (!piniaInstance) {
        console.warn("[Pinia Plugin]: Pinia instance not found on nuxtApp. Ensure @pinia/nuxt module is configured correctly.");
        return; // Exit if Pinia isn't initialized, to prevent further errors
    }

    // This ensures the Pinia instance is set as the active one for the current request context.
    // Critical for stores being accessed directly (like in app.vue setup) during SSR.
    piniaInstance.use(() => ({ /* Optional: add Pinia plugins here if needed */ }));
});
