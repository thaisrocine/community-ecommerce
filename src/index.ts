import dotenv from 'dotenv'
import express from 'express'
import routes from './routes'

dotenv.config()

const PORT = Number(process.env.PORT) || 3000

async function main(): Promise<void> {
  const app = express()
  app.use(express.json())

  app.use('/', routes)

  app.get('/', (_req, res) => {
    res.json({ message: 'Community E-commerce API' })
  })

  app.listen(PORT, () => {
    console.log('Community E-commerce iniciado!')
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`)
    console.log(`Porta: ${PORT}`)
  })
}

main().catch((error) => {
  console.error(' Erro ao iniciar a aplicação:', error)
  process.exit(1)
})
