import { defineEventHandler, getHeader, setResponseStatus } from 'h3';
import jwt from 'jsonwebtoken';
import { useRuntimeConfig } from '#imports';

declare module 'h3' {
  interface H3EventContext {
    user?: {
      userId: string;
      role: 'user' | 'admin';
    };
  }
}

export default defineEventHandler(async (event) => {
  console.log('Auth middleware running for path:', event.path);

  const config = useRuntimeConfig();

  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/verify-email',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/login',
    '/register',
    '/',
  ];

  if (publicRoutes.some(route => event.path === route || event.path.startsWith(route))) {
    console.log('Public route, skipping auth:', event.path);
    return;
  }

  const authHeader = getHeader(event, 'Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    setResponseStatus(event, 401);
    console.log('No token provided');
    return { statusCode: 401, message: 'Unauthorized: No token provided' };
  }

  try {
    const decodedToken = jwt.verify(token, config.jwtSecret) as { userId: string; role?: 'user' | 'admin'; };

    const User = (await import('~/server/models/User')).default;
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      setResponseStatus(event, 404);
      console.log('User not found in DB');
      return { statusCode: 404, message: 'Unauthorized: User not found' };
    }

    event.context.user = {
      userId: decodedToken.userId,
      role: user.role
    };

    console.log('User added to context:', event.context.user);

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
