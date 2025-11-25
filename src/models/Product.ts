export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface Product {
  id: string
  storeId: string
  name: string
  description: string
  image?: string
  price: number
  stock: number
  status: ProductStatus
  createdAt: Date
  updatedAt: Date
}
