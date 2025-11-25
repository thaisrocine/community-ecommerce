import { BaseRepository } from './BaseRepository'
import { Store, StoreStatus } from '../entities/Store'

export interface IStoreRepository {
  findByOwnerId(ownerId: string): Promise<Store[]>
  findByStatus(status: StoreStatus): Promise<Store[]>
  findBySlug(slug: string): Promise<Store | null>
  findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<Store[]>
  findByCategory(categoryId: string): Promise<Store[]>
}

export class StoreRepository
  extends BaseRepository<Store>
  implements IStoreRepository
{
  constructor() {
    super('stores')
  }

  async findByOwnerId(_ownerId: string): Promise<Store[]> {
    throw new Error('Method not implemented - connect database first')
  }

  async findByStatus(_status: StoreStatus): Promise<Store[]> {
    throw new Error('Method not implemented - connect database first')
  }

  async findBySlug(_slug: string): Promise<Store | null> {
    throw new Error('Method not implemented - connect database first')
  }

  async findNearby(
    _latitude: number,
    _longitude: number,
    _radiusKm: number
  ): Promise<Store[]> {
    throw new Error('Method not implemented - connect database first')
  }

  async findByCategory(_categoryId: string): Promise<Store[]> {
    throw new Error('Method not implemented - connect database first')
  }
}
