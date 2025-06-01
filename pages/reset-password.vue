<template>
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 p-4">
        <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 class="text-3xl font-extrabold text-center text-gray-900">Reset Password</h2>
            <div v-if="!tokenValid" class="text-center text-red-600">
                <p>Invalid or expired password reset link.</p>
                <NuxtLink to="/forgot-password"
                    class="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Request
                    New Link</NuxtLink>
            </div>
            <form v-else @submit.prevent="handleResetPassword" class="space-y-6">
                <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                    <input id="newPassword" v-model="newPassword" type="password" autocomplete="new-password" required
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm
                        Password</label>
                    <input id="confirmPassword" v-model="confirmPassword" type="password" autocomplete="new-password"
                        required
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <button type="submit" :disabled="loading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ loading ? 'Resetting...' : 'Reset Password' }}
                </button>
            </form>
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const token = ref<string | null>(null);
const tokenValid = ref(false); // Assume invalid until confirmed
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

onMounted(() => {
    token.value = route.query.token as string;
    if (token.value) {
        // In a real app, you might make an API call to validate the token on mount
        // For this example, we just check if it exists in the query
        tokenValid.value = true;
    } else {
        tokenValid.value = false;
    }
});

const handleResetPassword = async () => {
    loading.value = true;
    successMessage.value = null;
    errorMessage.value = null;

    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.';
        loading.value = false;
        return;
    }
    if (newPassword.value.length < 6) {
        errorMessage.value = 'Password must be at least 6 characters.';
        loading.value = false;
        return;
    }

    try {
        const response = await $fetch('/api/auth/reset-password', {
            method: 'POST',
            body: { token: token.value, newPassword: newPassword.value },
        });
        successMessage.value = (response as any).message;
        setTimeout(() => {
            router.push('/login'); // Redirect to login after successful reset
        }, 3000);
    } catch (error: any) {
        errorMessage.value = error.data?.message || 'Failed to reset password. The link might be invalid or expired.';
        console.error('Reset password error:', error);
        tokenValid.value = false; // Invalidate form if token was the issue
    } finally {
        loading.value = false;
    }
};
</script>
