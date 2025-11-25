import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000

async function main(): Promise<void> {
  console.log('Community E-commerce iniciado!')
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Porta: ${PORT}`)
}

main().catch((error) => {
  console.error('❌ Erro ao iniciar a aplicação:', error)
  process.exit(1)
})
