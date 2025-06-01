import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { requestPasswordReset } from '~/server/services/auth';

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);
    if (!email) {
      setResponseStatus(event, 400);
      return { message: 'Email is required.' };
    }

    await requestPasswordReset(email);
    setResponseStatus(event, 200);
    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  } catch (error: any) {
    console.error('Forgot Password API Error:', error);
    setResponseStatus(event, 500);
    return { message: 'An unexpected error occurred during password reset request.' };
  }
});
