import dotenv from 'dotenv'
import express from 'express'
import routes from './routes'
import { initializeDatabase, closeDatabase } from './database'

dotenv.config()

const PORT = Number(process.env.PORT) || 3001

async function main(): Promise<void> {
  // Inicializa a conexao com o banco de dados
  await initializeDatabase()

  const app = express()

  // CORS - permite requisições do frontend
  app.use((_req, res, next) => {
    const origin = _req.headers.origin
    const allowed = ['http://localhost:3000', 'http://localhost:3001']
    if (origin && allowed.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    if (_req.method === 'OPTIONS') {
      res.status(204).end()
      return
    }
    next()
  })

  app.use(express.json())

  app.use('/', routes)

  app.get('/', (_req, res) => {
    res.json({ message: 'Community E-commerce API' })
  })

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', database: 'connected' })
  })

  const server = app.listen(PORT, () => {
    console.log('Community E-commerce iniciado!')
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`)
    console.log(`Porta: ${PORT}`)
  })

  process.on('SIGTERM', async () => {
    console.log('Encerrando servidor...')
    server.close(async () => {
      await closeDatabase()
      console.log('Servidor encerrado!')
      process.exit(0)
    })
  })

  process.on('SIGINT', async () => {
    console.log('Encerrando servidor...')
    server.close(async () => {
      await closeDatabase()
      console.log('Servidor encerrado!')
      process.exit(0)
    })
  })
}

main().catch((error) => {
  console.error('Erro ao iniciar a aplicacao:', error)
  process.exit(1)
})
