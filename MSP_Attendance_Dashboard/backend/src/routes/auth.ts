import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../database/db.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Types
interface RegisterRequest extends Request {
  body: {
    email: string
    password: string
    confirmPassword: string
  }
}

interface LoginRequest extends Request {
  body: {
    email: string
    password: string
  }
}

interface User {
  id: number
  email: string
  password: string
  role: string
  createdAt: string
}

// Register endpoint
router.post('/register', async (req: RegisterRequest, res: Response) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email  || !password ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 4 characters'
      })
    }

    // Check if user already exists
    const existingUser = await db.get<User>(
      'SELECT * FROM users WHERE email = ? ',
      [email]
    )

if (existingUser) {
  return res.status(400).json({
    success: false,
    message: 'This email is already registered'
  })
}

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await db.run(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'user']
    )

    // Create JWT token
    const token = jwt.sign(
      {
        id: result.lastID,
        email,
        role: 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: result.lastID,
        email,
        role: 'user'
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    })
  }
})

// Login endpoint
router.post('/login', async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    // Find user by email
    const user = await db.get<User>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed'
    })
  }
})

// Verify token endpoint
router.post('/verify', (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    res.json({
      success: true,
      message: 'Token is valid',
      user: decoded
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
})

// Logout endpoint (optional - JWT doesn't need backend logout)
router.post('/logout', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logout successful'
  })
})

export default router
