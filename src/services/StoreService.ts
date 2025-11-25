import { StoreRepository } from '../repositories/StoreRepository'
import { Store, StoreStatus } from '../entities/Store'

export class StoreService {
  private storeRepository: StoreRepository

  constructor() {
    this.storeRepository = new StoreRepository()
  }

  async createStore(data: Partial<Store>): Promise<Store> {
    if (!data.name || !data.ownerId) {
      throw new Error('Nome e proprietário são obrigatórios')
    }

    if (!data.slug) {
      data.slug = this.generateSlug(data.name)
    }

    const existingStore = await this.storeRepository.findBySlug(data.slug)
    if (existingStore) {
      throw new Error('Já existe uma loja com este nome')
    }

    const storeData: Partial<Store> = {
      ...data,
      status: data.status || StoreStatus.PENDING_APPROVAL,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return await this.storeRepository.create(storeData)
  }

  async getStoreById(id: string): Promise<Store | null> {
    return await this.storeRepository.findById(id)
  }

  async getStoreBySlug(slug: string): Promise<Store | null> {
    return await this.storeRepository.findBySlug(slug)
  }

  async getStoresByOwner(ownerId: string): Promise<Store[]> {
    return await this.storeRepository.findByOwnerId(ownerId)
  }

  async getNearbyStores(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<Store[]> {
    const stores = await this.storeRepository.findNearby(
      latitude,
      longitude,
      radiusKm
    )
    return stores.filter((store) => store.status === StoreStatus.ACTIVE)
  }

  async updateStore(id: string, data: Partial<Store>): Promise<Store | null> {
    const store = await this.storeRepository.findById(id)
    if (!store) {
      throw new Error('Loja não encontrada')
    }

    const updatedData = {
      ...data,
      updatedAt: new Date(),
    }

    return await this.storeRepository.update(id, updatedData)
  }

  async approveStore(id: string): Promise<Store | null> {
    return await this.updateStore(id, {
      status: StoreStatus.ACTIVE,
    })
  }

  async suspendStore(id: string): Promise<Store | null> {
    return await this.updateStore(id, {
      status: StoreStatus.INACTIVE,
    })
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
}
