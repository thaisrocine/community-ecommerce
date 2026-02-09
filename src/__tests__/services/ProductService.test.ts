import { ProductService } from '../../services/ProductService'
import { ProductRepository } from '../../repositories/ProductRepository'
import { Product, ProductStatus } from '../../models/Product'

jest.mock('../../repositories/ProductRepository')

describe('ProductService', () => {
  let productService: ProductService
  let mockProductRepository: jest.Mocked<ProductRepository>

  const mockProduct: Product = {
    id: 'product-123',
    storeId: 'store-456',
    name: 'Produto Teste',
    description: 'Descrição do produto teste',
    price: 29.9,
    stock: 100,
    status: ProductStatus.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    productService = new ProductService()
    mockProductRepository = (productService as any)
      .productRepository as jest.Mocked<ProductRepository>
  })

  describe('createProduct', () => {
    it('deve criar um produto com sucesso', async () => {
      mockProductRepository.create.mockResolvedValue(mockProduct)

      const result = await productService.createProduct({
        name: 'Produto Teste',
        storeId: 'store-456',
        price: 29.9,
      })

      expect(result).toEqual(mockProduct)
      expect(mockProductRepository.create).toHaveBeenCalled()
    })

    it('deve lançar erro quando nome não é fornecido', async () => {
      await expect(
        productService.createProduct({
          storeId: 'store-456',
          price: 29.9,
        })
      ).rejects.toThrow('Nome e loja são obrigatórios')
    })

    it('deve lançar erro quando storeId não é fornecido', async () => {
      await expect(
        productService.createProduct({
          name: 'Produto',
          price: 29.9,
        })
      ).rejects.toThrow('Nome e loja são obrigatórios')
    })

    it('deve lançar erro quando preço é zero ou negativo', async () => {
      await expect(
        productService.createProduct({
          name: 'Produto',
          storeId: 'store-456',
          price: 0,
        })
      ).rejects.toThrow('Preço deve ser maior que zero')

      await expect(
        productService.createProduct({
          name: 'Produto',
          storeId: 'store-456',
          price: -10,
        })
      ).rejects.toThrow('Preço deve ser maior que zero')
    })

    it('deve lançar erro quando preço não é fornecido', async () => {
      await expect(
        productService.createProduct({
          name: 'Produto',
          storeId: 'store-456',
        })
      ).rejects.toThrow('Preço deve ser maior que zero')
    })

    it('deve definir status e stock padrão quando não fornecidos', async () => {
      mockProductRepository.create.mockResolvedValue(mockProduct)

      await productService.createProduct({
        name: 'Produto',
        storeId: 'store-456',
        price: 29.9,
      })

      expect(mockProductRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ProductStatus.ACTIVE,
          stock: 0,
        })
      )
    })
  })

  describe('getProductById', () => {
    it('deve retornar produto quando encontrado', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct)

      const result = await productService.getProductById('product-123')

      expect(result).toEqual(mockProduct)
      expect(mockProductRepository.findById).toHaveBeenCalledWith('product-123')
    })

    it('deve retornar null quando produto não encontrado', async () => {
      mockProductRepository.findById.mockResolvedValue(null)

      const result = await productService.getProductById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getProductsByStore', () => {
    it('deve retornar produtos de uma loja', async () => {
      const products = [mockProduct, { ...mockProduct, id: 'product-456' }]
      mockProductRepository.findByStoreId.mockResolvedValue(products)

      const result = await productService.getProductsByStore('store-456')

      expect(result).toEqual(products)
      expect(mockProductRepository.findByStoreId).toHaveBeenCalledWith(
        'store-456'
      )
    })

    it('deve retornar lista vazia quando loja não tem produtos', async () => {
      mockProductRepository.findByStoreId.mockResolvedValue([])

      const result = await productService.getProductsByStore('store-empty')

      expect(result).toEqual([])
    })
  })

  describe('searchProducts', () => {
    it('deve retornar produtos que correspondem à busca', async () => {
      const products = [mockProduct]
      mockProductRepository.search.mockResolvedValue(products)

      const result = await productService.searchProducts('Teste')

      expect(result).toEqual(products)
      expect(mockProductRepository.search).toHaveBeenCalledWith('Teste')
    })

    it('deve retornar lista vazia quando não há correspondência', async () => {
      mockProductRepository.search.mockResolvedValue([])

      const result = await productService.searchProducts('xyz123')

      expect(result).toEqual([])
    })
  })

  describe('updateProduct', () => {
    it('deve atualizar produto com sucesso', async () => {
      const updatedProduct = { ...mockProduct, name: 'Produto Atualizado' }
      mockProductRepository.findById.mockResolvedValue(mockProduct)
      mockProductRepository.update.mockResolvedValue(updatedProduct)

      const result = await productService.updateProduct('product-123', {
        name: 'Produto Atualizado',
      })

      expect(result).toEqual(updatedProduct)
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        'product-123',
        expect.objectContaining({ name: 'Produto Atualizado' })
      )
    })

    it('deve lançar erro quando produto não encontrado', async () => {
      mockProductRepository.findById.mockResolvedValue(null)

      await expect(
        productService.updateProduct('non-existent', { name: 'Novo Nome' })
      ).rejects.toThrow('Produto não encontrado')
    })
  })

  describe('updateStock', () => {
    it('deve aumentar estoque com sucesso', async () => {
      const updatedProduct = { ...mockProduct, stock: 150 }
      mockProductRepository.findById.mockResolvedValue(mockProduct)
      mockProductRepository.update.mockResolvedValue(updatedProduct)

      const result = await productService.updateStock('product-123', 50)

      expect(result).toEqual(updatedProduct)
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        'product-123',
        expect.objectContaining({ stock: 150 })
      )
    })

    it('deve diminuir estoque com sucesso', async () => {
      const updatedProduct = { ...mockProduct, stock: 80 }
      mockProductRepository.findById.mockResolvedValue(mockProduct)
      mockProductRepository.update.mockResolvedValue(updatedProduct)

      const result = await productService.updateStock('product-123', -20)

      expect(result).toEqual(updatedProduct)
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        'product-123',
        expect.objectContaining({ stock: 80 })
      )
    })

    it('deve marcar como OUT_OF_STOCK quando estoque chega a zero', async () => {
      const productWithStock = { ...mockProduct, stock: 10 }
      mockProductRepository.findById.mockResolvedValue(productWithStock)
      mockProductRepository.update.mockResolvedValue({
        ...productWithStock,
        stock: 0,
        status: ProductStatus.OUT_OF_STOCK,
      })

      await productService.updateStock('product-123', -10)

      expect(mockProductRepository.update).toHaveBeenCalledWith(
        'product-123',
        expect.objectContaining({
          stock: 0,
          status: ProductStatus.OUT_OF_STOCK,
        })
      )
    })

    it('deve reativar produto quando estoque volta a ter itens', async () => {
      const outOfStockProduct = {
        ...mockProduct,
        stock: 0,
        status: ProductStatus.OUT_OF_STOCK,
      }
      mockProductRepository.findById.mockResolvedValue(outOfStockProduct)
      mockProductRepository.update.mockResolvedValue({
        ...outOfStockProduct,
        stock: 10,
        status: ProductStatus.ACTIVE,
      })

      await productService.updateStock('product-123', 10)

      expect(mockProductRepository.update).toHaveBeenCalledWith(
        'product-123',
        expect.objectContaining({
          stock: 10,
          status: ProductStatus.ACTIVE,
        })
      )
    })

    it('deve lançar erro quando produto não encontrado', async () => {
      mockProductRepository.findById.mockResolvedValue(null)

      await expect(
        productService.updateStock('non-existent', 10)
      ).rejects.toThrow('Produto não encontrado')
    })
  })
})

