import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { registerUser, generateAuthToken } from '~/server/services/auth';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { username, email, password } = body;

        const newUser = await registerUser(username, email, password);
        const token = generateAuthToken(newUser._id.toString());

        setResponseStatus(event, 201); // 201 Created
        return {
            message: 'User registered successfully! Please check your email for verification.',
            user: { id: newUser._id, username: newUser.username, email: newUser.email, isVerified: newUser.isVerified },
            token // Optionally return token upon registration for immediate login
        };
    } catch (error: any) {
        console.error('Registration API Error:', error);
        if (error.name === 'ValidationError') {
            setResponseStatus(event, 400);
            return { message: 'Validation failed.', errors: error.errors };
        }
        if (error.message.includes('exists')) { // Custom error message for existing user
            setResponseStatus(event, 409); // Conflict
            return { message: error.message };
        }
        setResponseStatus(event, 500);
        return { message: 'An unexpected error occurred during registration.', error: error.message };
    }
});
