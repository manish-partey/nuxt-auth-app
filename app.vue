<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { callOnce } from '#app'; // For code that runs once (SSR + hydration)

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// IMPORTANT: Fetch user data on app load, ensuring SSR compatibility.
// `callOnce` ensures this runs once per request on the server, and then hydrates
// on the client, preventing redundant calls.
await callOnce(async () => {
  await authStore.fetchUser();
});

// Optional: Client-side redirect if not authenticated.
// For robust protection, also use Nuxt middleware (`middleware/auth.ts`)
// and server middleware.
watchEffect(() => {
  // Define routes that require authentication
  const protectedRoutes = ['/profile', '/dashboard', '/admin'];
  const requiresAuth = protectedRoutes.some(path => route.path.startsWith(path));

  // If user is NOT logged in AND trying to access a protected route
  if (requiresAuth && !authStore.user && route.path !== '/login' && route.path !== '/signup') {
    // console.warn('Redirecting unauthenticated user from protected route:', route.path);
    // router.push('/login'); // Uncomment if you want immediate client-side redirect
  }
});

// Set global page title
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Nuxt Auth App` : 'Nuxt Auth App';
  },
  meta: [
    { name: 'description', content: 'Full-stack authentication application with Nuxt 3 and MongoDB' }
  ]
});
</script>
