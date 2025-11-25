export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
}

export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  customerName: string
  customerPhone: string
  storeId: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  deliveryAddress: string
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
}
