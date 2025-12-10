import sequelize from './config'
import { UserModel, StoreModel, ProductModel, OrderModel } from './models'

export async function initializeDatabase(): Promise<void> {
  try {
    await sequelize.authenticate()
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!')

    // Sincroniza os modelos com o banco de dados
    // Em produção, use migrations ao invés de sync
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true })
      console.log('✅ Modelos sincronizados com o banco de dados!')
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error)
    throw error
  }
}

export async function closeDatabase(): Promise<void> {
  try {
    await sequelize.close()
    console.log('✅ Conexão com o banco de dados fechada!')
  } catch (error) {
    console.error('❌ Erro ao fechar conexão com o banco de dados:', error)
    throw error
  }
}

export { sequelize, UserModel, StoreModel, ProductModel, OrderModel }

