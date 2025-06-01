<template>
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 p-4">
        <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 class="text-3xl font-extrabold text-center text-gray-900">Login</h2>
            <form @submit.prevent="handleLogin" class="space-y-6">
                <div>
                    <label for="emailOrUsername" class="block text-sm font-medium text-gray-700">Email or
                        Username</label>
                    <input id="emailOrUsername" v-model="emailOrUsername" type="text" autocomplete="username" required
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input id="password" v-model="password" type="password" autocomplete="current-password" required
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <button type="submit" :disabled="loading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ loading ? 'Logging In...' : 'Login' }}
                </button>
            </form>
            <p class="text-center text-sm text-gray-600 mt-4">
                Don't have an account?
                <NuxtLink to="/signup" class="font-medium text-indigo-600 hover:text-indigo-500">Sign Up</NuxtLink>
            </p>
            <p class="text-center text-sm text-gray-600">
                <NuxtLink to="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot
                    password?</NuxtLink>
            </p>
            <div v-if="error" class="text-red-600 text-sm text-center mt-4">
                {{ error }}
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

const emailOrUsername = ref('');
const password = ref('');
const error = ref<string | null>(null);
const loading = ref(false);

const handleLogin = async () => {
    error.value = null; // Clear previous errors
    loading.value = true;
    try {
        await authStore.login({
            emailOrUsername: emailOrUsername.value,
            password: password.value,
        });
        router.push('/'); // Redirect to home page on successful login
    } catch (err: any) {
        error.value = err.data?.message || 'Login failed. Please check your credentials.';
        console.error('Frontend Login Error:', err);
    } finally {
        loading.value = false;
    }
};
</script>
