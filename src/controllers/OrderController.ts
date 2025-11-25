import { OrderService } from '../services/OrderService'
import { Order, OrderItem, PaymentMethod } from '../models/Order'

export interface CreateOrderRequest {
  userId: string
  customerName: string
  customerPhone: string
  storeId: string
  items: OrderItem[]
  deliveryAddress: string
  deliveryFee: number
  paymentMethod: PaymentMethod
}

export class OrderController {
  private orderService: OrderService

  constructor() {
    this.orderService = new OrderService()
  }

  async create(data: CreateOrderRequest): Promise<Order> {
    try {
      return await this.orderService.createOrder(data)
    } catch (error) {
      throw new Error(`Erro ao criar pedido: ${error}`)
    }
  }

  async getById(id: string): Promise<Order | null> {
    try {
      return await this.orderService.getOrderById(id)
    } catch (error) {
      throw new Error(`Erro ao buscar pedido: ${error}`)
    }
  }

  async getByUser(userId: string): Promise<Order[]> {
    try {
      return await this.orderService.getOrdersByUser(userId)
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos do usuário: ${error}`)
    }
  }

  async getByStore(storeId: string): Promise<Order[]> {
    try {
      return await this.orderService.getOrdersByStore(storeId)
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos da loja: ${error}`)
    }
  }

  async confirm(id: string): Promise<Order | null> {
    try {
      return await this.orderService.confirmOrder(id)
    } catch (error) {
      throw new Error(`Erro ao confirmar pedido: ${error}`)
    }
  }

  async cancel(id: string): Promise<Order | null> {
    try {
      return await this.orderService.cancelOrder(id)
    } catch (error) {
      throw new Error(`Erro ao cancelar pedido: ${error}`)
    }
  }
}
