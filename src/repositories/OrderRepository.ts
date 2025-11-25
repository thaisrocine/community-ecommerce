import { BaseRepository } from './BaseRepository'
import { Order, OrderStatus } from '../models/Order'

export interface IOrderRepository {
  findByUserId(userId: string): Promise<Order[]>
  findByStoreId(storeId: string): Promise<Order[]>
  findByOrderNumber(orderNumber: string): Promise<Order | null>
  findByStatus(status: OrderStatus): Promise<Order[]>
}

export class OrderRepository
  extends BaseRepository<Order>
  implements IOrderRepository
{
  constructor() {
    super('orders')
  }

  async findByUserId(_userId: string): Promise<Order[]> {
    throw new Error('Method not implemented - connect database first')
  }

  async findByStoreId(_storeId: string): Promise<Order[]> {
    throw new Error('Method not implemented - connect database first')
  }

  async findByOrderNumber(_orderNumber: string): Promise<Order | null> {
    throw new Error('Method not implemented - connect database first')
  }

  async findByStatus(_status: OrderStatus): Promise<Order[]> {
    throw new Error('Method not implemented - connect database first')
  }
}
