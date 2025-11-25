import { UserRepository } from '../repositories/UserRepository'
import { User, UserRole, UserStatus } from '../entities/User'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async createUser(data: Partial<User>): Promise<User> {
    if (!data.email || !data.password || !data.name) {
      throw new Error('Email, senha e nome são obrigatórios')
    }

    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    const userData: Partial<User> = {
      ...data,
      status: data.status || UserStatus.ACTIVE,
      role: data.role || UserRole.CLIENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return await this.userRepository.create(userData)
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email)
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    delete data.id
    delete data.createdAt

    const updatedData = {
      ...data,
      updatedAt: new Date(),
    }

    return await this.userRepository.update(id, updatedData)
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.delete(id)
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return await this.userRepository.findByRole(role)
  }

  async authenticateUser(
    email: string,
    _password: string
  ): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      return null
    }

    return user
  }
}
