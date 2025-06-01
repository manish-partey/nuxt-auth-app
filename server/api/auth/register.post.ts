import { defineEventHandler, readBody, createError } from 'h3'
import { hashPassword } from '~/server/utils/auth'
import User from '~/server/models/User'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, email, password } = body

    if (!username || !email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Missing username, email, or password'
      })
    }

    // Check if user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })

    console.log('🔍 Checking existing user for:', email, username)
    console.log('🔁 existingUser found:', existingUser)

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Email or username already exists.'
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      emailVerified: false,
    })

    await newUser.save()

    return {
      status: 'success',
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
      }
    }
  } catch (err: any) {
    console.error('❌ Registration error:', err)
    // Return error in Nuxt format
    return createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'Internal Server Error',
    })
  }
})
