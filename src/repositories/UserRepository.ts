import { BaseRepository } from './BaseRepository'
import { User, UserRole } from '../models/User'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  findByRole(role: UserRole): Promise<User[]>
  findByCpf(cpf: string): Promise<User | null>
}

export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor() {
    super('users')
  }

  async findByEmail(_email: string): Promise<User | null> {
    throw new Error('Method not implemented - connect database first')
  }

  async findByRole(_role: UserRole): Promise<User[]> {
    throw new Error('Method not implemented - connect database first')
  }

  async findByCpf(_cpf: string): Promise<User | null> {
    throw new Error('Method not implemented - connect database first')
  }
}
