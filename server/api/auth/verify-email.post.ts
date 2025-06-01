import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { verifyUserEmail } from '~/server/services/auth';

export default defineEventHandler(async (event) => {
    try {
        const { token } = await readBody(event);
        if (!token) {
            setResponseStatus(event, 400);
            return { message: 'Verification token is required.' };
        }

        await verifyUserEmail(token);
        setResponseStatus(event, 200);
        return { message: 'Email verified successfully!' };
    } catch (error: any) {
        console.error('Email Verification API Error:', error);
        setResponseStatus(event, 400); // Bad Request for invalid/expired token
        return { message: error.message || 'Email verification failed.' };
    }
});
