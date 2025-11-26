import { BaseRepository } from './BaseRepository'
import { Product, ProductStatus } from '../models/Product'

export interface IProductRepository {
  findByStoreId(storeId: string): Promise<Product[]>
  findByStatus(status: ProductStatus): Promise<Product[]>
  search(query: string): Promise<Product[]>
}

export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository
{
  constructor() {
    super('products')
  }

  async findByStoreId(_storeId: string): Promise<Product[]> {
    throw new Error('Method not implemented ainda')
  }

  async findByStatus(_status: ProductStatus): Promise<Product[]> {
    throw new Error('Method not implemented ')
  }

  async search(_query: string): Promise<Product[]> {
    throw new Error('Method not implemented - connect database first')
  }
}
