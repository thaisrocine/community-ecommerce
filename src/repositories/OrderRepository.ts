import { Order, OrderStatus } from '../models/Order'
import { OrderModel } from '../database'

export interface IOrderRepository {
  findByUserId(userId: string): Promise<Order[]>
  findByStoreId(storeId: string): Promise<Order[]>
  findByOrderNumber(orderNumber: string): Promise<Order | null>
  findByStatus(status: OrderStatus): Promise<Order[]>
}

export class OrderRepository implements IOrderRepository {
  async findById(id: string): Promise<Order | null> {
    const result = await OrderModel.findByPk(id)
    return result ? (result.toJSON() as Order) : null
  }

  async findAll(filters?: Record<string, any>): Promise<Order[]> {
    const results = await OrderModel.findAll({ where: filters })
    return results.map((result) => result.toJSON() as Order)
  }

  async create(data: Partial<Order>): Promise<Order> {
    const result = await OrderModel.create(data as any)
    return result.toJSON() as Order
  }

  async update(id: string, data: Partial<Order>): Promise<Order | null> {
    const [affectedCount] = await OrderModel.update(data as any, {
      where: { id } as any,
    })
    if (affectedCount === 0) return null
    return this.findById(id)
  }

  async delete(id: string): Promise<boolean> {
    const affectedCount = await OrderModel.destroy({ where: { id } as any })
    return affectedCount > 0
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const results = await OrderModel.findAll({
      where: { userId } as any,
      order: [['createdAt', 'DESC']],
    })
    return results.map((result) => result.toJSON() as Order)
  }

  async findByStoreId(storeId: string): Promise<Order[]> {
    const results = await OrderModel.findAll({
      where: { storeId } as any,
      order: [['createdAt', 'DESC']],
    })
    return results.map((result) => result.toJSON() as Order)
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const result = await OrderModel.findOne({
      where: { orderNumber } as any,
    })
    return result ? (result.toJSON() as Order) : null
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const results = await OrderModel.findAll({
      where: { status } as any,
      order: [['createdAt', 'DESC']],
    })
    return results.map((result) => result.toJSON() as Order)
  }
}
