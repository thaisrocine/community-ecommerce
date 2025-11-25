import { ProductRepository } from '../repositories/ProductRepository'
import { Product, ProductStatus } from '../entities/Product'

export class ProductService {
  private productRepository: ProductRepository

  constructor() {
    this.productRepository = new ProductRepository()
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    if (!data.name || !data.storeId) {
      throw new Error('Nome e loja são obrigatórios')
    }

    if (!data.price || data.price <= 0) {
      throw new Error('Preço deve ser maior que zero')
    }

    const productData: Partial<Product> = {
      ...data,
      status: data.status || ProductStatus.ACTIVE,
      stock: data.stock || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return await this.productRepository.create(productData)
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.productRepository.findById(id)
  }

  async getProductsByStore(storeId: string): Promise<Product[]> {
    return await this.productRepository.findByStoreId(storeId)
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await this.productRepository.search(query)
  }

  async updateProduct(
    id: string,
    data: Partial<Product>
  ): Promise<Product | null> {
    const product = await this.productRepository.findById(id)
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    const updatedData = {
      ...data,
      updatedAt: new Date(),
    }

    return await this.productRepository.update(id, updatedData)
  }

  async updateStock(id: string, quantity: number): Promise<Product | null> {
    const product = await this.productRepository.findById(id)
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    const newStock = product.stock + quantity
    let status = product.status

    if (newStock <= 0) {
      status = ProductStatus.OUT_OF_STOCK
    } else if (product.status === ProductStatus.OUT_OF_STOCK && newStock > 0) {
      status = ProductStatus.ACTIVE
    }

    return await this.productRepository.update(id, {
      stock: newStock,
      status,
      updatedAt: new Date(),
    })
  }
}
