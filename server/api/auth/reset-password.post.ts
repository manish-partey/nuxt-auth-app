import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { resetUserPassword } from '~/server/services/auth';

export default defineEventHandler(async (event) => {
  try {
    const { token, newPassword } = await readBody(event);
    if (!token || !newPassword) {
      setResponseStatus(event, 400);
      return { message: 'Token and new password are required.' };
    }

    await resetUserPassword(token, newPassword);
    setResponseStatus(event, 200);
    return { message: 'Password has been reset successfully!' };
  } catch (error: any) {
    console.error('Reset Password API Error:', error);
    setResponseStatus(event, 400); // Bad Request for invalid/expired token
    return { message: error.message || 'Password reset failed.' };
  }
});
