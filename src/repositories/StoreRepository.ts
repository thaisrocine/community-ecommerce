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
    // Fórmula de Haversine para calcular distância
    const haversineFormula = `(
      6371 * acos(
        LEAST(1, GREATEST(-1,
          cos(radians(${latitude})) * 
          cos(radians(CAST(latitude AS FLOAT))) * 
          cos(radians(CAST(longitude AS FLOAT)) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(CAST(latitude AS FLOAT)))
        ))
      )
    )`

    const results = await StoreModel.findAll({
      where: {
        latitude: { [Op.ne]: null },
        longitude: { [Op.ne]: null },
        status: StoreStatus.ACTIVE,
        [Op.and]: [
          literal(`${haversineFormula} <= ${radiusKm}`)
        ]
      } as any,
      attributes: {
        include: [
          [literal(haversineFormula), 'distance'],
        ],
      },
      order: [[literal(haversineFormula), 'ASC']],
    })

    return results.map((result) => result.toJSON() as Store)
  }
}
