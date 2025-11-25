export enum StoreStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
}

export interface Store {
  id: string
  ownerId: string
  name: string
  slug: string
  description: string
  logo?: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  latitude?: number
  longitude?: number
  status: StoreStatus
  deliveryFee: number
  createdAt: Date
  updatedAt: Date
}
