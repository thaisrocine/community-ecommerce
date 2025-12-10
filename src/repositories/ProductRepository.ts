import { Op } from 'sequelize'
import { Product, ProductStatus } from '../models/Product'
import { ProductModel } from '../database'

export interface IProductRepository {
  findByStoreId(storeId: string): Promise<Product[]>
  findByStatus(status: ProductStatus): Promise<Product[]>
  search(query: string): Promise<Product[]>
}

export class ProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    const result = await ProductModel.findByPk(id)
    return result ? (result.toJSON() as Product) : null
  }

  async findAll(filters?: Record<string, any>): Promise<Product[]> {
    const results = await ProductModel.findAll({ where: filters })
    return results.map((result) => result.toJSON() as Product)
  }

  async create(data: Partial<Product>): Promise<Product> {
    const result = await ProductModel.create(data as any)
    return result.toJSON() as Product
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const [affectedCount] = await ProductModel.update(data as any, {
      where: { id } as any,
    })
    if (affectedCount === 0) return null
    return this.findById(id)
  }

  async delete(id: string): Promise<boolean> {
    const affectedCount = await ProductModel.destroy({ where: { id } as any })
    return affectedCount > 0
  }

  async findByStoreId(storeId: string): Promise<Product[]> {
    const results = await ProductModel.findAll({
      where: { storeId } as any,
    })
    return results.map((result) => result.toJSON() as Product)
  }

  async findByStatus(status: ProductStatus): Promise<Product[]> {
    const results = await ProductModel.findAll({
      where: { status } as any,
    })
    return results.map((result) => result.toJSON() as Product)
  }

  async search(query: string): Promise<Product[]> {
    const results = await ProductModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
        status: ProductStatus.ACTIVE,
      } as any,
    })
    return results.map((result) => result.toJSON() as Product)
  }
}
