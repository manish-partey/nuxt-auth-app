// server/utils/auth.ts
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

// Hashes a plain text password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

// Compares a plain text password with a hashed one
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}
