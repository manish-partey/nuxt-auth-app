import { defineEventHandler, getHeader, setResponseStatus } from 'h3';
import jwt from 'jsonwebtoken';
import { useRuntimeConfig } from '#imports';

// Extend H3EventContext to include `user` (for TypeScript)
declare module 'h3' {
    interface H3EventContext {
        user?: {
            userId: string;
            role: 'user' | 'admin'; // Add role to context
        };
    }
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    // IMPORTANT: Add your *frontend page paths* here that should not require authentication
    const publicRoutes = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/verify-email',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
        // Add your frontend page paths here
        '/login',          // <-- ADD THIS LINE
        '/register',       // <-- ADD THIS LINE (if you have a registration page)
        '/',               // <-- ADD THIS LINE (if your home page doesn't require auth)
        // You might also need to add paths for static assets served by Nuxt if they get caught
        // but typically Nuxt handles serving those before middleware kicks in for page paths.
    ];

    // Check if the current route is a public route (doesn't require auth)
    // Using startsWith for /api routes is good, but for exact page routes, a direct match is better
    // Or just make sure your startsWith logic covers it.
    if (publicRoutes.some(route => event.path.startsWith(route) || event.path === route)) { // Added || event.path === route for exact matches
        return; // Allow access to public routes
    }

    const authHeader = getHeader(event, 'Authorization');
    const token = authHeader?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        setResponseStatus(event, 401);
        return { statusCode: 401, message: 'Unauthorized: No token provided' };
    }

    try {
        const decodedToken = jwt.verify(token, config.jwtSecret) as { userId: string; role?: 'user' | 'admin'; iat: number; exp: number; };

        const user = await (await import('~/server/models/User')).default.findById(decodedToken.userId);
        if (!user) {
            setResponseStatus(event, 404);
            return { statusCode: 404, message: 'Unauthorized: User not found' };
        }

        event.context.user = {
            userId: decodedToken.userId,
            role: user.role
        };

    } catch (error: any) {
        console.error('Auth Middleware Error:', error);
        if (error.name === 'TokenExpiredError') {
            setResponseStatus(event, 401);
            return { statusCode: 401, message: 'Unauthorized: Token expired', expired: true };
        }
        setResponseStatus(event, 401);
        return { statusCode: 401, message: 'Unauthorized: Invalid token' };
    }
});