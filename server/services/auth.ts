import User, { IUser } from '~/server/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { useRuntimeConfig } from '#imports';
import { sendEmail } from '~/server/utils/email'; // Import email utility
import crypto from 'crypto'; // Node.js built-in module

const config = useRuntimeConfig();

export async function registerUser(username: string, email: string, password: string): Promise<IUser> {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('Email or username already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate email verification token
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationExpires = new Date(Date.now() + 3600000); // 1 hour from now

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    emailVerificationToken,
    emailVerificationExpires,
  });

  await newUser.save();

  // Send verification email
  const verificationLink = `${config.public.appUrl}/verify-email?token=${emailVerificationToken}`;
  const emailHtml = `
    <h1>Welcome to Nuxt Auth App!</h1>
    <p>Please verify your email by clicking on this link:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link will expire in 1 hour.</p>
  `;
  await sendEmail(newUser.email, 'Verify Your Email for Nuxt Auth App', emailHtml);

  return newUser;
}

export async function loginUser(emailOrUsername: string, password: string): Promise<IUser> {
  const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if user is verified (optional, you can force verification before login)
  // if (!user.isVerified) {
  //   throw new Error('Please verify your email address.');
  // }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
}

export function generateAuthToken(userId: string): string {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not defined in runtimeConfig.');
  }
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '1d' }); // Token valid for 1 day
}

export async function getAuthUserById(userId: string): Promise<IUser | null> {
  // Fetch user by ID, excluding sensitive fields like password
  const user = await User.findById(userId).select('-password -emailVerificationToken -emailVerificationExpires -resetPasswordToken -resetPasswordExpires');
  return user;
}

export async function verifyUserEmail(token: string): Promise<IUser> {
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() } // Token is not expired
  });

  if (!user) {
    throw new Error('Invalid or expired verification token.');
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();
  return user;
}

export async function requestPasswordReset(email: string): Promise<void> {
  const user = await User.findOne({ email });

  if (!user) {
    // For security, don't reveal if email exists or not
    throw new Error('If an account with that email exists, a password reset link has been sent.');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = new Date(Date.now() + 3600000); // 1 hour

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetExpires;
  await user.save();

  const resetLink = `${config.public.appUrl}/reset-password?token=${resetToken}`;
  const emailHtml = `
    <h1>Password Reset Request</h1>
    <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
    <p>Please click on the following link, or paste this into your browser to complete the process:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `;
  await sendEmail(user.email, 'Password Reset Request for Nuxt Auth App', emailHtml);
}

export async function resetUserPassword(token: string, newPassword: string): Promise<IUser> {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  }).select('+password'); // Select password to update it

  if (!user) {
    throw new Error('Password reset token is invalid or has expired.');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  return user;
}

export async function updateUserRole(userId: string, newRole: 'user' | 'admin'): Promise<IUser | null> {
  const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
  return user;
}

export async function getAllUsers(): Promise<IUser[]> {
  const users = await User.find().select('-password -emailVerificationToken -emailVerificationExpires -resetPasswordToken -resetPasswordExpires');
  return users;
}
