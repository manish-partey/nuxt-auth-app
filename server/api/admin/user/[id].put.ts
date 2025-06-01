import { defineEventHandler, setResponseStatus, readBody } from 'h3';
import { updateUserRole } from '~/server/services/auth';

export default defineEventHandler(async (event) => {
    // This route is protected by `server/middleware/admin.ts`
    if (!event.context.user?.role || event.context.user.role !== 'admin') {
        setResponseStatus(event, 403);
        return { message: 'Forbidden: Admin access required' };
    }

    const userId = event.context.params?.id; // Get ID from dynamic route
    const { role } = await readBody(event);

    if (!userId || !role || !['user', 'admin'].includes(role)) {
        setResponseStatus(event, 400);
        return { message: 'Invalid user ID or role provided.' };
    }

    try {
        const updatedUser = await updateUserRole(userId, role as 'user' | 'admin');
        if (!updatedUser) {
            setResponseStatus(event, 404);
            return { message: 'User not found.' };
        }
        setResponseStatus(event, 200);
        return { message: 'User role updated successfully.', user: { id: updatedUser._id, username: updatedUser.username, role: updatedUser.role } };
    } catch (error: any) {
        console.error('Error updating user role (admin API):', error);
        setResponseStatus(event, 500);
        return { message: 'An unexpected error occurred while updating user role.' };
    }
});
