import { StoreService } from '../services/StoreService'
import { Store } from '../entities/Store'

export interface CreateStoreRequest {
  ownerId: string
  name: string
  description: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  deliveryFee: number
  latitude?: number
  longitude?: number
}

export interface UpdateStoreRequest {
  name?: string
  description?: string
  phone?: string
  address?: string
  deliveryFee?: number
  logo?: string
}

export class StoreController {
  private storeService: StoreService

  constructor() {
    this.storeService = new StoreService()
  }

  async create(data: CreateStoreRequest): Promise<Store> {
    try {
      return await this.storeService.createStore(data)
    } catch (error) {
      throw new Error(`Erro ao criar loja: ${error}`)
    }
  }

  async getById(id: string): Promise<Store | null> {
    try {
      return await this.storeService.getStoreById(id)
    } catch (error) {
      throw new Error(`Erro ao buscar loja: ${error}`)
    }
  }

  async getByOwner(ownerId: string): Promise<Store[]> {
    try {
      return await this.storeService.getStoresByOwner(ownerId)
    } catch (error) {
      throw new Error(`Erro ao buscar lojas do proprietário: ${error}`)
    }
  }

  async getNearby(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<Store[]> {
    try {
      return await this.storeService.getNearbyStores(
        latitude,
        longitude,
        radiusKm
      )
    } catch (error) {
      throw new Error(`Erro ao buscar lojas próximas: ${error}`)
    }
  }

  async update(id: string, data: UpdateStoreRequest): Promise<Store | null> {
    try {
      return await this.storeService.updateStore(id, data)
    } catch (error) {
      throw new Error(`Erro ao atualizar loja: ${error}`)
    }
  }

  async approve(id: string): Promise<Store | null> {
    try {
      return await this.storeService.approveStore(id)
    } catch (error) {
      throw new Error(`Erro ao aprovar loja: ${error}`)
    }
  }
}
