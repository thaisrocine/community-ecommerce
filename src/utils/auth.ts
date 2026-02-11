import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRole } from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface TokenPayload {
  userId: string
  email: string
  role: UserRole
}

export interface DecodedToken extends TokenPayload {
  iat: number
  exp: number
}

/**
 * Criptografa a senha usando bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

/**
 * Compara a senha em texto plano com a senha criptografada
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Gera um token JWT
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Verifica e decodifica um token JWT
 */
export const verifyToken = (token: string): DecodedToken => {
  return jwt.verify(token, JWT_SECRET) as DecodedToken
}

/**
 * Gera um refresh token (validade maior)
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}


