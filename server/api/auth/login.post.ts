import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { loginUser, generateAuthToken, getAuthUserById } from '~/server/services/auth';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { emailOrUsername, password } = body;

    const user = await loginUser(emailOrUsername, password);
    const token = generateAuthToken(user._id.toString());

    // Fetch public user details for the response
    const publicUser = await getAuthUserById(user._id.toString());

    setResponseStatus(event, 200);
    return {
      message: 'Login successful!',
      user: publicUser,
      token
    };
  } catch (error: any) {
    console.error('Login API Error:', error);
    setResponseStatus(event, 401);
    return { message: error.message || 'Invalid credentials' };
  }
});
