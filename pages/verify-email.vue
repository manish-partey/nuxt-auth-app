<template>
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 p-4">
        <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
            <h2 class="text-3xl font-extrabold text-gray-900">Email Verification</h2>
            <div v-if="loading">
                <p class="text-gray-700">Verifying your email...</p>
                <div
                    class="spinner border-t-4 border-b-4 border-indigo-500 rounded-full w-8 h-8 mx-auto mt-4 animate-spin">
                </div>
            </div>
            <div v-else>
                <p v-if="successMessage" class="text-green-600 text-lg font-medium">{{ successMessage }}</p>
                <p v-else-if="errorMessage" class="text-red-600 text-lg font-medium">{{ errorMessage }}</p>
                <p class="text-gray-600 mt-4">You will be redirected to the login page shortly.</p>
                <NuxtLink to="/login"
                    class="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Go to
                    Login</NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

onMounted(async () => {
    const token = route.query.token as string;

    if (!token) {
        errorMessage.value = 'No verification token found.';
        loading.value = false;
        setTimeout(() => router.push('/login'), 3000);
        return;
    }

    try {
        const response = await $fetch('/api/auth/verify-email', {
            method: 'POST',
            body: { token },
        });
        successMessage.value = (response as any).message || 'Email verified successfully!';
    } catch (error: any) {
        errorMessage.value = error.data?.message || 'Failed to verify email. The link might be invalid or expired.';
        console.error('Email verification error:', error);
    } finally {
        loading.value = false;
        setTimeout(() => router.push('/login'), 3000); // Redirect after a delay
    }
});
</script>

<style scoped>
/* Basic spinner style */
.spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
