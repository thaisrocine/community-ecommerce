import { Router, Request, Response } from 'express'
import { OrderController } from '../controllers/OrderController'

const router = Router()
const orderController = new OrderController()

// POST /api/orders - Criar pedido
router.post('/', async (req: Request, res: Response) => {
  try {
    const order = await orderController.create(req.body)
    res.status(201).json(order)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// GET /api/orders/:id - Buscar pedido por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await orderController.getById(req.params.id)

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    res.json(order)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// GET /api/orders/user/:userId - Buscar pedidos por usuário
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const orders = await orderController.getByUser(req.params.userId)
    res.json(orders)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// GET /api/orders/store/:storeId - Buscar pedidos por loja
router.get('/store/:storeId', async (req: Request, res: Response) => {
  try {
    const orders = await orderController.getByStore(req.params.storeId)
    res.json(orders)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// PATCH /api/orders/:id/confirm - Confirmar pedido
router.patch('/:id/confirm', async (req: Request, res: Response) => {
  try {
    const order = await orderController.confirm(req.params.id)

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    res.json(order)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// PATCH /api/orders/:id/cancel - Cancelar pedido
router.patch('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const order = await orderController.cancel(req.params.id)

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    res.json(order)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

export default router
