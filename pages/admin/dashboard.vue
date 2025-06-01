<template>
    <div class="container mx-auto p-8 min-h-[calc(100vh-64px)]">
        <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">Admin Dashboard</h1>

        <div v-if="loadingUsers" class="text-center text-gray-600">Loading users...</div>
        <div v-else-if="userError" class="text-red-600 text-center">{{ userError }}</div>
        <div v-else-if="users.length === 0" class="text-center text-gray-600">No users found.</div>
        <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Username</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Verified</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="user in users" :key="user.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.username }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="user.isVerified ? 'text-green-500' : 'text-red-500'">
                                {{ user.isVerified ? 'Yes' : 'No' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            <select v-model="user.role" @change="updateUserRole(user.id, user.role)"
                                :disabled="user.id === authStore.user?.id"
                                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button @click="deleteUser(user.id)" :disabled="user.id === authStore.user?.id"
                                class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="actionMessage" :class="actionMessageType === 'success' ? 'text-green-600' : 'text-red-600'"
                class="p-4 text-center">
                {{ actionMessage }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

// Apply both auth and admin middleware
definePageMeta({
    middleware: 'auth',
    requiresAuth: true,
    requiresAdmin: true, // Custom meta field for admin access
});

const authStore = useAuthStore();

interface UserData {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    isVerified: boolean;
}

const users = ref<UserData[]>([]);
const loadingUsers = ref(true);
const userError = ref<string | null>(null);
const actionMessage = ref<string | null>(null);
const actionMessageType = ref<'success' | 'error' | null>(null);

const fetchUsers = async () => {
    loadingUsers.value = true;
    userError.value = null;
    try {
        const fetchedUsers = await $fetch<UserData[]>('/api/admin/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authStore.token}`
            }
        });
        users.value = fetchedUsers;
    } catch (error: any) {
        userError.value = error.data?.message || 'Failed to fetch users.';
        console.error('Error fetching users for admin:', error);
    } finally {
        loadingUsers.value = false;
    }
};

const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    actionMessage.value = null;
    actionMessageType.value = null;
    try {
        const response = await $fetch(`/api/admin/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authStore.token}`
            },
            body: { role: newRole }
        });
        actionMessage.value = (response as any).message || 'User role updated.';
        actionMessageType.value = 'success';
        // Re-fetch users to ensure data consistency
        await fetchUsers();
    } catch (error: any) {
        actionMessage.value = error.data?.message || 'Failed to update user role.';
        actionMessageType.value = 'error';
        console.error('Error updating user role:', error);
    } finally {
        setTimeout(() => { actionMessage.value = null; actionMessageType.value = null; }, 3000);
    }
};

const deleteUser = async (userId: string) => {
    actionMessage.value = null;
    actionMessageType.value = null;
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        await $fetch(`/api/admin/user/${userId}`, { // Assuming you have a delete endpoint
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authStore.token}`
            }
        });
        actionMessage.value = 'User deleted successfully.';
        actionMessageType.value = 'success';
        // Remove user from the list
        users.value = users.value.filter(user => user.id !== userId);
    } catch (error: any) {
        actionMessage.value = error.data?.message || 'Failed to delete user.';
        actionMessageType.value = 'error';
        console.error('Error deleting user:', error);
    } finally {
        setTimeout(() => { actionMessage.value = null; actionMessageType.value = null; }, 3000);
    }
};

// Initial fetch of users when the component mounts
onMounted(fetchUsers);
</script>
