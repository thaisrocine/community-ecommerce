import { UserService } from '../services/UserService'
import { User, UserRole } from '../entities/User'

export interface CreateUserRequest {
  email: string
  password: string
  name: string
  phone: string
  role?: UserRole
}

export interface UpdateUserRequest {
  name?: string
  phone?: string
  avatar?: string
}

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async create(data: CreateUserRequest): Promise<User> {
    try {
      return await this.userService.createUser(data)
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error}`)
    }
  }

  async getById(id: string): Promise<User | null> {
    try {
      return await this.userService.getUserById(id)
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`)
    }
  }

  async update(id: string, data: UpdateUserRequest): Promise<User | null> {
    try {
      return await this.userService.updateUser(id, data)
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error}`)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return await this.userService.deleteUser(id)
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error}`)
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      return await this.userService.authenticateUser(email, password)
    } catch (error) {
      throw new Error(`Erro ao fazer login: ${error}`)
    }
  }
}
