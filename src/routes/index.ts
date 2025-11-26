import { Router } from 'express'
import userRoutes from './userRoutes'
import storeRoutes from './storeRoutes'
import productRoutes from './productRoutes'
import orderRoutes from './orderRoutes'

const router = Router()

// Registrar todas as rotas
router.use('/users', userRoutes)
router.use('/stores', storeRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)

export default router

