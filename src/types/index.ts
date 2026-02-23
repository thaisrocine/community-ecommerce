import { UserRole } from '../models/User'

export interface AppConfig {
  port: number
  nodeEnv: string
}

export interface JwtPayload {
  userId: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export interface AuthRequest {
  user?: JwtPayload
}

