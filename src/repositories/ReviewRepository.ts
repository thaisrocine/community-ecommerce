import { fn, col, literal } from 'sequelize'
import { Review, ReviewStatus, ReviewStats } from '../models/Review'
import ReviewModel from '../database/models/ReviewModel'

export interface IReviewRepository {
  findByStoreId(storeId: string): Promise<Review[]>
  findByUserId(userId: string): Promise<Review[]>
  findByStoreAndUser(storeId: string, userId: string): Promise<Review[]>
  getStoreStats(storeId: string): Promise<ReviewStats>
}

export class ReviewRepository implements IReviewRepository {
  async findById(id: string): Promise<Review | null> {
    const result = await ReviewModel.findByPk(id)
    return result ? (result.toJSON() as Review) : null
  }

  async findAll(filters?: Record<string, any>): Promise<Review[]> {
    const results = await ReviewModel.findAll({
      where: filters,
      order: [['createdAt', 'DESC']],
    })
    return results.map((result) => result.toJSON() as Review)
  }

  async create(data: Partial<Review>): Promise<Review> {
    const result = await ReviewModel.create(data as any)
    return result.toJSON() as Review
  }

  async update(id: string, data: Partial<Review>): Promise<Review | null> {
    const [affectedCount] = await ReviewModel.update(data as any, {
      where: { id } as any,
    })
    if (affectedCount === 0) return null
    return this.findById(id)
  }

  async delete(id: string): Promise<boolean> {
    const affectedCount = await ReviewModel.destroy({ where: { id } as any })
    return affectedCount > 0
  }

  async findByStoreId(
    storeId: string,
    status: ReviewStatus = ReviewStatus.APPROVED
  ): Promise<Review[]> {
    const results = await ReviewModel.findAll({
      where: { storeId, status } as any,
      order: [['createdAt', 'DESC']],
    })
    return results.map((result) => result.toJSON() as Review)
  }

  async findByUserId(userId: string): Promise<Review[]> {
    const results = await ReviewModel.findAll({
      where: { userId } as any,
      order: [['createdAt', 'DESC']],
    })
    return results.map((result) => result.toJSON() as Review)
  }

  async findByStoreAndUser(storeId: string, userId: string): Promise<Review[]> {
    const results = await ReviewModel.findAll({
      where: { storeId, userId } as any,
      order: [['createdAt', 'DESC']],
    })
    return results.map((result) => result.toJSON() as Review)
  }

  async findByOrderId(orderId: string): Promise<Review | null> {
    const result = await ReviewModel.findOne({
      where: { orderId } as any,
    })
    return result ? (result.toJSON() as Review) : null
  }

  async getStoreStats(storeId: string): Promise<ReviewStats> {
    const reviews = await ReviewModel.findAll({
      where: {
        storeId,
        status: ReviewStatus.APPROVED,
      } as any,
      attributes: ['rating'],
    })

    const totalReviews = reviews.length
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    let sumRatings = 0
    for (const review of reviews) {
      const rating = review.rating as 1 | 2 | 3 | 4 | 5
      ratingDistribution[rating]++
      sumRatings += rating
    }

    const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0

    return {
      storeId,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution,
    }
  }

  async findTopRatedStores(limit: number = 10): Promise<ReviewStats[]> {
    const results = await ReviewModel.findAll({
      where: { status: ReviewStatus.APPROVED } as any,
      attributes: [
        'storeId',
        [fn('AVG', col('rating')), 'averageRating'],
        [fn('COUNT', col('id')), 'totalReviews'],
      ],
      group: ['storeId'],
      having: literal('COUNT(id) >= 3'),
      order: [[literal('averageRating'), 'DESC']],
      limit,
      raw: true,
    })

    return results.map((r: any) => ({
      storeId: r.storeId,
      averageRating: Math.round(parseFloat(r.averageRating) * 10) / 10,
      totalReviews: parseInt(r.totalReviews, 10),
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }))
  }

  async findPendingReviews(): Promise<Review[]> {
    const results = await ReviewModel.findAll({
      where: { status: ReviewStatus.PENDING } as any,
      order: [['createdAt', 'ASC']],
    })
    return results.map((result) => result.toJSON() as Review)
  }

  async incrementHelpful(id: string): Promise<Review | null> {
    const review = await ReviewModel.findByPk(id)
    if (!review) return null

    await review.increment('helpful')
    return this.findById(id)
  }

  async incrementNotHelpful(id: string): Promise<Review | null> {
    const review = await ReviewModel.findByPk(id)
    if (!review) return null

    await review.increment('notHelpful')
    return this.findById(id)
  }
}

