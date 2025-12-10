import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config'
import { Product, ProductStatus } from '../../models/Product'

interface ProductCreationAttributes
  extends Optional<Product, 'id' | 'createdAt' | 'updatedAt' | 'image'> {}

class ProductModel
  extends Model<Product, ProductCreationAttributes>
  implements Product
{
  declare id: string
  declare storeId: string
  declare name: string
  declare description: string
  declare image?: string
  declare price: number
  declare stock: number
  declare status: ProductStatus
  declare createdAt: Date
  declare updatedAt: Date
}

ProductModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ProductStatus)),
      allowNull: false,
      defaultValue: ProductStatus.ACTIVE,
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
    tableName: 'products',
    modelName: 'Product',
  }
)

export default ProductModel
