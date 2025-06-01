import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    // Define routes that require authentication via meta field
    if (to.meta.requiresAuth && !authStore.user) {
        // If user is not authenticated and route requires auth, redirect to login
        return navigateTo('/login');
    }

    // Define routes that require admin role via meta field
    if (to.meta.requiresAdmin && (!authStore.user || authStore.user.role !== 'admin')) {
        // If user is not admin and route requires admin, redirect to home or login
        return navigateTo('/'); // Or '/login' or an access denied page
    }

    // If user is logged in and trying to access login/signup pages, redirect to home
    if (authStore.user && (to.path === '/login' || to.path === '/signup')) {
        return navigateTo('/');
    }
});

// How to use this middleware:
// 1. Globally in nuxt.config.ts: `router: { middleware: ['auth'] }` (applies to all routes)
// 2. On specific pages:
//    `definePageMeta({ middleware: ['auth'] });`
//    `definePageMeta({ middleware: ['auth'], requiresAuth: true, requiresAdmin: true });`
