import dotenv from 'dotenv'
import express, { Request, Response, NextFunction } from 'express'
import routes from './routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api', routes)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Erro:', err)
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message,
  })
})

async function main(): Promise<void> {
  try {
    app.listen(PORT, () => {
      console.log('🚀 Community E-commerce iniciado!')
      console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🌐 Servidor rodando em: http://localhost:${PORT}`)
      console.log(`💚 Health check: http://localhost:${PORT}/health`)
      console.log('\n📋 Rotas disponíveis:')
      console.log('  - POST   /api/users')
      console.log('  - POST   /api/users/login')
      console.log('  - GET    /api/users/:id')
      console.log('  - PUT    /api/users/:id')
      console.log('  - DELETE /api/users/:id')
      console.log('\n  - POST   /api/stores')
      console.log('  - GET    /api/stores/:id')
      console.log('  - GET    /api/stores/owner/:ownerId')
      console.log('  - GET    /api/stores/nearby?latitude=&longitude=&radius=')
      console.log('  - PUT    /api/stores/:id')
      console.log('  - PATCH  /api/stores/:id/approve')
      console.log('\n  - POST   /api/products')
      console.log('  - GET    /api/products/:id')
      console.log('  - GET    /api/products/store/:storeId')
      console.log('  - GET    /api/products/search?q=')
      console.log('  - PUT    /api/products/:id')
      console.log('  - DELETE /api/products/:id')
      console.log('\n  - POST   /api/orders')
      console.log('  - GET    /api/orders/:id')
      console.log('  - GET    /api/orders/user/:userId')
      console.log('  - GET    /api/orders/store/:storeId')
      console.log('  - PATCH  /api/orders/:id/confirm')
      console.log('  - PATCH  /api/orders/:id/cancel')
    })
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ Erro ao iniciar a aplicação:', error)
  process.exit(1)
})
