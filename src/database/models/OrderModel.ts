import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config'
import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from '../../models/Order'

interface OrderCreationAttributes
  extends Optional<Order, 'id' | 'createdAt' | 'updatedAt'> {}

class OrderModel
  extends Model<Order, OrderCreationAttributes>
  implements Order
{
  declare id: string
  declare orderNumber: string
  declare userId: string
  declare customerName: string
  declare customerPhone: string
  declare storeId: string
  declare items: OrderItem[]
  declare subtotal: number
  declare deliveryFee: number
  declare total: number
  declare deliveryAddress: string
  declare paymentMethod: PaymentMethod
  declare status: OrderStatus
  declare createdAt: Date
  declare updatedAt: Date
}

OrderModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'order_number',
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
    customerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'customer_name',
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'customer_phone',
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
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deliveryFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'delivery_fee',
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'delivery_address',
    },
    paymentMethod: {
      type: DataTypes.ENUM(...Object.values(PaymentMethod)),
      allowNull: false,
      field: 'payment_method',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      allowNull: false,
      defaultValue: OrderStatus.PENDING,
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
    tableName: 'orders',
    modelName: 'Order',
  }
)

export default OrderModel
