import { UserService } from '../services/UserService'
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
  verifyToken,
  TokenPayload,
} from '../utils/auth'
import { User, UserStatus } from '../models/User'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone: string
}

export interface AuthResponse {
  user: Omit<User, 'password'>
  accessToken: string
  refreshToken: string
}

export class AuthController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (!data.email || !data.password || !data.name || !data.phone) {
      throw new Error('Email, senha, nome e telefone são obrigatórios')
    }

    if (data.password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres')
    }

    // Verifica se o email já está em uso
    const existingUser = await this.userService.getUserByEmail(data.email)
    if (existingUser) {
      throw new Error('Este email já está cadastrado')
    }

    // Criptografa a senha
    const hashedPassword = await hashPassword(data.password)

    // Cria o usuário
    const user = await this.userService.createUser({
      ...data,
      password: hashedPassword,
    })

    // Gera tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = generateToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Remove a senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword as Omit<User, 'password'>,
      accessToken,
      refreshToken,
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    if (!data.email || !data.password) {
      throw new Error('Email e senha são obrigatórios')
    }

    // Busca o usuário pelo email
    const user = await this.userService.getUserByEmail(data.email)
    if (!user) {
      throw new Error('Email ou senha inválidos')
    }

    // Verifica se o usuário está ativo
    if (user.status !== UserStatus.ACTIVE) {
      throw new Error('Sua conta está inativa ou suspensa')
    }

    // Compara a senha
    const isPasswordValid = await comparePassword(data.password, user.password)
    if (!isPasswordValid) {
      throw new Error('Email ou senha inválidos')
    }

    // Gera tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = generateToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Remove a senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword as Omit<User, 'password'>,
      accessToken,
      refreshToken,
    }
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    if (!token) {
      throw new Error('Refresh token é obrigatório')
    }

    try {
      const decoded = verifyToken(token)

      // Verifica se o usuário ainda existe e está ativo
      const user = await this.userService.getUserById(decoded.userId)
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new Error('Usuário não encontrado ou inativo')
      }

      // Gera novo access token
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      }

      const accessToken = generateToken(tokenPayload)

      return { accessToken }
    } catch {
      throw new Error('Refresh token inválido ou expirado')
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    if (!currentPassword || !newPassword) {
      throw new Error('Senha atual e nova senha são obrigatórias')
    }

    if (newPassword.length < 6) {
      throw new Error('A nova senha deve ter pelo menos 6 caracteres')
    }

    const user = await this.userService.getUserById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    // Verifica a senha atual
    const isPasswordValid = await comparePassword(currentPassword, user.password)
    if (!isPasswordValid) {
      throw new Error('Senha atual incorreta')
    }

    // Criptografa a nova senha
    const hashedPassword = await hashPassword(newPassword)

    // Atualiza a senha
    await this.userService.updateUser(userId, { password: hashedPassword })
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userService.getUserById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as Omit<User, 'password'>
  }
}

