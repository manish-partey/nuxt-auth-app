<template>
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 p-4">
        <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 class="text-3xl font-extrabold text-center text-gray-900">Sign Up</h2>
            <form @submit.prevent="handleSignup" class="space-y-6">
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                    <input id="username" v-model="username" type="text" autocomplete="username" required
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" v-model="email" type="email" autocomplete="email" required
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input id="password" v-model="password" type="password" autocomplete="new-password" required
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <button type="submit" :disabled="loading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ loading ? 'Signing Up...' : 'Sign Up' }}
                </button>
            </form>
            <p class="text-center text-sm text-gray-600 mt-4">
                Already have an account?
                <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Login</NuxtLink>
            </p>
            <div v-if="error" class="text-red-600 text-sm text-center mt-4">
                {{ error }}
            </div>
            <div v-if="successMessage" class="text-green-600 text-sm text-center mt-4">
                {{ successMessage }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
    middleware: 'auth', // Use the client-side auth middleware
});

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const loading = ref(false);

const handleSignup = async () => {
    error.value = null;
    successMessage.value = null;
    loading.value = true;
    try {
        const response = await authStore.register({
            username: username.value,
            email: email.value,
            password: password.value,
        });
        successMessage.value = response.message;
        // Optionally redirect after a short delay or prompt user to login
        setTimeout(() => {
            router.push('/login');
        }, 3000);
    } catch (err: any) {
        const backendMessage = err.data?.message;
        if (backendMessage) {
            if (typeof backendMessage === 'string') {
                error.value = backendMessage;
            } else if (backendMessage.errors) {
                // If backend sends specific validation errors from Mongoose
                error.value = Object.values(backendMessage.errors).map((e: any) => e.message).join(', ');
            } else {
                error.value = 'Registration failed. Please try again.';
            }
        } else {
            error.value = 'An unexpected error occurred during registration.';
        }
        console.error('Frontend Signup Error:', err);
    } finally {
        loading.value = false;
    }
};
</script>
