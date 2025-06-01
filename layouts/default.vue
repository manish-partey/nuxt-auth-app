<template>
    <div>
        <header class="bg-indigo-600 text-white p-4 shadow-md">
            <nav class="container mx-auto flex justify-between items-center">
                <NuxtLink to="/" class="text-xl font-bold">NuxtAuth</NuxtLink>
                <ul class="flex space-x-4">
                    <li>
                        <NuxtLink to="/" class="hover:text-indigo-200">Home</NuxtLink>
                    </li>
                    <li v-if="!authStore.user">
                        <NuxtLink to="/login" class="hover:text-indigo-200">Login</NuxtLink>
                    </li>
                    <li v-if="!authStore.user">
                        <NuxtLink to="/signup" class="hover:text-indigo-200">Sign Up</NuxtLink>
                    </li>
                    <li v-if="authStore.user">
                        <NuxtLink to="/profile" class="hover:text-indigo-200">Profile</NuxtLink>
                    </li>
                    <li v-if="authStore.isAdmin">
                        <NuxtLink to="/admin/dashboard" class="hover:text-indigo-200">Admin</NuxtLink>
                    </li>
                    <li v-if="authStore.user">
                        <button @click="authStore.logout" class="hover:text-indigo-200">Logout</button>
                    </li>
                </ul>
            </nav>
        </header>
        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
</script>

<style scoped>
/* Optional: Basic active link styling */
.router-link-active {
    font-weight: bold;
    /* border-bottom: 2px solid white; */
}
</style>
