export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Review {
  id: string
  userId: string
  userName: string
  storeId: string
  orderId?: string
  rating: number
  title: string
  comment: string
  images?: string[]
  helpful: number
  notHelpful: number
  verified: boolean
  status: ReviewStatus
  ownerResponse?: string
  ownerRespondedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ReviewStats {
  storeId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

