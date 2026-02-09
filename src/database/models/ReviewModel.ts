import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config'
import { Review, ReviewStatus } from '../../models/Review'

interface ReviewCreationAttributes
  extends Optional<
    Review,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'images'
    | 'helpful'
    | 'notHelpful'
    | 'verified'
    | 'ownerResponse'
    | 'ownerRespondedAt'
    | 'orderId'
  > {}

class ReviewModel
  extends Model<Review, ReviewCreationAttributes>
  implements Review
{
  declare id: string
  declare userId: string
  declare userName: string
  declare storeId: string
  declare orderId?: string
  declare rating: number
  declare title: string
  declare comment: string
  declare images?: string[]
  declare helpful: number
  declare notHelpful: number
  declare verified: boolean
  declare status: ReviewStatus
  declare ownerResponse?: string
  declare ownerRespondedAt?: Date
  declare createdAt: Date
  declare updatedAt: Date
}

ReviewModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'user_name',
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'store_id',
      references: {
        model: 'stores',
        key: 'id',
      },
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'order_id',
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    helpful: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    notHelpful: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'not_helpful',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ReviewStatus)),
      allowNull: false,
      defaultValue: ReviewStatus.PENDING,
    },
    ownerResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'owner_response',
    },
    ownerRespondedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'owner_responded_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'reviews',
    modelName: 'Review',
    indexes: [
      {
        fields: ['store_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['rating'],
      },
      {
        fields: ['store_id', 'user_id'],
        unique: false,
      },
    ],
  }
)

export default ReviewModel

