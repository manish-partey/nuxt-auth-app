<template>
    <div class="container mx-auto p-8 text-center min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">Your Profile</h1>
        <div v-if="authStore.user" class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-left">
            <div class="mb-4">
                <p class="text-gray-600 text-sm">Username:</p>
                <p class="text-xl font-semibold text-indigo-700">{{ authStore.user.username }}</p>
            </div>
            <div class="mb-4">
                <p class="text-gray-600 text-sm">Email:</p>
                <p class="text-xl font-semibold text-indigo-700">{{ authStore.user.email }}</p>
            </div>
            <div class="mb-4">
                <p class="text-gray-600 text-sm">Role:</p>
                <p class="text-xl font-semibold text-indigo-700 capitalize">{{ authStore.user.role }}</p>
            </div>
            <div class="mb-4">
                <p class="text-gray-600 text-sm">Email Verified:</p>
                <p class="text-xl font-semibold" :class="authStore.user.isVerified ? 'text-green-600' : 'text-red-600'">
                    {{ authStore.user.isVerified ? 'Yes' : 'No' }}
                </p>
            </div>
        </div>
        <div v-else class="text-center text-red-600">
            <p>Please login to view your profile.</p>
            <NuxtLink to="/login"
                class="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Go to Login
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

// Apply the authentication middleware to protect this route
definePageMeta({
    middleware: 'auth',
    requiresAuth: true, // Custom meta field for the middleware
});
</script>
