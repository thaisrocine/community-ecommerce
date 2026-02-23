import UserModel from './UserModel'
import StoreModel from './StoreModel'
import ProductModel from './ProductModel'
import OrderModel from './OrderModel'
import ReviewModel from './ReviewModel'

// Definir associacoes
UserModel.hasMany(StoreModel, { foreignKey: 'ownerId', as: 'stores' })
StoreModel.belongsTo(UserModel, { foreignKey: 'ownerId', as: 'owner' })

StoreModel.hasMany(ProductModel, { foreignKey: 'storeId', as: 'products' })
ProductModel.belongsTo(StoreModel, { foreignKey: 'storeId', as: 'store' })

UserModel.hasMany(OrderModel, { foreignKey: 'userId', as: 'orders' })
OrderModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' })

StoreModel.hasMany(OrderModel, { foreignKey: 'storeId', as: 'orders' })
OrderModel.belongsTo(StoreModel, { foreignKey: 'storeId', as: 'store' })

// Review associations
UserModel.hasMany(ReviewModel, { foreignKey: 'userId', as: 'reviews' })
ReviewModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' })

StoreModel.hasMany(ReviewModel, { foreignKey: 'storeId', as: 'reviews' })
ReviewModel.belongsTo(StoreModel, { foreignKey: 'storeId', as: 'store' })

OrderModel.hasOne(ReviewModel, { foreignKey: 'orderId', as: 'review' })
ReviewModel.belongsTo(OrderModel, { foreignKey: 'orderId', as: 'order' })

export { UserModel, StoreModel, ProductModel, OrderModel, ReviewModel }
