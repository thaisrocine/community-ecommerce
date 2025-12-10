import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config'
import { Store, StoreStatus } from '../../models/Store'

interface StoreCreationAttributes
  extends Optional<
    Store,
    'id' | 'createdAt' | 'updatedAt' | 'logo' | 'latitude' | 'longitude'
  > {}

class StoreModel
  extends Model<Store, StoreCreationAttributes>
  implements Store
{
  declare id: string
  declare ownerId: string
  declare name: string
  declare slug: string
  declare description: string
  declare logo?: string
  declare phone: string
  declare email: string
  declare address: string
  declare city: string
  declare state: string
  declare latitude?: number
  declare longitude?: number
  declare status: StoreStatus
  declare deliveryFee: number
  declare createdAt: Date
  declare updatedAt: Date
}

StoreModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'owner_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(StoreStatus)),
      allowNull: false,
      defaultValue: StoreStatus.PENDING_APPROVAL,
    },
    deliveryFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'delivery_fee',
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
    tableName: 'stores',
    modelName: 'Store',
  }
)

export default StoreModel
