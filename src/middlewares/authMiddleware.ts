import { Request, Response, NextFunction } from 'express'
import { verifyToken, DecodedToken } from '../utils/auth'
import { UserRole } from '../models/User'

// Extende o tipo Request para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken
    }
  }
}


export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header('Authorization')

  if (!authHeader) {
    res.status(401).json({ error: 'Acesso negado. Token não fornecido.' })
    return
  }

  const token = authHeader.replace('Bearer ', '')

  if (!token) {
    res.status(401).json({ error: 'Acesso negado. Token não fornecido.' })
    return
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}

/**
 * Middleware de autorização por role
 * Verifica se o usuário tem a role necessária
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuário não autenticado.' })
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Acesso negado. Você não tem permissão para acessar este recurso.',
      })
      return
    }

    next()
  }
}


export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header('Authorization')

  if (!authHeader) {
    return next()
  }

  const token = authHeader.replace('Bearer ', '')

  if (!token) {
    return next()
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
  } catch {
    // Token inválido, mas não bloqueia a requisição
  }

  next()
}

