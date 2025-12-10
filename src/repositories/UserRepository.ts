import { User, UserRole } from '../models/User'
import { UserModel } from '../database'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  findByRole(role: UserRole): Promise<User[]>
}

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await UserModel.findByPk(id)
    return result ? (result.toJSON() as User) : null
  }

  async findAll(filters?: Record<string, any>): Promise<User[]> {
    const results = await UserModel.findAll({ where: filters })
    return results.map((result) => result.toJSON() as User)
  }

  async create(data: Partial<User>): Promise<User> {
    const result = await UserModel.create(data as any)
    return result.toJSON() as User
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const [affectedCount] = await UserModel.update(data as any, {
      where: { id } as any,
    })
    if (affectedCount === 0) return null
    return this.findById(id)
  }

  async delete(id: string): Promise<boolean> {
    const affectedCount = await UserModel.destroy({ where: { id } as any })
    return affectedCount > 0
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await UserModel.findOne({
      where: { email } as any,
    })
    return result ? (result.toJSON() as User) : null
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const results = await UserModel.findAll({
      where: { role } as any,
    })
    return results.map((result) => result.toJSON() as User)
  }
}
