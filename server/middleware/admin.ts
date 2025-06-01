import { defineEventHandler, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
    // Define routes that require admin access
    const adminRoutes = ['/api/admin', '/api/user/roles']; // Example: all /api/admin routes

    if (adminRoutes.some(route => event.path.startsWith(route))) {
        // This middleware assumes `event.context.user` has been set by the `auth.ts` middleware
        if (!event.context.user) {
            setResponseStatus(event, 401);
            return { statusCode: 401, message: 'Unauthorized: Authentication required' };
        }

        if (event.context.user.role !== 'admin') {
            setResponseStatus(event, 403);
            return { statusCode: 403, message: 'Forbidden: Admin access required' };
        }
    }
});
