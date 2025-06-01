import { defineEventHandler, setResponseStatus } from 'h3';
import { getAllUsers } from '~/server/services/auth';

export default defineEventHandler(async (event) => {
    // This route is protected by `server/middleware/admin.ts`
    if (!event.context.user?.role || event.context.user.role !== 'admin') {
        // This case should ideally not be reached if middleware is correctly applied
        setResponseStatus(event, 403);
        return { message: 'Forbidden: Admin access required' };
    }

    try {
        const users = await getAllUsers();
        setResponseStatus(event, 200);
        return users;
    } catch (error: any) {
        console.error('Error fetching all users (admin API):', error);
        setResponseStatus(event, 500);
        return { message: 'An unexpected error occurred while fetching users.' };
    }
});
