import { OrderRepository } from '../repositories/OrderRepository'
import { ProductRepository } from '../repositories/ProductRepository'
import { Order, OrderStatus } from '../models/Order'

export class OrderService {
  private orderRepository: OrderRepository
  private productRepository: ProductRepository

  constructor() {
    this.orderRepository = new OrderRepository()
    this.productRepository = new ProductRepository()
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    if (
      !data.userId ||
      !data.storeId ||
      !data.items ||
      data.items.length === 0
    ) {
      throw new Error('Dados incompletos para criar pedido')
    }

    for (const item of data.items) {
      const product = await this.productRepository.findById(item.productId)
      if (!product || product.stock < item.quantity) {
        throw new Error(`Produto ${item.productName} sem estoque suficiente`)
      }
    }

    const subtotal = data.items.reduce((sum, item) => sum + item.subtotal, 0)
    const deliveryFee = data.deliveryFee || 0
    const total = subtotal + deliveryFee

    const orderNumber = this.generateOrderNumber()

    const orderData: Partial<Order> = {
      ...data,
      orderNumber,
      subtotal,
      total,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const order = await this.orderRepository.create(orderData)

    for (const item of data.items) {
      await this.productRepository.update(item.productId, {
        stock: -item.quantity,
      })
    }

    return order
  }

  async getOrderById(id: string): Promise<Order | null> {
    return await this.orderRepository.findById(id)
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await this.orderRepository.findByUserId(userId)
  }

  async getOrdersByStore(storeId: string): Promise<Order[]> {
    return await this.orderRepository.findByStoreId(storeId)
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus
  ): Promise<Order | null> {
    const order = await this.orderRepository.findById(id)
    if (!order) {
      throw new Error('Pedido não encontrado')
    }

    return await this.orderRepository.update(id, {
      status,
      updatedAt: new Date(),
    })
  }

  async confirmOrder(id: string): Promise<Order | null> {
    return await this.updateOrderStatus(id, OrderStatus.CONFIRMED)
  }

  async cancelOrder(id: string): Promise<Order | null> {
    const order = await this.orderRepository.findById(id)
    if (!order) {
      throw new Error('Pedido não encontrado')
    }

    for (const item of order.items) {
      await this.productRepository.update(item.productId, {
        stock: item.quantity,
      })
    }

    return await this.updateOrderStatus(id, OrderStatus.CANCELLED)
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    return `${timestamp}${random}`
  }
}
