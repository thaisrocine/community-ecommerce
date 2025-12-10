import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config'
import { User, UserRole, UserStatus } from '../../models/User'

interface UserCreationAttributes
  extends Optional<User, 'id' | 'createdAt' | 'updatedAt' | 'avatar'> {}

class UserModel extends Model<User, UserCreationAttributes> implements User {
  declare id: string
  declare email: string
  declare password: string
  declare name: string
  declare phone: string
  declare role: UserRole
  declare status: UserStatus
  declare avatar?: string
  declare createdAt: Date
  declare updatedAt: Date
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.CLIENT,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserStatus)),
      allowNull: false,
      defaultValue: UserStatus.ACTIVE,
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
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
    tableName: 'users',
    modelName: 'User',
  }
)

export default UserModel
