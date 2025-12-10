import dotenv from 'dotenv'
import express from 'express'
import routes from './routes'
import { initializeDatabase, closeDatabase } from './database'

dotenv.config()

const PORT = Number(process.env.PORT) || 3000

async function main(): Promise<void> {
  // Inicializa a conexão com o banco de dados
  await initializeDatabase()

  const app = express()
  app.use(express.json())

  app.use('/', routes)

  app.get('/', (_req, res) => {
    res.json({ message: 'Community E-commerce API' })
  })

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', database: 'connected' })
  })

  const server = app.listen(PORT, () => {
    console.log('🚀 Community E-commerce iniciado!')
    console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 Porta: ${PORT}`)
  })

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('⏳ Encerrando servidor...')
    server.close(async () => {
      await closeDatabase()
      console.log('✅ Servidor encerrado!')
      process.exit(0)
    })
  })

  process.on('SIGINT', async () => {
    console.log('⏳ Encerrando servidor...')
    server.close(async () => {
      await closeDatabase()
      console.log('✅ Servidor encerrado!')
      process.exit(0)
    })
  })
}

main().catch((error) => {
  console.error('❌ Erro ao iniciar a aplicação:', error)
  process.exit(1)
})
