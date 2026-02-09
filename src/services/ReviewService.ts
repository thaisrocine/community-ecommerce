import { ReviewRepository } from '../repositories/ReviewRepository'
import { OrderRepository } from '../repositories/OrderRepository'
import { StoreRepository } from '../repositories/StoreRepository'
import { Review, ReviewStatus, ReviewStats } from '../models/Review'
import { OrderStatus } from '../models/Order'

export class ReviewService {
  private reviewRepository: ReviewRepository
  private orderRepository: OrderRepository
  private storeRepository: StoreRepository

  constructor() {
    this.reviewRepository = new ReviewRepository()
    this.orderRepository = new OrderRepository()
    this.storeRepository = new StoreRepository()
  }

  async createReview(data: Partial<Review>): Promise<Review> {
    if (!data.userId || !data.storeId || !data.rating || !data.comment) {
      throw new Error('Usuário, loja, nota e comentário são obrigatórios')
    }

    if (data.rating < 1 || data.rating > 5) {
      throw new Error('A nota deve ser entre 1 e 5')
    }

    const store = await this.storeRepository.findById(data.storeId)
    if (!store) {
      throw new Error('Loja não encontrada')
    }

    let verified = false

    if (data.orderId) {
      const existingReview = await this.reviewRepository.findByOrderId(
        data.orderId
      )
      if (existingReview) {
        throw new Error('Já existe uma avaliação para este pedido')
      }

      const order = await this.orderRepository.findById(data.orderId)
      if (!order) {
        throw new Error('Pedido não encontrado')
      }

      if (order.userId !== data.userId) {
        throw new Error('Este pedido não pertence ao usuário')
      }

      if (order.storeId !== data.storeId) {
        throw new Error('Este pedido não pertence a esta loja')
      }

      if (order.status === OrderStatus.DELIVERED) {
        verified = true
      }
    }

    const reviewData: Partial<Review> = {
      ...data,
      title: data.title || '',
      helpful: 0,
      notHelpful: 0,
      verified,
      status: ReviewStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return await this.reviewRepository.create(reviewData)
  }

  async getReviewById(id: string): Promise<Review | null> {
    return await this.reviewRepository.findById(id)
  }

  async getReviewsByStore(storeId: string): Promise<Review[]> {
    return await this.reviewRepository.findByStoreId(storeId)
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    return await this.reviewRepository.findByUserId(userId)
  }

  async getStoreStats(storeId: string): Promise<ReviewStats> {
    return await this.reviewRepository.getStoreStats(storeId)
  }

  async updateReview(id: string, data: Partial<Review>): Promise<Review | null> {
    const review = await this.reviewRepository.findById(id)
    if (!review) {
      throw new Error('Avaliação não encontrada')
    }

    delete data.id
    delete data.userId
    delete data.storeId
    delete data.orderId
    delete data.verified
    delete data.createdAt

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error('A nota deve ser entre 1 e 5')
    }

    const updatedData = {
      ...data,
      status: ReviewStatus.PENDING,
      updatedAt: new Date(),
    }

    return await this.reviewRepository.update(id, updatedData)
  }

  async deleteReview(id: string): Promise<boolean> {
    const review = await this.reviewRepository.findById(id)
    if (!review) {
      throw new Error('Avaliação não encontrada')
    }

    return await this.reviewRepository.delete(id)
  }

  async approveReview(id: string): Promise<Review | null> {
    const review = await this.reviewRepository.findById(id)
    if (!review) {
      throw new Error('Avaliação não encontrada')
    }

    return await this.reviewRepository.update(id, {
      status: ReviewStatus.APPROVED,
      updatedAt: new Date(),
    })
  }

  async rejectReview(id: string): Promise<Review | null> {
    const review = await this.reviewRepository.findById(id)
    if (!review) {
      throw new Error('Avaliação não encontrada')
    }

    return await this.reviewRepository.update(id, {
      status: ReviewStatus.REJECTED,
      updatedAt: new Date(),
    })
  }

  async respondToReview(
    id: string,
    ownerId: string,
    response: string
  ): Promise<Review | null> {
    const review = await this.reviewRepository.findById(id)
    if (!review) {
      throw new Error('Avaliação não encontrada')
    }

    const store = await this.storeRepository.findById(review.storeId)
    if (!store || store.ownerId !== ownerId) {
      throw new Error('Apenas o proprietário da loja pode responder avaliações')
    }

    return await this.reviewRepository.update(id, {
      ownerResponse: response,
      ownerRespondedAt: new Date(),
      updatedAt: new Date(),
    })
  }

  async markHelpful(id: string): Promise<Review | null> {
    const review = await this.reviewRepository.findById(id)
    if (!review) {
      throw new Error('Avaliação não encontrada')
    }

    return await this.reviewRepository.incrementHelpful(id)
  }

  async markNotHelpful(id: string): Promise<Review | null> {
    const review = await this.reviewRepository.findById(id)
    if (!review) {
      throw new Error('Avaliação não encontrada')
    }

    return await this.reviewRepository.incrementNotHelpful(id)
  }

  async getTopRatedStores(limit: number = 10): Promise<ReviewStats[]> {
    return await this.reviewRepository.findTopRatedStores(limit)
  }

  async getPendingReviews(): Promise<Review[]> {
    return await this.reviewRepository.findPendingReviews()
  }

  async canUserReviewStore(userId: string, storeId: string): Promise<boolean> {
    const userOrders = await this.orderRepository.findByUserId(userId)
    const deliveredOrders = userOrders.filter(
      (order) =>
        order.storeId === storeId && order.status === OrderStatus.DELIVERED
    )

    return deliveredOrders.length > 0
  }
}

