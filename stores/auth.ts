import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core'; // For persistent token storage in localStorage

// Define types for better type safety
interface AuthUser {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    isVerified: boolean;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<AuthUser | null>(null);
    // `useStorage` makes `token` reactive and persists it to localStorage
    const token = useStorage<string | null>('auth_token', null);

    // --- Actions ---

    const fetchUser = async () => {
        if (!token.value) {
            user.value = null;
            return; // No token, no user to fetch
        }
        try {
            // $fetch is Nuxt's universal fetch API, handles client-side and server-side requests
            const fetchedUser = await $fetch<AuthUser>('/api/user/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.value}`
                },
            });
            user.value = fetchedUser;
        } catch (error: any) {
            console.error('Error fetching user:', error.data?.message || error.message);
            token.value = null; // Clear token if fetching fails (e.g., token expired/invalid)
            user.value = null;
            // Optional: show a notification or redirect to login
        }
    };

    const login = async (credentials: { emailOrUsername: string; password: string }) => {
        try {
            const response = await $fetch<{ token: string; user: AuthUser }>('/api/auth/login', {
                method: 'POST',
                body: credentials
            });
            token.value = response.token;
            await fetchUser(); // Fetch full user data after successful login
            return response;
        } catch (error: any) {
            console.error('Login failed:', error.data?.message || error.message);
            throw error; // Re-throw for component to handle display of error
        }
    };

    const register = async (userData: { username: string; email: string; password: string }) => {
        try {
            const response = await $fetch<{ token: string; user: AuthUser; message: string }>('/api/auth/register', {
                method: 'POST',
                body: userData
            });
            token.value = response.token; // Store token if backend returns it on registration
            await fetchUser(); // Fetch user data
            return response;
        } catch (error: any) {
            console.error('Registration failed:', error.data?.message || error.message);
            throw error;
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        useRouter().push('/login'); // Redirect to login page after logout
    };

    // Helper for admin role
    const isAdmin = computed(() => user.value?.role === 'admin');

    // --- Expose state and actions ---
    return {
        user,
        token,
        isAdmin,
        fetchUser,
        login,
        register,
        logout,
    };
});
