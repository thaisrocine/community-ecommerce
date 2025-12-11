import sequelize from './config'
import { UserModel, StoreModel, ProductModel, OrderModel } from './models'

export async function initializeDatabase(): Promise<void> {
  try {
    await sequelize.authenticate()
    console.log('Conexao com o banco de dados estabelecida com sucesso!')

    // Sincroniza os modelos com o banco de dados
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true })
      console.log('Modelos sincronizados com o banco de dados!')
    }
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error)
    throw error
  }
}

export async function closeDatabase(): Promise<void> {
  try {
    await sequelize.close()
    console.log('Conexao com o banco de dados fechada!')
  } catch (error) {
    console.error('Erro ao fechar conexao com o banco de dados:', error)
    throw error
  }
}

export { sequelize, UserModel, StoreModel, ProductModel, OrderModel }
