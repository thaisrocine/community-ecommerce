export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  STORE_OWNER = 'STORE_OWNER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface User {
  id: string
  email: string
  password: string
  name: string
  phone: string
  role: UserRole
  status: UserStatus
  avatar?: string
  createdAt: Date
  updatedAt: Date
}
