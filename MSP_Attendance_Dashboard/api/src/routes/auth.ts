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

router.get('/register', (req: Request, res: Response) => {
  res.json({ message: 'Register endpoint is working' })
})


// Register endpoint
router.post('/register', async (req: RegisterRequest, res: Response) => {
  try {
    const { email, password } = req.body

    console.log("email:", email)
    console.log("password:", password)

    // 1. Validation (كما هي)
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    // 2. Check if user exists (تعديل الـ ?)
    const existingUser = await db.get<User>(
      'SELECT * FROM admins WHERE email = $1', // غيرت users لـ admins والـ ? لـ $1
      [email]
    )

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'This email is already registered' })
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Create user (تعديل الـ ? وإضافة RETURNING id)
    const result = await db.run(
      'INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING id', 
      [email, hashedPassword]
    )

    const userId = result.lastID; // دي هتشتغل دلوقتي صح لأننا ضفنا RETURNING id

    // 5. Create JWT token
    const token = jwt.sign(
      { id: userId, email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: userId, email, role: 'admin' }
    })
  } catch (error) {
    console.error('Registration error:', error) // بص على الـ Terminal هنا لو لسه فيه Error
    res.status(500).json({ success: false, message: 'Registration failed' })
  }
})

// Login endpoint
router.post('/login', async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user (تعديل الـ ?)
    const user = await db.get<User>(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    )

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: 'admin' }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Login failed' })
  }
})

export default router
