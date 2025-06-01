<template>
    <div class="container mx-auto p-8 text-center min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">Welcome to Nuxt Auth App!</h1>
        <div v-if="authStore.user" class="bg-green-50 p-6 rounded-lg shadow-md max-w-md w-full">
            <p class="text-lg text-gray-700 mb-2">You are logged in as:</p>
            <p class="text-xl font-semibold text-indigo-700">{{ authStore.user.username }}</p>
            <p class="text-md text-gray-600">({{ authStore.user.email }})</p>
            <p class="text-md text-gray-600 capitalize">Role: <span class="font-semibold">{{ authStore.user.role
                    }}</span></p>
            <p class="text-md text-gray-600">Verified: <span
                    :class="authStore.user.isVerified ? 'text-green-500' : 'text-red-500'">{{ authStore.user.isVerified
                    ? 'Yes' : 'No' }}</span></p>
            <button @click="authStore.logout"
                class="mt-8 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Logout
            </button>
        </div>
        <div v-else class="bg-blue-50 p-6 rounded-lg shadow-md max-w-md w-full">
            <p class="text-lg text-gray-700 mb-4">You are not logged in.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <NuxtLink to="/login"
                    class="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Login
                </NuxtLink>
                <NuxtLink to="/signup"
                    class="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Sign Up
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

// Example of applying middleware to a page
definePageMeta({
    // global auth middleware would handle redirects here.
});
</script>
