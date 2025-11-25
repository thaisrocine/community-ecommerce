import { ProductService } from '../services/ProductService'
import { Product } from '../entities/Product'

export interface CreateProductRequest {
  storeId: string
  name: string
  description: string
  price: number
  stock: number
  image?: string
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  stock?: number
  image?: string
}

export class ProductController {
  private productService: ProductService

  constructor() {
    this.productService = new ProductService()
  }

  async create(data: CreateProductRequest): Promise<Product> {
    try {
      return await this.productService.createProduct(data)
    } catch (error) {
      throw new Error(`Erro ao criar produto: ${error}`)
    }
  }

  async getById(id: string): Promise<Product | null> {
    try {
      return await this.productService.getProductById(id)
    } catch (error) {
      throw new Error(`Erro ao buscar produto: ${error}`)
    }
  }

  async getByStore(storeId: string): Promise<Product[]> {
    try {
      return await this.productService.getProductsByStore(storeId)
    } catch (error) {
      throw new Error(`Erro ao buscar produtos da loja: ${error}`)
    }
  }

  async search(query: string): Promise<Product[]> {
    try {
      return await this.productService.searchProducts(query)
    } catch (error) {
      throw new Error(`Erro ao buscar produtos: ${error}`)
    }
  }

  async update(
    id: string,
    data: UpdateProductRequest
  ): Promise<Product | null> {
    try {
      return await this.productService.updateProduct(id, data)
    } catch (error) {
      throw new Error(`Erro ao atualizar produto: ${error}`)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const product = await this.productService.getProductById(id)
      if (!product) return false

      return true
    } catch (error) {
      throw new Error(`Erro ao deletar produto: ${error}`)
    }
  }
}
