import { Op, literal } from 'sequelize'
import { Store, StoreStatus } from '../models/Store'
import { StoreModel } from '../database'

export interface IStoreRepository {
  findByOwnerId(ownerId: string): Promise<Store[]>
  findByStatus(status: StoreStatus): Promise<Store[]>
  findBySlug(slug: string): Promise<Store | null>
  findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<Store[]>
}

export class StoreRepository implements IStoreRepository {
  async findById(id: string): Promise<Store | null> {
    const result = await StoreModel.findByPk(id)
    return result ? (result.toJSON() as Store) : null
  }

  async findAll(filters?: Record<string, any>): Promise<Store[]> {
    const results = await StoreModel.findAll({ where: filters })
    return results.map((result) => result.toJSON() as Store)
  }

  async create(data: Partial<Store>): Promise<Store> {
    const result = await StoreModel.create(data as any)
    return result.toJSON() as Store
  }

  async update(id: string, data: Partial<Store>): Promise<Store | null> {
    const [affectedCount] = await StoreModel.update(data as any, {
      where: { id } as any,
    })
    if (affectedCount === 0) return null
    return this.findById(id)
  }

  async delete(id: string): Promise<boolean> {
    const affectedCount = await StoreModel.destroy({ where: { id } as any })
    return affectedCount > 0
  }

  async findByOwnerId(ownerId: string): Promise<Store[]> {
    const results = await StoreModel.findAll({
      where: { ownerId } as any,
    })
    return results.map((result) => result.toJSON() as Store)
  }

  async findByStatus(status: StoreStatus): Promise<Store[]> {
    const results = await StoreModel.findAll({
      where: { status } as any,
    })
    return results.map((result) => result.toJSON() as Store)
  }

  async findBySlug(slug: string): Promise<Store | null> {
    const result = await StoreModel.findOne({
      where: { slug } as any,
    })
    return result ? (result.toJSON() as Store) : null
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<Store[]> {
    const results = await StoreModel.findAll({
      where: {
        latitude: { [Op.ne]: null },
        longitude: { [Op.ne]: null },
        status: StoreStatus.ACTIVE,
      } as any,
      attributes: {
        include: [
          [
            literal(`(
              6371 * acos(
                cos(radians(${latitude})) * 
                cos(radians(latitude)) * 
                cos(radians(longitude) - radians(${longitude})) + 
                sin(radians(${latitude})) * 
                sin(radians(latitude))
              )
            )`),
            'distance',
          ],
        ],
      },
      having: literal(`(
        6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(latitude))
        )
      ) <= ${radiusKm}`),
      order: [[literal('distance'), 'ASC']],
    })

    return results.map((result) => result.toJSON() as Store)
  }
}
