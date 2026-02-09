import { OrderService } from '../../services/OrderService'
import { OrderRepository } from '../../repositories/OrderRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { Order, OrderStatus, PaymentMethod } from '../../models/Order'
import { Product, ProductStatus } from '../../models/Product'

jest.mock('../../repositories/OrderRepository')
jest.mock('../../repositories/ProductRepository')

describe('OrderService', () => {
  let orderService: OrderService
  let mockOrderRepository: jest.Mocked<OrderRepository>
  let mockProductRepository: jest.Mocked<ProductRepository>

  const mockProduct: Product = {
    id: 'product-123',
    storeId: 'store-456',
    name: 'Produto Teste',
    description: 'Descrição',
    price: 29.9,
    stock: 100,
    status: ProductStatus.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  const mockOrder: Order = {
    id: 'order-123',
    orderNumber: '1704067200000123',
    userId: 'user-789',
    customerName: 'Cliente Teste',
    customerPhone: '11999999999',
    storeId: 'store-456',
    items: [
      {
        productId: 'product-123',
        productName: 'Produto Teste',
        price: 29.9,
        quantity: 2,
        subtotal: 59.8,
      },
    ],
    subtotal: 59.8,
    deliveryFee: 5.0,
    total: 64.8,
    deliveryAddress: 'Rua Teste, 123',
    paymentMethod: PaymentMethod.PIX,
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    orderService = new OrderService()
    mockOrderRepository = (orderService as any)
      .orderRepository as jest.Mocked<OrderRepository>
    mockProductRepository = (orderService as any)
      .productRepository as jest.Mocked<ProductRepository>
  })

  describe('createOrder', () => {
    it('deve criar um pedido com sucesso', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct)
      mockOrderRepository.create.mockResolvedValue(mockOrder)
      mockProductRepository.update.mockResolvedValue(mockProduct)

      const result = await orderService.createOrder({
        userId: 'user-789',
        storeId: 'store-456',
        items: [
          {
            productId: 'product-123',
            productName: 'Produto Teste',
            price: 29.9,
            quantity: 2,
            subtotal: 59.8,
          },
        ],
        deliveryFee: 5.0,
      })

      expect(result).toEqual(mockOrder)
      expect(mockOrderRepository.create).toHaveBeenCalled()
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        'product-123',
        expect.objectContaining({ stock: -2 })
      )
    })

    it('deve lançar erro quando userId não é fornecido', async () => {
      await expect(
        orderService.createOrder({
          storeId: 'store-456',
          items: [
            {
              productId: 'product-123',
              productName: 'Produto',
              price: 10,
              quantity: 1,
              subtotal: 10,
            },
          ],
        })
      ).rejects.toThrow('Dados incompletos para criar pedido')
    })

    it('deve lançar erro quando storeId não é fornecido', async () => {
      await expect(
        orderService.createOrder({
          userId: 'user-789',
          items: [
            {
              productId: 'product-123',
              productName: 'Produto',
              price: 10,
              quantity: 1,
              subtotal: 10,
            },
          ],
        })
      ).rejects.toThrow('Dados incompletos para criar pedido')
    })

    it('deve lançar erro quando items está vazio', async () => {
      await expect(
        orderService.createOrder({
          userId: 'user-789',
          storeId: 'store-456',
          items: [],
        })
      ).rejects.toThrow('Dados incompletos para criar pedido')
    })

    it('deve lançar erro quando produto não tem estoque suficiente', async () => {
      const productLowStock = { ...mockProduct, stock: 1 }
      mockProductRepository.findById.mockResolvedValue(productLowStock)

      await expect(
        orderService.createOrder({
          userId: 'user-789',
          storeId: 'store-456',
          items: [
            {
              productId: 'product-123',
              productName: 'Produto Teste',
              price: 29.9,
              quantity: 5,
              subtotal: 149.5,
            },
          ],
        })
      ).rejects.toThrow('Produto Produto Teste sem estoque suficiente')
    })

    it('deve lançar erro quando produto não existe', async () => {
      mockProductRepository.findById.mockResolvedValue(null)

      await expect(
        orderService.createOrder({
          userId: 'user-789',
          storeId: 'store-456',
          items: [
            {
              productId: 'product-inexistente',
              productName: 'Produto',
              price: 10,
              quantity: 1,
              subtotal: 10,
            },
          ],
        })
      ).rejects.toThrow('sem estoque suficiente')
    })

    it('deve calcular total corretamente com taxa de entrega', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct)
      mockOrderRepository.create.mockResolvedValue(mockOrder)
      mockProductRepository.update.mockResolvedValue(mockProduct)

      await orderService.createOrder({
        userId: 'user-789',
        storeId: 'store-456',
        items: [
          {
            productId: 'product-123',
            productName: 'Produto',
            price: 100,
            quantity: 2,
            subtotal: 200,
          },
        ],
        deliveryFee: 10,
      })

      expect(mockOrderRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          subtotal: 200,
          total: 210,
          deliveryFee: 10,
        })
      )
    })

    it('deve usar deliveryFee 0 quando não fornecido', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct)
      mockOrderRepository.create.mockResolvedValue(mockOrder)
      mockProductRepository.update.mockResolvedValue(mockProduct)

      await orderService.createOrder({
        userId: 'user-789',
        storeId: 'store-456',
        items: [
          {
            productId: 'product-123',
            productName: 'Produto',
            price: 100,
            quantity: 1,
            subtotal: 100,
          },
        ],
      })

      expect(mockOrderRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          subtotal: 100,
          total: 100,
          deliveryFee: 0,
        })
      )
    })
  })

  describe('getOrderById', () => {
    it('deve retornar pedido quando encontrado', async () => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder)

      const result = await orderService.getOrderById('order-123')

      expect(result).toEqual(mockOrder)
      expect(mockOrderRepository.findById).toHaveBeenCalledWith('order-123')
    })

    it('deve retornar null quando pedido não encontrado', async () => {
      mockOrderRepository.findById.mockResolvedValue(null)

      const result = await orderService.getOrderById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getOrdersByUser', () => {
    it('deve retornar pedidos do usuário', async () => {
      const orders = [mockOrder, { ...mockOrder, id: 'order-456' }]
      mockOrderRepository.findByUserId.mockResolvedValue(orders)

      const result = await orderService.getOrdersByUser('user-789')

      expect(result).toEqual(orders)
      expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith('user-789')
    })

    it('deve retornar lista vazia quando usuário não tem pedidos', async () => {
      mockOrderRepository.findByUserId.mockResolvedValue([])

      const result = await orderService.getOrdersByUser('user-without-orders')

      expect(result).toEqual([])
    })
  })

  describe('getOrdersByStore', () => {
    it('deve retornar pedidos da loja', async () => {
      const orders = [mockOrder]
      mockOrderRepository.findByStoreId.mockResolvedValue(orders)

      const result = await orderService.getOrdersByStore('store-456')

      expect(result).toEqual(orders)
      expect(mockOrderRepository.findByStoreId).toHaveBeenCalledWith(
        'store-456'
      )
    })

    it('deve retornar lista vazia quando loja não tem pedidos', async () => {
      mockOrderRepository.findByStoreId.mockResolvedValue([])

      const result = await orderService.getOrdersByStore('store-without-orders')

      expect(result).toEqual([])
    })
  })

  describe('updateOrderStatus', () => {
    it('deve atualizar status do pedido com sucesso', async () => {
      const updatedOrder = { ...mockOrder, status: OrderStatus.CONFIRMED }
      mockOrderRepository.findById.mockResolvedValue(mockOrder)
      mockOrderRepository.update.mockResolvedValue(updatedOrder)

      const result = await orderService.updateOrderStatus(
        'order-123',
        OrderStatus.CONFIRMED
      )

      expect(result).toEqual(updatedOrder)
      expect(mockOrderRepository.update).toHaveBeenCalledWith(
        'order-123',
        expect.objectContaining({ status: OrderStatus.CONFIRMED })
      )
    })

    it('deve lançar erro quando pedido não encontrado', async () => {
      mockOrderRepository.findById.mockResolvedValue(null)

      await expect(
        orderService.updateOrderStatus('non-existent', OrderStatus.CONFIRMED)
      ).rejects.toThrow('Pedido não encontrado')
    })
  })

  describe('confirmOrder', () => {
    it('deve confirmar pedido com sucesso', async () => {
      const confirmedOrder = { ...mockOrder, status: OrderStatus.CONFIRMED }
      mockOrderRepository.findById.mockResolvedValue(mockOrder)
      mockOrderRepository.update.mockResolvedValue(confirmedOrder)

      const result = await orderService.confirmOrder('order-123')

      expect(result).toEqual(confirmedOrder)
      expect(mockOrderRepository.update).toHaveBeenCalledWith(
        'order-123',
        expect.objectContaining({ status: OrderStatus.CONFIRMED })
      )
    })

    it('deve lançar erro quando pedido não encontrado', async () => {
      mockOrderRepository.findById.mockResolvedValue(null)

      await expect(orderService.confirmOrder('non-existent')).rejects.toThrow(
        'Pedido não encontrado'
      )
    })
  })

  describe('cancelOrder', () => {
    it('deve cancelar pedido e restaurar estoque', async () => {
      const cancelledOrder = { ...mockOrder, status: OrderStatus.CANCELLED }
      mockOrderRepository.findById.mockResolvedValue(mockOrder)
      mockProductRepository.update.mockResolvedValue(mockProduct)
      mockOrderRepository.update.mockResolvedValue(cancelledOrder)

      const result = await orderService.cancelOrder('order-123')

      expect(result).toEqual(cancelledOrder)
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        'product-123',
        expect.objectContaining({ stock: 2 })
      )
      expect(mockOrderRepository.update).toHaveBeenCalledWith(
        'order-123',
        expect.objectContaining({ status: OrderStatus.CANCELLED })
      )
    })

    it('deve restaurar estoque de múltiplos produtos ao cancelar', async () => {
      const orderWithMultipleItems: Order = {
        ...mockOrder,
        items: [
          {
            productId: 'product-1',
            productName: 'Produto 1',
            price: 10,
            quantity: 3,
            subtotal: 30,
          },
          {
            productId: 'product-2',
            productName: 'Produto 2',
            price: 20,
            quantity: 2,
            subtotal: 40,
          },
        ],
      }
      mockOrderRepository.findById.mockResolvedValue(orderWithMultipleItems)
      mockProductRepository.update.mockResolvedValue(mockProduct)
      mockOrderRepository.update.mockResolvedValue({
        ...orderWithMultipleItems,
        status: OrderStatus.CANCELLED,
      })

      await orderService.cancelOrder('order-123')

      expect(mockProductRepository.update).toHaveBeenCalledTimes(2)
      expect(mockProductRepository.update).toHaveBeenCalledWith('product-1', {
        stock: 3,
      })
      expect(mockProductRepository.update).toHaveBeenCalledWith('product-2', {
        stock: 2,
      })
    })

    it('deve lançar erro quando pedido não encontrado', async () => {
      mockOrderRepository.findById.mockResolvedValue(null)

      await expect(orderService.cancelOrder('non-existent')).rejects.toThrow(
        'Pedido não encontrado'
      )
    })
  })
})

