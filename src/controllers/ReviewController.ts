import { ReviewService } from '../services/ReviewService'
import { Review, ReviewStats } from '../models/Review'

export class ReviewController {
  private reviewService: ReviewService

  constructor() {
    this.reviewService = new ReviewService()
  }

  async create(data: Partial<Review>): Promise<Review> {
    return await this.reviewService.createReview(data)
  }

  async getById(id: string): Promise<Review | null> {
    return await this.reviewService.getReviewById(id)
  }

  async getByStore(storeId: string): Promise<Review[]> {
    return await this.reviewService.getReviewsByStore(storeId)
  }

  async getByUser(userId: string): Promise<Review[]> {
    return await this.reviewService.getReviewsByUser(userId)
  }

  async getStoreStats(storeId: string): Promise<ReviewStats> {
    return await this.reviewService.getStoreStats(storeId)
  }

  async update(id: string, data: Partial<Review>): Promise<Review | null> {
    return await this.reviewService.updateReview(id, data)
  }

  async delete(id: string): Promise<boolean> {
    return await this.reviewService.deleteReview(id)
  }

  async approve(id: string): Promise<Review | null> {
    return await this.reviewService.approveReview(id)
  }

  async reject(id: string): Promise<Review | null> {
    return await this.reviewService.rejectReview(id)
  }

  async respond(
    id: string,
    ownerId: string,
    response: string
  ): Promise<Review | null> {
    return await this.reviewService.respondToReview(id, ownerId, response)
  }

  async markHelpful(id: string): Promise<Review | null> {
    return await this.reviewService.markHelpful(id)
  }

  async markNotHelpful(id: string): Promise<Review | null> {
    return await this.reviewService.markNotHelpful(id)
  }

  async getTopRatedStores(limit: number = 10): Promise<ReviewStats[]> {
    return await this.reviewService.getTopRatedStores(limit)
  }

  async getPending(): Promise<Review[]> {
    return await this.reviewService.getPendingReviews()
  }

  async canUserReview(userId: string, storeId: string): Promise<boolean> {
    return await this.reviewService.canUserReviewStore(userId, storeId)
  }
}


