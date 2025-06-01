<template>
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 p-4">
        <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 class="text-3xl font-extrabold text-center text-gray-900">Forgot Password</h2>
            <form @submit.prevent="handleForgotPassword" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                    <input id="email" v-model="email" type="email" autocomplete="email" required
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <button type="submit" :disabled="loading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ loading ? 'Sending...' : 'Request Reset Link' }}
                </button>
            </form>
            <p class="text-center text-sm text-gray-600 mt-4">
                Remember your password?
                <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Login</NuxtLink>
            </p>
            <div v-if="successMessage" class="text-green-600 text-sm text-center mt-4">
                {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="text-red-600 text-sm text-center mt-4">
                {{ errorMessage }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const loading = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const handleForgotPassword = async () => {
    loading.value = true;
    successMessage.value = null;
    errorMessage.value = null;
    try {
        const response = await $fetch('/api/auth/forgot-password', {
            method: 'POST',
            body: { email: email.value },
        });
        successMessage.value = (response as any).message;
    } catch (error: any) {
        errorMessage.value = error.data?.message || 'Failed to send reset link. Please try again.';
        console.error('Forgot password error:', error);
    } finally {
        loading.value = false;
    }
};
</script>
